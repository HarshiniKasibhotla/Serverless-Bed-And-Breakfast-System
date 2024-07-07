import json

from signup import Signup
from login1 import Login1
from login2 import Login2
from login3 import Login3

from order_food import OrderFood
from generate_report import Generatereport
from get_food_availability import GetFoodAvailability

# This function is the entry-point to the whole service. This will only parse the body-params,query-params, path-params, etc and route to the appropriate call on the basis of path.
def lambda_handler(event, context):
    lambda_output = {
        "statusCode": 404,
        "body": json.dumps("404 - API Path Not Found")
    }
    # print(json.dumps(event, indent=2))

    path = event.get("path", None)
    if path:
        path = path.split("/")

    body = event.get("body", None)
    if body:
        body = json.loads(body)

    query_dict = event.get("queryStringParameters", None)

    print("path >>>> {0}\nquery >>>> {1}\nbody >>>> {2}\n".format(path, json.dumps(query_dict, indent=2),
                                                                  json.dumps(body, indent=2)))

    if path[1] == "signup":
        print("Got signup API hit!")
        cls_obj = Signup()
        lambda_output = cls_obj.main(body_dict=body)
        lambda_output["body"] = json.dumps(lambda_output["body"])
        lambda_output['headers']= {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
        print(json.dumps(lambda_output, indent=2))

    if path[1] == "login1":
        print("Got login1 API hit!")
        cls_obj = Login1()
        lambda_output = cls_obj.main(body_dict=body)
        lambda_output["body"] = json.dumps(lambda_output["body"])
        lambda_output['headers']= {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
        print(json.dumps(lambda_output, indent=2))

    if path[1] == "login2":
        print("Got login2 API hit!")
        cls_obj = Login2()
        lambda_output = cls_obj.main(body_dict=body)
        lambda_output["body"] = json.dumps(lambda_output["body"])
        lambda_output['headers']= {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
        print(json.dumps(lambda_output, indent=2))

    if path[1] == "login3":
        print("Got login3 API hit!")
        cls_obj = Login3()
        lambda_output = cls_obj.main(body_dict=body)
        lambda_output["body"] = json.dumps(lambda_output["body"])
        lambda_output['headers']= {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
        print(json.dumps(lambda_output, indent=2))

    if path[1] == "availablefood":
        print("Got availablefood API hit!")
        cls_obj = GetFoodAvailability()
        lambda_output = cls_obj.main()
        lambda_output["body"] = json.dumps(lambda_output["body"])
        lambda_output['headers'] = {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
        print(json.dumps(lambda_output, indent=2))

    if path[1] == "orderfood":
        print("Got orderfood API hit!")
        cls_obj = OrderFood()
        lambda_output = cls_obj.main(body_dict=body)
        lambda_output["body"] = json.dumps(lambda_output["body"])
        lambda_output['headers'] = {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
        print(json.dumps(lambda_output, indent=2))

    if path[1] == "getreport":
        print("Got getreport API hit!")
        cls_obj = Generatereport()
        lambda_output = cls_obj.main()
        lambda_output["body"] = json.dumps(lambda_output["body"])
        lambda_output['headers'] = {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
        print(json.dumps(lambda_output, indent=2))

    return lambda_output
