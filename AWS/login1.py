import datetime
import traceback

import constants
from cognitoUtilities import CognitoUtilities
from dynamoUtilities import DynamoUtilities


class Login1:
    def __init__(self):
        self.cognito_obj = CognitoUtilities(access_key_id=constants.aws_access_key, secret_access_key=constants.aws_secret_access_key, client_id=constants.cognito_client_id)
        self.dynamo_obj = DynamoUtilities(access_key_id=constants.aws_access_key, secret_access_key=constants.aws_secret_access_key, region=constants.default_region)

    def main(self, body_dict):
        output = {
                        "statusCode": 500,
                        "body": {
                                    "message": "Something went wrong!"
                                }
                 }
        try:
            cognito_resp = self.cognito_obj.login_user(email=body_dict["email"], password=body_dict["password"])
            if cognito_resp["success"] and cognito_resp["user_data"] and cognito_resp["status"] == 200:
                dynamo_resp = self.dynamo_obj.scan_data_single_eq_filter(constants.users_table, key_name="user_id", value=cognito_resp["user_data"]["user_id"])
                if dynamo_resp:
                    output = {
                        "statusCode": 200,
                        "body": {
                            "security_ques": dynamo_resp[0]["security_ques"],
                            "cipher_key": int(dynamo_resp[0]["cipher_key"]),
                            "user_id": cognito_resp["user_data"]["user_id"],
                            "message": cognito_resp["message"],
                            "first_name": dynamo_resp[0]["first_name"],
                            "last_name": dynamo_resp[0]["last_name"]
                        }
                    }
                    self.dynamo_obj.incremental_update_data(table_name=constants.cumulative_stats, condition_dict={"data_point": "login1_success"}, attr_name="val_count", frequency_value=1)
                    self.dynamo_obj.insert_single_data(table_name=constants.user_level_stats, item_dict={
                        "unique_key": "{0}_{1}".format(cognito_resp["user_data"]["user_id"], int(datetime.datetime.timestamp(datetime.datetime.now()))),
                        "user_id": cognito_resp["user_data"]["user_id"],
                        "login_time": datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S"),
                        "login_type": "login1"
                    })
                else:
                    output = {
                        "statusCode": 500,
                        "body": {
                            "message": "Record exists in cognito, but not in dynamo. You need to clean the database for the user_id: {0}".format(cognito_resp["user_data"]["user_id"]),
                            "special_case": True
                        }
                    }
            else:
                output = {
                    "statusCode": cognito_resp["status"],
                    "body": {
                        "message": cognito_resp["message"]
                    }
                }
                self.dynamo_obj.incremental_update_data(table_name=constants.cumulative_stats, condition_dict={"data_point": "login1_fails"}, attr_name="val_count", frequency_value=1)
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        return output