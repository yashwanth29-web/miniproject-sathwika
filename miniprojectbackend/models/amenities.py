from models.user import db 
class Amenities(db.Model):

    amenity_id = db.Column(db.Integer, primary_key=True)
    amenity_name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)

    tower_id = db.Column(db.Integer,
        db.ForeignKey("tower.tower_id"),
        nullable=False
    )
