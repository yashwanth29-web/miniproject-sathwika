from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from customDecorator import role_required
from models.booking import Booking
from models.flats import Flat
from models.tower import Tower
from models.user import db
from schema import BookingSchema

bookingRoute = Blueprint("bookingRoute", __name__)

schema = BookingSchema()
schemas = BookingSchema(many=True)


# ================= CREATE BOOKING =================
@bookingRoute.route("/book", methods=["POST"])
@jwt_required()
@role_required("user")
def create_booking():
    data = request.json
    try:
        validated = schema.load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    flat = Flat.query.get(validated["flat_id"])
    if not flat or flat.availability != "available":
        return jsonify({"message": "Flat not available"}), 400

    current_user = int(get_jwt_identity())

    existing_booking = Booking.query.filter_by(
        user_id=current_user,
        flat_id=flat.flat_id
    ).first()
    if existing_booking:
        return jsonify({"message": "You have already booked this flat"}), 400

    booking = Booking(
        user_id=current_user,
        flat_id=flat.flat_id,
        tower_id=flat.tower_id,
        booking_status="pending"
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({"booking requested successfully": schema.dump(booking)}), 201


# ================= USER: MY BOOKINGS =================
@bookingRoute.route("/my-bookings", methods=["GET"])
@jwt_required()
@role_required("user")
def get_my_bookings():
    user_id = int(get_jwt_identity())

    bookings = (
        db.session.query(
            Booking.booking_id,
            Booking.booking_status,
            Flat.flat_number,
            Tower.tower_name
        )
        .join(Flat, Flat.flat_id == Booking.flat_id)
        .join(Tower, Tower.tower_id == Booking.tower_id)
        .filter(Booking.user_id == user_id)
        .all()
    )

    result = []
    for b in bookings:
        result.append({
            "booking_id": b.booking_id,
            "flat_number": b.flat_number,
            "tower_name": b.tower_name,
            "booking_status": b.booking_status
        })

    return jsonify(result), 200


# ================= ADMIN: PENDING BOOKINGS =================
@bookingRoute.route("/admin/pending-bookings", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_pending_bookings():
    bookings = Booking.query.filter_by(booking_status="pending").all()
    return jsonify(schemas.dump(bookings)), 200


@bookingRoute.route("/my-bookings/<int:id>", methods=["GET"])
@jwt_required()
@role_required("user", "admin")
def get_booking(id):
    booking = Booking.query.get_or_404(id)
    return jsonify(schema.dump(booking)), 200


@bookingRoute.route("/bookings", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_all_bookings():
    bookings = Booking.query.all()
    return jsonify(schemas.dump(bookings)), 200


@bookingRoute.route("/bookings/<int:id>", methods=["PATCH"])
@jwt_required()
@role_required("admin")
def update_booking(id):
    booking = Booking.query.get_or_404(id)
    status = request.json.get("booking_status")

    if status not in ["approved", "rejected"]:
        return jsonify({"message": "Invalid status"}), 400

    booking.booking_status = status

    if status == "approved":
        flat = Flat.query.get(booking.flat_id)
        flat.availability = "booked"

    db.session.commit()
    return jsonify({"updated": schema.dump(booking)}), 200
