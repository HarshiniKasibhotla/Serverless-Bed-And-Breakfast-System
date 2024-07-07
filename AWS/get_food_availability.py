import traceback

import constants
from dynamoUtilities import DynamoUtilities


class GetFoodAvailability:
    def __init__(self):
        self.dynamo_obj = DynamoUtilities(access_key_id=constants.aws_access_key, secret_access_key=constants.aws_secret_access_key, region=constants.default_region)

    def main(self):
        output = {
            "statusCode": 500,
            "body": {
                "message": "Something went wrong!"
            }
        }
        try:
            dynamo_resp = self.dynamo_obj.get_data(constants.availability_food)
            if dynamo_resp:
                available_foods = []
                for each_data in dynamo_resp:
                    d = {
                            "food_name": each_data["food_name"],
                            "count": int(each_data["avail_count"]),
                            "price": int(each_data["price"])
                        }
                    available_foods.append(d)
                if available_foods:
                    output = {
                                "statusCode": 200,
                                "body": {
                                    "available_food_list": available_foods
                                }
                            }
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        return output