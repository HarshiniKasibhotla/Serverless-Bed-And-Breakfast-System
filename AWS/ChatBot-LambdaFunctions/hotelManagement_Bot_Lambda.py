import json
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
import urllib3
import uuid

dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
cognitoClient = boto3.client('cognito-idp')
table = dynamodb.Table("AvailableRooms")
table_customer = dynamodb.Table("room_booking")
table_tourbooking = dynamodb.Table("TourBookingTable")
table_foodAvailability = dynamodb.Table("Food_availability")
table_foodOrder = dynamodb.Table("Food_Booking")

def lambda_handler(event, context):
    http = urllib3.PoolManager()
    print(event)
    print(event['currentIntent']['name'])
    if event['currentIntent']['name'] == 'Rooms_':
        print('inside rooms')
        slots = event['currentIntent']['slots']
        print(slots)
        status = validateUser(event['currentIntent']['slots']['user'])
        if status == "verified":
            room_message = bookRoom(slots)
            response = {
             'sessionAttributes': event['sessionAttributes'],
             'dialogAction': {
             'type': 'Close',
             'fulfillmentState': 'Fulfilled',
             'message': {'contentType': 'PlainText',
             'content': room_message
            }
            }}
        else:
            response = {
             'sessionAttributes': event['sessionAttributes'],
             'dialogAction': {
             'type': 'Close',
             'fulfillmentState': 'Fulfilled',
             'message': {'contentType': 'PlainText',
             'content': "The email id you have provided is not registered with our website. Please check the email Id and try again.. Thank you!"
            }
            }}
        return response
    if event['currentIntent']['name'] == 'Tours_':
        print('inside tours')
        slots = event['currentIntent']['slots']
        print(slots)
        status = validateUser(event['currentIntent']['slots']['user'])
        if status == "verified":
            tour_message = bookTour(slots)
            response = {
             'sessionAttributes': event['sessionAttributes'],
             'dialogAction': {
             'type': 'Close',
             'fulfillmentState': 'Fulfilled',
             'message': {'contentType': 'PlainText',
             'content': tour_message
            }
            }}
        else:
            response = {
             'sessionAttributes': event['sessionAttributes'],
             'dialogAction': {
             'type': 'Close',
             'fulfillmentState': 'Fulfilled',
             'message': {'contentType': 'PlainText',
             'content': "The email id you have provided is not registered with our website. Please check the email Id and try again.. Thank you!"
            }
            }}
        return response
    if event['currentIntent']['name'] == 'GetFoodItems':
        print('inside food')
        response = table_foodAvailability.scan()
        items = response["Items"]
        itemsList = ""
        for item in items:
            if (int(item['avail_count']) != 0):
                itemsList += item['food_name']+"\n"
        slots = event['currentIntent']['slots']
        
        response = {
             'sessionAttributes': event['sessionAttributes'],
             'dialogAction': {
             'type': 'Close',
             'fulfillmentState': 'Fulfilled',
             'message': {'contentType': 'PlainText',
             'content': "Here are the list of items available at this moment: \n" + itemsList + "\n To order food, please type 'order'"
     }
     }}
        return response
    if event['currentIntent']['name'] == 'Food_Order':
        print('inside food')
        slots = event['currentIntent']['slots']
        status = validateUser(event['currentIntent']['slots']['user'])
        if status == "verified":
            food_message = orderFood(slots)
            response = {
             'sessionAttributes': event['sessionAttributes'],
             'dialogAction': {
             'type': 'Close',
             'fulfillmentState': 'Fulfilled',
             'message': {'contentType': 'PlainText',
             'content': food_message
            }
            }}
        else:
            response = {
             'sessionAttributes': event['sessionAttributes'],
             'dialogAction': {
             'type': 'Close',
             'fulfillmentState': 'Fulfilled',
             'message': {'contentType': 'PlainText',
             'content': "The email id you have provided is not registered with our website. Please check the email Id and try again.. Thank you!"
            }
            }}
        return response
    
def bookRoom(slots):
    booking_id = str(uuid.uuid4())
    available_rooms = ['101','102','103','104','105','106','107','108','109','110']
    now = datetime.strptime(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "%Y-%m-%d %H:%M:%S")
    
    for room in available_rooms:
        available_from = table.get_item(Key={'room_number': room})
        available_from = datetime.strptime(available_from["Item"]["available_from"], '%Y-%m-%d %H:%M:%S')
        
        if now > available_from:
            table.put_item(Item= {'room_number': room, 'available_from': str(datetime.now().strftime("%Y-%m-%d %H:%M:%S")) })

    
    checkin_date = datetime.strptime(slots["checkin_date"]+" 00:00:00", '%Y-%m-%d %H:%M:%S')
    checkout_date = datetime.strptime(slots["checkout_date"]+" 00:00:00", '%Y-%m-%d %H:%M:%S')
    available_from = table.get_item(Key={'room_number': slots["room_number"]})
    available_from = datetime.strptime(available_from["Item"]["available_from"], '%Y-%m-%d %H:%M:%S')
    
    if (checkin_date >= checkout_date) or (checkin_date < now):
        message = "Please enter valid check-in and check-out dates"
    elif available_from > checkin_date:
        message = "Room is unavailable on selected dates"
    else:
        price = int(slots["room_number"]) * int(slots["count"])
        table.put_item(Item= {'room_number': slots["room_number"], 'available_from': str(checkout_date) })
        table_customer.put_item(Item= {'booking_id': booking_id, 'checkin_date': slots["checkin_date"]+" 00:00:00", 'checkout_date': slots["checkout_date"]+" 00:00:00", 'room_number': slots["room_number"], 'price': price, 'user': slots["user"], 'no_of_people': slots["count"], 'booking_time': datetime.now().strftime("%Y-%m-%d %H:%M:%S") })
        message = "Room booked successfully"
    return message
    
def bookTour(slots):
    booking_id = str(uuid.uuid4())
    if(slots['tour_name'] == "normal"):
        price = int(slots['people']) * 500
    if(slots['tour_name'] == "deluxe"):
        price = int(slots['people']) * 600
    if slots['people'] != "0":
        table_tourbooking.put_item(Item= {'booking_number': booking_id, 'no_of_people' : slots['people'], 'price': price, 'tour_name': slots['tour_name'], 'user': slots['user'], 'tour_booking_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")} )
        statusCode = 200
        message = 'Tour booked successfully'
    else:
        statusCode = 400
        message = 'Tour could not be booked. Please try again!'
    return message
    
def orderFood(slots):
    booking_id = str(uuid.uuid4())
    countdata = {'count' : slots['count']}
    fooddata = {'food_name' : slots['item_name']}
    orderList = [{'count':countdata,'food':fooddata }]
    table_foodOrder.put_item(Item = {'order_id': booking_id, 'order_list': orderList , 'user_id' : slots['user'], 'order_time':datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
    response = table_foodAvailability.scan()
    items = response["Items"]
    print(response)
    for item in items:
        if item['food_name'].lower() == slots['item_name'].lower():
            print('inside if')
            dbItem = item
            dbCount = int(item['avail_count'])
            break
    table_foodAvailability.update_item(
    Key={'food_name': slots['item_name'].capitalize() },
    UpdateExpression="SET avail_count = :c",
    ExpressionAttributeValues={":c": dbCount - int(slots['count'])},
    )
    message = 'Order placed successfully'
    return message
def validateUser(id):
    filter = "Email address = " + id
    response = cognitoClient.list_users(
    UserPoolId='us-east-1_HEdNHqk4c'
    )
    users = response['Users']
    status = "not_verified"
    for user in users:
        att = user['Attributes']
        for name in att:
            if name['Name'] == "email":
                if name['Value'] == id:
                    status = "verified"
                    break
        if status == "verified":
            break
    return status