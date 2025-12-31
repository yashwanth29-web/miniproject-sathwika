from models.user import db
class Flat(db.Model):

    flat_id = db.Column(db.Integer, primary_key=True)
    flat_number = db.Column(db.Integer, nullable=False)
    rent = db.Column(db.Integer, nullable=False)
    availability = db.Column(db.String(20), nullable=False)

    tower_id = db.Column(
        db.Integer,
        db.ForeignKey("tower.tower_id"),
        nullable=False
    )

