from models.user import db
from datetime import date

class Lease(db.Model):
    lease_id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    flat_id = db.Column(db.Integer, db.ForeignKey("flat.flat_id"), nullable=False)
    tower_id = db.Column(db.Integer, db.ForeignKey("tower.tower_id"), nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey("booking.booking_id"), unique=True)

    start_date = db.Column(db.Date, default=date.today)
    end_date = db.Column(db.Date)

    rent = db.Column(db.Float, nullable=False)
    lease_status = db.Column(db.String(20), default="active")

