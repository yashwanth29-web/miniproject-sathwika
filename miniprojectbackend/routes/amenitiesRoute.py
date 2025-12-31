
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from customDecorator import role_required
from models.amenities import Amenities
from models.user import db
from schema import AmenitiesSchema


AmenitiesRoute = Blueprint("AmenitiesRoute", __name__)
schema = AmenitiesSchema()

@role_required('admin')
@AmenitiesRoute.route("/AddAmenity", methods=["POST"])
def add_amenity():
    data = request.json

    try:
        validated = schema.load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_amenity = Amenities(
        amenity_name=validated["amenity_name"],
        description=validated["description"],
        tower_id=validated["tower_id"]
    )

    db.session.add(new_amenity)
    db.session.commit()

    return jsonify({
        "message": "Amenity added successfully",
        "amenity": schema.dump(new_amenity)
    }), 201


@role_required('user' , 'admin')

@AmenitiesRoute.route("/GetAmenities", methods=["GET"])
def get_amenities():
    amenities = Amenities.query.all()
    return jsonify(schema.dump(amenities, many=True)), 200

@role_required('user' , 'admin')

@AmenitiesRoute.route("/GetAmenitiesByTower/<int:tower_id>", methods=["GET"])
def get_amenities_by_tower(tower_id):
    amenities = Amenities.query.filter_by(tower_id=tower_id).all()
    return jsonify(schema.dump(amenities, many=True)), 200

@role_required('admin')

@AmenitiesRoute.route("/UpdateAmenity/<int:id>", methods=["PUT"])
def update_amenity(id):
    amenity = Amenities.query.get(id)

    if not amenity:
        return jsonify({"error": "Amenity not found"}), 404

    try:
        validated = schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400

    amenity.amenity_name = validated.get(
        "amenity_name", amenity.amenity_name
    )
    amenity.description = validated.get(
        "description", amenity.description
    )
    amenity.tower_id = validated.get(
        "tower_id", amenity.tower_id
    )

    db.session.commit()

    return jsonify({
        "message": "Amenity updated successfully",
        "amenity": schema.dump(amenity)
    }), 200

@role_required('admin')

@AmenitiesRoute.route("/DeleteAmenity/<int:id>", methods=["DELETE"])
def delete_amenity(id):
    amenity = Amenities.query.get(id)

    if not amenity:
        return jsonify({"error": "Amenity not found"}), 404

    db.session.delete(amenity)
    db.session.commit()

    return jsonify({"message": "Amenity deleted successfully"}), 200
