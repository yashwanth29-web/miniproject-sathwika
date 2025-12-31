from customDecorator import role_required
from models.tower import Tower
from models.user import db 
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from schema import TowerSchema

TowerRoute = Blueprint("TowerRoute" , __name__)
schema = TowerSchema()

@role_required( 'admin')

@TowerRoute.route("/AddTower", methods = ['POST'])
def addTower():
    data = request.json
    try: 
        validated = schema.load(data = data)
    except ValidationError as err:
        return jsonify(err.messages) 
    new_tower = Tower(tower_name = validated['tower_name'] , no_of_floors = validated['no_of_floors'] , no_of_flats =validated['no_of_flats'], area =validated['area'])
    db.session.add(new_tower)
    db.session.commit()
    return jsonify({"added tower" : new_tower.tower_id})
@role_required('user', 'admin')
@TowerRoute.route("/GetTowers", methods=["GET"])
def get_all_towers():
    towers = Tower.query.all()
    result = schema.dump(towers, many=True)
    return jsonify(result), 200

@role_required('user' , 'admin')

@TowerRoute.route("/GetTower/<int:id>", methods=["GET"])
def get_tower(id):
    tower = Tower.query.get(id)

    if not tower:
        return jsonify({"error": "Tower not found"}), 404

    result = schema.dump(tower)
    return jsonify(result), 200
@role_required('admin')

@TowerRoute.route("/UpdateTower/<int:id>", methods=["PATCH"])
def update_tower(id):
    tower = Tower.query.get(id)

    if not tower:
        return jsonify({"error": "Tower not found"}), 404

    data = request.json

    try:
        validated = schema.load(data=data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    tower.tower_name = validated.get('tower_name', tower.tower_name)
    tower.no_of_floors = validated.get('no_of_floors', tower.no_of_floors)
    tower.no_of_flats = validated.get('no_of_flats', tower.no_of_flats)
    tower.area = validated.get('area', tower.area)

    db.session.commit()

    return jsonify({"message": "Tower updated successfully"}), 200
@role_required('admin')

@TowerRoute.route("/DeleteTower/<int:id>", methods=["DELETE"])
def delete_tower(id):
    tower = Tower.query.get(id)

    if not tower:
        return jsonify({"error": "Tower not found"}), 404

    db.session.delete(tower)
    db.session.commit()

    return jsonify({"message": "Tower deleted successfully"}), 200
