import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
table = dynamodb.Table("AvailableRooms")

def lambda_handler(event, context):
    
    response = table.scan()
    data = response['Items']

    return {
        'statusCode': 200,
        'headers':  {'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*'},
        'body': json.dumps(data)
    }
