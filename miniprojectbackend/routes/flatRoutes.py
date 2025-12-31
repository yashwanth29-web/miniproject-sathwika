from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from customDecorator import role_required
from models.flats import Flat
from models.user import db
from schema import FlatSchema

FlatRoute = Blueprint("FlatRoute", __name__)
schema = FlatSchema()
@role_required( 'admin')

@FlatRoute.route("/AddFlat", methods=["POST"])
def add_flat():
    data = request.json

    try:
        validated = schema.load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_flat = Flat(
        flat_number=validated["flat_number"],
        rent=validated["rent"],
        availability=validated["availability"],
        tower_id=validated["tower_id"]
    )

    db.session.add(new_flat)
    db.session.commit()

    return jsonify({
        "message": "Flat added successfully",
        "flat": schema.dump(new_flat)
    }), 201
@role_required('user' , 'admin')

@FlatRoute.route("/GetFlats", methods=["GET"])
def get_flats():
    flats = Flat.query.all()
    return jsonify(schema.dump(flats, many=True)), 200
@role_required('user' , 'admin')

@FlatRoute.route("/GetFlat/<int:id>", methods=["GET"])
def get_flat(id):
    flat = Flat.query.get(id)

    if not flat:
        return jsonify({"error": "Flat not found"}), 404

    return jsonify(schema.dump(flat)), 200
@role_required('user' , 'admin')


@FlatRoute.route("/GetFlatsByTower/<int:tower_id>", methods=["GET"])
def get_flats_by_tower(tower_id):
    flats = Flat.query.filter_by(tower_id=tower_id).all()
    return jsonify(schema.dump(flats, many=True)), 200

@role_required('admin')

@FlatRoute.route("/UpdateFlat/<int:id>", methods=["PATCH"])
def update_flat(id):
    flat = Flat.query.get(id)

    if not flat:
        return jsonify({"error": "Flat not found"}), 404

    try:
        validated = schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400

    flat.flat_number = validated.get("flat_number", flat.flat_number)
    flat.rent = validated.get("rent", flat.rent)
    flat.availability = validated.get("availability", flat.availability)
    flat.tower_id = validated.get("tower_id", flat.tower_id)

    db.session.commit()

    return jsonify({
        "message": "Flat updated successfully",
        "flat": schema.dump(flat)
    }), 200
@role_required('admin')
@FlatRoute.route("/DeleteFlat/<int:id>", methods=["DELETE", "OPTIONS"])
def delete_flat(id):
    flat = Flat.query.get(id)

    if not flat:
        return jsonify({"error": "Flat not found"}), 404

    db.session.delete(flat)
    db.session.commit()

    return jsonify({"message": "Flat deleted successfully"}), 200
