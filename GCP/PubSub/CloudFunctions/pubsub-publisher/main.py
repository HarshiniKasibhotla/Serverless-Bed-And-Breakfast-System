import base64
import json
import os

from google.cloud import pubsub_v1

publisher = pubsub_v1.PublisherClient()
PROJECT_ID = os.getenv('csci5410-project')

def publish(request):
    data = request.data

    if data is None:
        print('request.data is empty')
        return ('request.data is empty', 400)

    data_json = json.loads(data)                                     

    message = data_json['message']
    user_id = data_json['user_id']

    topic_path = 'projects/csci5410-project-355011/topics/pubsub-topic'          

    message_json = json.dumps({
        'data':{
        'message': message,
        'user': user_id 
        }
        })

    print("----------")
    print(message_json)
    message_bytes = message_json.encode('utf-8')

    try:
        publish_future = publisher.publish(topic_path, data=message_bytes)
        publish_future.result()     
    except Exception as e:
        print(e)
        return (e, 500)

    return ('Message received and published to Pubsub', 200)
