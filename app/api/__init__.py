from flask import Blueprint
from app.models import Content
from flask import request

api = Blueprint('api',__name__)

@api.route('/<int:content_id>/', methods=['POST'])
def show_content(content_id):
    content_json = request.get_json()
    content = Content.get_item_by_id(content_json['id'])
    content.links_data = str(content_json['links_data'])
    content.blocks_data = str(content_json['blocks_data'])
    content.add_itself()
    return str(content.id)
