from models.user import db

class Tower(db.Model):

    tower_id = db.Column(db.Integer, primary_key=True)
    tower_name = db.Column(db.String(50), nullable=False)
    no_of_floors = db.Column(db.Integer, nullable=False)
    no_of_flats = db.Column(db.Integer, nullable=False)
    area = db.Column(db.String(100), nullable=False)

    # flats = db.relationship("Flat", backref="tower", lazy=True)
    # amenities = db.relationship("Amenities", backref="tower", lazy=True)

