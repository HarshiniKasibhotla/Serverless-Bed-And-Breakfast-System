import datetime
import requests
import traceback

import constants
from dynamoUtilities import DynamoUtilities


class Login3:
    def __init__(self):
        self.dynamo_obj = DynamoUtilities(access_key_id=constants.aws_access_key, secret_access_key=constants.aws_secret_access_key, region=constants.default_region)

    def main(self, body_dict):
        output = {
                        "statusCode": 500,
                        "body": {
                                    "message": "Something went wrong!"
                                }
                 }
        try:
            data = {
                        "key": int(body_dict["cipher_key"]),
                        "plaintext": body_dict["normal_text"],
                        "encoded": body_dict["cipher_text"]
                    }
            resp = requests.post(constants.cipher_cloud_function_url, json=data, headers={"Content-Type": "application/json"})
            if resp.status_code == 200:
                gcp_output = resp.json()
                if gcp_output["validation"]:
                    output = {
                                "statusCode": 200,
                                "body": {
                                    "message": "User Verfied!"
                                }
                            }
                    self.dynamo_obj.incremental_update_data(table_name=constants.cumulative_stats, condition_dict={"data_point": "login3_success"}, attr_name="val_count", frequency_value=1)
                    self.dynamo_obj.insert_single_data(table_name=constants.user_level_stats, item_dict={
                        "unique_key": "{0}_{1}".format(body_dict["user_id"], int(datetime.datetime.timestamp(datetime.datetime.now()))),
                        "user_id": body_dict["user_id"],
                        "login_time": datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S"),
                        "login_type": "login3"
                    })
                else:
                    output = {
                                "statusCode": 401,
                                "body": {
                                    "message": "User not verfied!"
                                }
                            }
                    self.dynamo_obj.incremental_update_data(table_name=constants.cumulative_stats, condition_dict={"data_point": "login3_fails"}, attr_name="val_count", frequency_value=1)
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        return output