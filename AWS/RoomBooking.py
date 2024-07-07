import json
import boto3
import uuid
from datetime import datetime
import requests

dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
table = dynamodb.Table("AvailableRooms")
table_customer = dynamodb.Table("room_booking")

def lambda_handler(event, context):
	response = json.loads(event['body'])
	booking_id = str(uuid.uuid4())
	available_rooms = ['101','102','103','104','105', '106', '107', '108', '109', '110']
	now = datetime.strptime(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S")
	
	for room in available_rooms:
		available_from = table.get_item(Key={'room_number': room})
		available_from = datetime.strptime(available_from["Item"]["available_from"], '%Y-%m-%d %H:%M:%S')
		
		if now > available_from:
			table.put_item(Item= {'room_number': room, 'available_from': str(datetime.now().strftime("%Y-%m-%d %H:%M:%S")) })

	
	checkin_date = datetime.strptime(response["checkin_date"], '%Y-%m-%d %H:%M:%S')
	checkout_date = datetime.strptime(response["checkout_date"], '%Y-%m-%d %H:%M:%S')
	available_from = table.get_item(Key={'room_number': response["room_number"]})
	available_from = datetime.strptime(available_from["Item"]["available_from"], '%Y-%m-%d %H:%M:%S')
	
	if (checkin_date >= checkout_date) or (checkin_date < now):
		statusCode = 200
		message = "Please enter valid check-in and check-out dates"
	elif available_from > checkin_date:
		statusCode = 200
		message = "Room is unavailable on selected dates"
	else:
		calculatedPrice = int(response["room_number"]) * int(response["no_of_people"])
		table.put_item(Item= {'room_number': response["room_number"], 'available_from': str(checkout_date) })
		table_customer.put_item(Item= {'booking_id': booking_id, 'checkin_date': response["checkin_date"], 'checkout_date': response["checkout_date"], 'room_number': response["room_number"], 'price': calculatedPrice, 'user_id': response["user_id"], 'no_of_people': response["no_of_people"] })
		statusCode = 200
		message = "Room number " + response["room_number"] + " booked successfully for the dates " + response["checkin_date"] + " and " + response["checkout_date"]


	result = {"message": message, "user_id": response["user_id"], "booking_id": booking_id, "price":calculatedPrice}
	url = "https://us-central1-csci5410-project-355011.cloudfunctions.net/pubsub-publisher"
	x = requests.post(url, json = result)
        
	response = { 'statusCode':  statusCode, 'headers':  {'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*'}, 'body': json.dumps(result)}
	return response