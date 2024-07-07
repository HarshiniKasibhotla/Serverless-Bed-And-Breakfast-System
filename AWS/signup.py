import traceback

import constants
from cognitoUtilities import CognitoUtilities
from dynamoUtilities import DynamoUtilities


class Signup:
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
            resp_dict = self.cognito_obj.signup_user(email=body_dict["email"], password=body_dict["password"], user_pool_id=constants.cognito_user_pool_id)
            if resp_dict["status"] == 200 and resp_dict["user_id"] is not None:
                dynamo_dict = {
                                "first_name": body_dict["first_name"],
                                "last_name": body_dict["last_name"],
                                "security_ques": body_dict["security_ques"],
                                "security_ans": body_dict["security_ans"],
                                "user_id": resp_dict["user_id"],
                                "cipher_key": body_dict["cipher_key"]
                              }
                status = self.dynamo_obj.insert_single_data(table_name=constants.users_table, item_dict=dynamo_dict)
                if status:
                    output = {
                                "statusCode": 200,
                                "body": {
                                            "message": "User Registered successfully!",
                                            "user_id": resp_dict["user_id"]
                                        }
                                }
                    self.dynamo_obj.incremental_update_data(table_name=constants.cumulative_stats, condition_dict={"data_point": "registrations"}, attr_name="val_count", frequency_value=1)
                else:
                    self.cognito_obj.admin_delete_user(email=body_dict["email"], user_pool_id=constants.cognito_user_pool_id)
            else:
                output = {
                                "statusCode": resp_dict["status"],
                                "body": {
                                            "message": resp_dict["message"]
                                        }
                        }
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        return output
