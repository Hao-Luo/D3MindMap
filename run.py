from app import create_app
from os import getenv
from app.models import Content
from app import db

app = create_app('config.development')

port = getenv('PORT','5000')
if __name__ == '__main__':
    with app.app_context():
        try:
            content = Content.get_all_items()
        except:
            db.create_all()
    app.run(host='0.0.0.0',port = port , threaded = True)

