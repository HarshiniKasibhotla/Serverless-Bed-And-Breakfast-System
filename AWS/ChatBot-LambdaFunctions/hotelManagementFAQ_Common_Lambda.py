import json
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime

dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
table_foodAvailability = dynamodb.Table("Food_availability")

def lambda_handler(event, context):
    print(event)
    print(event['currentIntent']['name'])
    if event['currentIntent']['name'] == 'Food_':
        response = table_foodAvailability.scan()
        items = response["Items"]
        itemsList = ""
        for item in items:
            itemsList += item['food_name']+"\n"
        response = {
             'sessionAttributes': event['sessionAttributes'],
             'dialogAction': {
             'type': 'Close',
             'fulfillmentState': 'Fulfilled',
             'message': {'contentType': 'PlainText',
             'content': "We usually have these food items available: " + itemsList
     }
     }}
        return response
    if event['currentIntent']['name'] == 'Rooms':
        slots = event['currentIntent']['slots']
        given_date = datetime.strptime(slots["date"]+" 00:00:00", '%Y-%m-%d %H:%M:%S')
        dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
        table = dynamodb.Table("AvailableRooms")
        rooms = table.scan()
        availabilities = rooms["Items"]
        count = 0
        for room in availabilities:
            dbdate = datetime.strptime(room['available_from'], '%Y-%m-%d %H:%M:%S')
            if dbdate <= given_date:
                count += 1
        if count == 0:
            response = {
             'sessionAttributes': event['sessionAttributes'],
             'dialogAction': {
             'type': 'Close',
             'fulfillmentState': 'Fulfilled',
             'message': {'contentType': 'PlainText',
             'content': "We regret to inform you that there are no rooms available for the date provided by you"
        }
        }}
            return response
        else:
            response = {
             'sessionAttributes': event['sessionAttributes'],
             'dialogAction': {
             'type': 'Close',
             'fulfillmentState': 'Fulfilled',
             'message': {'contentType': 'PlainText',
             'content': "We have " + str(count) + " rooms available for the given date. To book a room, you need to register or sign in"
        }
        }}
            return response
    if event['currentIntent']['name'] == 'xyz':
        slots = event['currentIntent']['slots']
        print(slots)
        date = slots['question']
        print('date from bot ' + date)
        print(type(date))
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('Test')
        response = table.scan()
        for i in response['Items']:
            datedb = (i['Date'].split("T"))[0]
            print(type(datedb))
            # print('date from db ' , datedb)
            # date_time_obj = datetime.strptime(datedb, '%Y-%m-%d').date()
           # print(type(date_time_obj))
            print('processeddate ' , datedb)
            if date == datedb:
                print('date from db after query is satisfied ' , datedb)
                print('availability ', i['Availability'])
                queryResponse = int(i['Availability'])
                print('in if' , queryResponse)
        if queryResponse == 0:
            print('queryResponse ' , queryResponse)
            response = {
            'sessionAttributes': event['sessionAttributes'],
            'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message':  {'contentType': 'PlainText',
            'content': 'I regret to inform you that there are no rooms available on the date you have selcted..Sorry!'
        }
        }}
            return response
        else:
            response = {
            'sessionAttributes': event['sessionAttributes'],
            'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message':  {'contentType': 'PlainText',
            'content': 'There are ' + str(queryResponse) + ' room(s) available. You are most welcome to book the rooms for that day'
                }
                }}
            print(response)
            return response
    if event['currentIntent']['name'] == '':
        slots = event['currentIntent']['slots']
        if slots['query_option'] == '1':
            response = {
                'sessionAttributes': event['sessionAttributes'],
                'dialogAction': {
                'type': 'Close',
                'fulfillmentState': 'Fulfilled',
                'message':  {'contentType': 'PlainText',
                'content':'We only have suite rooms available in our hotel. If you need to book the rooms, please login to the website. \nhttps://www.google.com'
            }
        }}
            print(response)
            return response
        
        response = {
            'sessionAttributes': event['sessionAttributes'],
            'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message':  {'contentType': 'PlainText',
            'content':'Hi...How can I help you today? please select an option for which you need answer else select exit\n1. Rooms\n2. Food\n3. Exit'
        }
    }}
        return response
              