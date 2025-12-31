from models.user import db

class Booking(db.Model):
    booking_id = db.Column(db.Integer, primary_key=True)

    flat_id = db.Column(
        db.Integer,
        db.ForeignKey("flat.flat_id"),
        nullable=False
    )

    tower_id = db.Column(
        db.Integer,
        db.ForeignKey("tower.tower_id"),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.user_id"),
        nullable=False
    )

    booking_status = db.Column(
        db.String(20),
        default="pending",
        nullable=False
    )
