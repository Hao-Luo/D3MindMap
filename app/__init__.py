from flask import Flask
from flask_sqlalchemy import SQLAlchemy

#db instance
db = SQLAlchemy()

def create_app(configObject):
    app = Flask(__name__)
    app.config.from_object(configObject)
    db.init_app(app)
    from app.api import api
    app.register_blueprint(api,url_prefix='/api')
    from app.web import web
    app.register_blueprint(web,url_prefix='')
    return app
        
