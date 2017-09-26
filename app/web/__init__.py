from flask import Blueprint, render_template
from app.models import Content
import json

web = Blueprint('web',__name__,template_folder='templates')

@web.route('/<int:content_id>/')
def index(content_id):
    content = Content.get_item_by_id(content_id)
    if(content is None):
        content = Content()
        content.id = content_id
        content.add_itself()
    content = Content.get_item_by_id(content_id)
    content.__dict__.pop('_sa_instance_state',None)
    return render_template('index.html',content = content.__dict__)
