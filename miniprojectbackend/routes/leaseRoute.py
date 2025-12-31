from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from datetime import date

from customDecorator import role_required
from models.lease import Lease
from models.booking import Booking
from models.flats import Flat
from models.tower import Tower
from models.user import db

leaseRoute = Blueprint("leaseRoute", __name__)


# ================= USER: MY LEASES =================
@leaseRoute.route("/my-leases", methods=["GET"])
@jwt_required()
@role_required("user")
def get_my_leases():
    user_id = int(get_jwt_identity())

    leases = (
        db.session.query(
            Lease.lease_id,
            Lease.booking_id,
            Lease.rent,
            Lease.lease_status,
            Lease.start_date,
            Lease.end_date,
            Flat.flat_number,
            Tower.tower_name
        )
        .join(Booking, Booking.booking_id == Lease.booking_id)
        .join(Flat, Flat.flat_id == Lease.flat_id)
        .join(Tower, Tower.tower_id == Booking.tower_id)
        .filter(Lease.user_id == user_id)
        .all()
    )

    result = []
    for l in leases:
        result.append({
            "lease_id": l.lease_id,
            "booking_id": l.booking_id,
            "flat_number": l.flat_number,
            "tower_name": l.tower_name,
            "rent": l.rent,
            "lease_status": l.lease_status,
            "start_date": l.start_date,
            "end_date": l.end_date
        })

    return jsonify(result), 200


# ================= ADMIN: TERMINATE LEASE =================
@leaseRoute.route("/lease/<int:id>/terminate", methods=["PUT"])
@jwt_required()
@role_required("admin")
def terminate_lease(id):

    lease = Lease.query.get_or_404(id)

    if lease.lease_status == "terminated":
        return jsonify({"message": "Lease already terminated"}), 400

    lease.lease_status = "terminated"
    lease.end_date = date.today()

    flat = Flat.query.get(lease.flat_id)
    flat.availability = "available"

    db.session.commit()

    return jsonify({"message": "Lease terminated successfully"}), 200
