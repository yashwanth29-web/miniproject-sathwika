from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import ValidationError
from customDecorator import role_required
from models import user
from models.booking import Booking
from models.flats import Flat
from models.lease import Lease
from models.payment import Payment
from models.user import db
from schema import LeaseSchema, PaymentSchema


PaymentRoute = Blueprint("PaymentRoute", __name__)
schema = PaymentSchema()
lease_schema = LeaseSchema()

@PaymentRoute.route("/pay", methods=["POST"])
@jwt_required()
@role_required('user')
def initiate_payment():
    data = request.json
    user_id = int(get_jwt_identity())
    flat_id = int(data.get("flat_id"))

    if not flat_id:
        return jsonify({"message": "flat_id is required"}), 400

    booking = Booking.query.filter_by(user_id=int(user_id), flat_id=int(flat_id), booking_status="approved").first()
    if not booking:
        return jsonify({"message": "No approved booking found for this flat"}), 404

    existing = Payment.query.filter_by(booking_id=booking.booking_id).first()
    if existing:
        return jsonify({"message": "Payment already initiated"}), 409

    flat = Flat.query.get(flat_id)

    payment = Payment(
        user_id=int(user_id),
        booking_id=booking.booking_id,
        amount=flat.rent,
        payment_status="pending"
    )

    db.session.add(payment)
    db.session.commit()

    return jsonify({
        "message": "Payment initiated",
        "payment": schema.dump(payment)
    }), 201



@PaymentRoute.route("/pay/<int:id>/complete", methods=["PATCH"])
@jwt_required()
@role_required('user')
def complete_payment(id):

    payment = Payment.query.get_or_404(id)
    user_id = int(get_jwt_identity())

    if payment.user_id != user_id:
        return jsonify({"message": "Unauthorized"}), 403

    if payment.payment_status == "completed":
        return jsonify({"message": "Payment already completed"}), 409

    booking = Booking.query.get_or_404(payment.booking_id)

    existing_lease = Lease.query.filter_by(booking_id=booking.booking_id).first()
    if existing_lease:
        return jsonify({
            "message": "Lease already exists",
            "lease_id": existing_lease.id
        }), 409

    payment.payment_status = "completed"

    lease = Lease(
        user_id=booking.user_id,
        flat_id=booking.flat_id,
        tower_id=booking.tower_id,
        booking_id=booking.booking_id,
        rent=payment.amount,
        lease_status="active"
    )

    flat = Flat.query.get(booking.flat_id)
    flat.availability = "leased"

    db.session.add(lease)
    db.session.commit()

    return jsonify({
        "message": "Payment completed & lease started",
        "lease_id": lease.lease_id
    }), 200


@PaymentRoute.route("/my-payments", methods=["GET"])
@jwt_required()
@role_required('user')
def my_payments():
    user_id = int(get_jwt_identity())

    payments = (
        db.session.query(
            Payment.payment_id,
            Payment.booking_id,
            Payment.amount,
            Payment.payment_status,
            Flat.flat_number
        )
        .join(Booking, Booking.booking_id == Payment.booking_id)
        .join(Flat, Flat.flat_id == Booking.flat_id)
        .filter(Payment.user_id == user_id)
        .all()
    )

    result = []
    for p in payments:
        result.append({
            "payment_id": p.payment_id,
            "booking_id": p.booking_id,
            "flat_number": p.flat_number,
            "amount": p.amount,
            "payment_status": p.payment_status
        })

    return jsonify(result), 200

    user_id = int(get_jwt_identity())

    payments = (
        db.session.query(
            Payment.payment_id,
            Payment.booking_id,
            Payment.amount,
            Payment.payment_status,
            Booking.flat_id
        )
        .join(Booking, Booking.booking_id == Payment.booking_id)
        .filter(Payment.user_id == user_id)
        .all()
    )

    result = []
    for p in payments:
        result.append({
            "payment_id": p.payment_id,
            "booking_id": p.booking_id,
            "flat_id": p.flat_id,
            "amount": p.amount,
            "payment_status": p.payment_status
        })

    return jsonify(result), 200

@role_required('admin')

@PaymentRoute.route("/GetPayments", methods=["GET"])
def get_payments():
    payments = Payment.query.all()
    return jsonify(schema.dump(payments, many=True)), 200
