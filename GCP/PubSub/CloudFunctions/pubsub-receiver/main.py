import base64
from google.cloud import firestore
from datetime import datetime
import json

client = firestore.Client(project='csci5410-project-355011')

def receive(event, context):
    pubsub_message = base64.b64decode(event['data']).decode('utf-8')
    json_message = json.loads(pubsub_message)
    print("###-------------------------")
    print(json_message)
    print(type(json_message))
    message = json_message['data']['message']
    user = json_message['data']['user']
    print(user)

    doc_id = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    doc = client.collection(user).document(doc_id)
    doc.set({
        'message': message,
    })

