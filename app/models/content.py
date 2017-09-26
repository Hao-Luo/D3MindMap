from app import db

class Content(db.Model):
    __tablename__='content'
    id = db.Column(db.Integer, primary_key = True)
    blocks_data = db.Column(db.Text)
    links_data = db.Column(db.Text)

    @staticmethod
    def get_all_items():
        contents = Content.query.all()
        return contents

    @staticmethod
    def get_item_by_id(id):
        content = Content.query.get(id)
        return content

    def add_itself(self):
        db.session.add(self)
        db.session.commit()

    def delete_itself(self):
        db.session.delete(self)
        db.session.commit()
