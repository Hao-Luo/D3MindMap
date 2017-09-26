from os import getenv
import json

service_variables = getenv('VCAP_SERVICES')
variables_dict = json.loads(service_variables)
sql_variable = variables_dict['p-mysql'][0]['credentials']
#secret key for hasing
SECRET_KEY = 'a%6s5as6d%'
DEBUG = True
# database setting
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://'+sql_variable["username"]+':'+sql_variable["password"]+'@'+sql_variable["hostname"]+':'+str(sql_variable["port"])+'/'+sql_variable["name"]
SQLALCHEMY_TRACK_MODIFICATIONS = False
# WTF Setting
WTF_CSRF_ENABLED = True  # CSRF is a token to prevent fake post
