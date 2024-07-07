import constants
from dynamoUtilities import DynamoUtilities

class ResetInventory:
    def __init__(self):
        self.dynamo_obj = DynamoUtilities(access_key_id=constants.aws_access_key, secret_access_key=constants.aws_secret_access_key, region=constants.default_region)

    def main(self):
        all_data = self.dynamo_obj.get_data(table_name=constants.availability_food)
        for each_data in all_data:
            self.dynamo_obj.update_single_data(table_name=constants.availability_food, condition_dict={"food_name":each_data["food_name"]}, attr_name="avail_count", attr_value=10)

def lambda_handler(event, context):
    ResetInventory().main()


lambda_handler(None, None)