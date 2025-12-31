from models.user import db 
class Payment(db.Model):

    payment_id = db.Column(db.Integer, primary_key=True)
    payment_status = db.Column(db.String(20), nullable=False)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.user_id"),   
        nullable=False
    )
    amount = db.Column(db.Float, nullable=False)
    booking_id = db.Column(
        db.Integer,
        db.ForeignKey("booking.booking_id"),
        nullable=False
    )
