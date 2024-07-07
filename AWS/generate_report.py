import io
import datetime
import traceback
import pandas as pd

import constants
from s3Utilities import S3Utilities
from dynamoUtilities import DynamoUtilities

class Generatereport:
    def __init__(self):
        self.dynamo_obj = DynamoUtilities(access_key_id=constants.aws_access_key, secret_access_key=constants.aws_secret_access_key, region=constants.default_region)
        self.s3_obj = S3Utilities(access_key_id=constants.aws_access_key, secret_access_key=constants.aws_secret_access_key)

    def main(self):
        output = {
                    "statusCode": 500,
                    "body": {
                                "message": "Something went wrong!"
                            }
                }
        try:
            cumulative_stats = self.dynamo_obj.get_data(table_name=constants.cumulative_stats)
            user_level_stats = self.dynamo_obj.get_data(table_name=constants.user_level_stats)
            cumulative_stats_list = []
            for each_cumulative_stat in cumulative_stats:
                d = {
                    "Metric": each_cumulative_stat["data_point"],
                    "Value": each_cumulative_stat["val_count"]
                }
                cumulative_stats_list.append(d)
            user_login_stats_list = []
            for each_login_stat in user_level_stats:
                d = {
                    "User-ID": each_login_stat["user_id"],
                    "Login-Level": each_login_stat["login_type"],
                    "Login-Time": each_login_stat["login_time"]
                }
                user_login_stats_list.append(d)
            user_df = pd.DataFrame(user_login_stats_list)
            cumulative_df = pd.DataFrame(cumulative_stats_list)
            data_to_export = None
            with io.BytesIO() as output:
                with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                    user_df.to_excel(writer, sheet_name="User-Logins", header=True, index=False)
                    cumulative_df.to_excel(writer, sheet_name="Cumulative-Stats", header=True, index=False)
                data_to_export = output.getvalue()
            if data_to_export:
                file_path = "{0}/Report-Serverless-Group-14.xlsx".format(datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S"))
                self.s3_obj.write_data(data=data_to_export, bucket=constants.bucket_name, file_key=file_path, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                output_url = self.s3_obj.generate_presigned_url_download(bucket_name=constants.bucket_name, file_key=file_path)
                output = {
                    "statusCode": 200,
                    "body": {
                        "message": "Click on the link to download the report!",
                        "url": output_url
                    }
                }
        except Exception as e:
            print("{0}\n{1}".format(e, traceback.format_exc()))
        return output
