import uuid
import time
import traceback
from datetime import datetime

import requests

import constants
from dynamoUtilities import DynamoUtilities


class OrderFood:
    def __init__(self):
        self.dynamo_obj = DynamoUtilities(access_key_id=constants.aws_access_key, secret_access_key=constants.aws_secret_access_key, region=constants.default_region)

    def main(self, body_dict):
        output = {
            "statusCode": 500,
            "body": {
                "message": "Something went wrong!"
            }
        }
        insert_status = False
        order_id = str(uuid.uuid4())
        try:
            order_data_dict = {
                                "order_id": order_id,
                                "user_id": body_dict["user_id"],
                                "order_time": datetime.strftime(datetime.now(), "%Y-%m-%d %H:%M:%S"),
                                "order_list": body_dict["order_list"]
                            }
            insert_status = self.dynamo_obj.insert_single_data(constants.booking_food, order_data_dict)
            if insert_status:
                for each_item in body_dict["order_list"]:
                    self.dynamo_obj.decremental_update_data(table_name=constants.availability_food, condition_dict={"food_name": each_item["food_name"]}, attr_name="avail_count", frequency_value=int(each_item["count"]))

                output = {
                            "statusCode": 200,
                            "body": {
                                        "message": "Order successfully placed!",
                                        "order_id": order_id
                                    }
                        }
                result = {"message": "Yayy! We recieved your order!", "user_id": body_dict["user_id"]}
                x = requests.post(constants.pubsub_url, json=result)
                time.sleep(10)

                result = {"message": "Voila! The kitchen started preparing your order!", "user_id": body_dict["user_id"]}
                x = requests.post(constants.pubsub_url, json=result)
                time.sleep(10)

                result = {"message": "Food delivered! Bon Appetit!", "user_id": body_dict["user_id"]}
                x = requests.post(constants.pubsub_url, json=result)

        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
            if insert_status and output["statusCode"]!=200:
                self.dynamo_obj.delete_single_data(table_name=constants.booking_food, key_name="order_id", key_value=order_id)
        return output