import datetime
import traceback

import constants
from dynamoUtilities import DynamoUtilities


class Login2:
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
            dynamo_resp = self.dynamo_obj.scan_data_single_eq_filter(constants.users_table, key_name="user_id", value=body_dict["user_id"])
            if not dynamo_resp:
                output = {
                            "statusCode": 404,
                            "body": {
                                "message": "User Id does not exist!"
                            }
                        }
            else:
                data_dict = dynamo_resp[0]
                if data_dict["security_ans"] == body_dict["security_ans"]:
                    output = {
                                "statusCode": 200,
                                "body": {
                                    "message": "User verified!"
                                }
                            }
                    self.dynamo_obj.incremental_update_data(table_name=constants.cumulative_stats, condition_dict={"data_point": "login2_success"}, attr_name="val_count", frequency_value=1)
                    self.dynamo_obj.insert_single_data(table_name=constants.user_level_stats, item_dict={
                        "unique_key": "{0}_{1}".format(body_dict["user_id"], int(datetime.datetime.timestamp(datetime.datetime.now()))),
                        "user_id": body_dict["user_id"],
                        "login_time": datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S"),
                        "login_type": "login2"
                    })
                else:
                    output = {
                                "statusCode": 401,
                                "body": {
                                    "message": "Wrong answer!"
                                }
                            }
                    self.dynamo_obj.incremental_update_data(table_name=constants.cumulative_stats, condition_dict={"data_point": "login2_fails"}, attr_name="val_count", frequency_value=1)
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        return output