import boto3
import traceback


class CognitoUtilities:
    def __init__(self, access_key_id, secret_access_key, client_id, session_key=None, region_name="us-east-1"):
        self.client_id = client_id
        assert self.client_id is not None, "You need to provide client_id, Check the AWS Console!"
        try:
            if session_key:
                self.cognito_client = boto3.client("cognito-idp", aws_access_key_id=access_key_id, aws_secret_access_key=secret_access_key, aws_session_token=session_key, region_name=region_name)
            else:
                self.cognito_client = boto3.client("cognito-idp", aws_access_key_id=access_key_id, aws_secret_access_key=secret_access_key, region_name=region_name)
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))

    def admin_confirm_signup(self, user_pool_id, username):
        status = False
        try:
            self.cognito_client.admin_confirm_sign_up(UserPoolId=user_pool_id, Username=username)
            status = True
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        return status

    def signup_user(self, email, password, user_pool_id=None):
        assert user_pool_id is not None, "As a part of serverless project, you need to send user_pool_id in this function in order to auto-verify user on sign-up. Else, this practice is not recommended!"
        status, message, user_id = 500, "Something went wrong!", None
        try:
            signup_resp = self.cognito_client.sign_up(ClientId=self.client_id, Username=email, Password=password)
            if type(signup_resp) == dict and signup_resp.get("UserSub", False) and signup_resp["UserSub"]:
                account_confirm_status = self.admin_confirm_signup(user_pool_id=user_pool_id, username=email)
                if account_confirm_status:
                    status, message, user_id = 200, "Account registered!", signup_resp["UserSub"]
        except self.cognito_client.exceptions.UsernameExistsException as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
            status, message, user_id = 409, e.response["Error"]["Message"], None
        except self.cognito_client.exceptions.InvalidPasswordException as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
            status, message, user_id = 409, "{0}\nHere are the Password requirements\nPassword minimum length: 8 character(s)\nContains at least 1 number\nContains at least 1 uppercase letter".format(e.response["Error"]["Message"]), None
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        response_dict = {"status": status, "message": message, "user_id": user_id}
        return response_dict

    def login_user(self, email, password):
        data_dict, success, message, status = {}, False, "Something went wrong!", 500
        try:
            resp = self.cognito_client.initiate_auth(ClientId=self.client_id, AuthFlow="USER_PASSWORD_AUTH", AuthParameters={"USERNAME": email, "PASSWORD": password})
            if resp.get("ResponseMetadata", False) and resp["ResponseMetadata"] and resp["ResponseMetadata"].get("HTTPStatusCode", False) and resp["ResponseMetadata"]["HTTPStatusCode"] == 200 and resp.get("AuthenticationResult", False) and resp["AuthenticationResult"] and resp["AuthenticationResult"].get("AccessToken", False) and resp["AuthenticationResult"]["AccessToken"]:
                data_dict = self.get_user_details(access_token=resp["AuthenticationResult"]["AccessToken"])
                if data_dict:
                    message, success, status = "Authentication Successful", True, 200
        except self.cognito_client.exceptions.UserNotFoundException as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
            message = e.response["Error"]["Message"]
            status = e.response['ResponseMetadata']['HTTPStatusCode']
        except self.cognito_client.exceptions.NotAuthorizedException as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
            message = e.response["Error"]["Message"]
            status = e.response['ResponseMetadata']['HTTPStatusCode']
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        response_dict = {"user_data": data_dict, "message": message, "success": success, "status": status}
        return response_dict

    def get_user_details(self, access_token):
        user_details = {}
        mapping_dict = {
            "sub": "user_id",
            "email": "email"
        }
        try:
            user_dict = self.cognito_client.get_user(AccessToken=access_token)
            if user_dict.get("UserAttributes", False) and user_dict["UserAttributes"]:
                for each_attribute in user_dict["UserAttributes"]:
                    if each_attribute["Name"] in mapping_dict:
                        user_details[mapping_dict[each_attribute["Name"]]] = each_attribute["Value"]
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        return user_details

    def admin_delete_user(self, email, user_pool_id):
        status = False
        try:
            self.cognito_client.admin_delete_user(UserPoolId=user_pool_id, Username=email)
            status = True
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        return status
