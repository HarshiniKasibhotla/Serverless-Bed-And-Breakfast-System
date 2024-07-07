import json
import boto3
import uuid
import requests

dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
table = dynamodb.Table("TourBookingTable")

def lambda_handler(event, context):
    response = json.loads(event['body'])
    booking_id = str(uuid.uuid4())

    if response['user_id'] != "":
        table.put_item(Item= {'booking_number': booking_id, 'no_of_people': response['no_of_people'], 'price': int(response['price'])* int(response['no_of_people']), 'tour_name': response['tour_name'] , 'user_id': response['user_id']})
        statusCode = 200
        message = 'Tour with package name '  + response['tour_name'] + ' booked successfully for ' + str(response['no_of_people']) + ' people'
    else:
        statusCode = 400
        message = 'Tour could not be booked. Please try again!'
    result1 = {"message": message, "booking_number":booking_id,"price": int(response['price'])* int(response['no_of_people'])}
    result = {"message": message, "user_id": response["user_id"]}
    url = "https://us-central1-csci5410-project-355011.cloudfunctions.net/pubsub-publisher"
    x = requests.post(url, json = result)
    
    res = {'statusCode':  statusCode, 'body': json.dumps(result1), 'headers':  {'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*'}}
    return res
