import token
from flask import Blueprint ,  request, jsonify 
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token
from flask_bcrypt import generate_password_hash , check_password_hash
from models.user import User
from schema import LoginSchema, RegisterSchema, UserSchema
from marshmallow import  ValidationError
from models.user import db
authRoute = Blueprint('authRoute' , __name__ )

register_schema = RegisterSchema()
login_schema = LoginSchema() 
@authRoute.route('/register' , methods=['POST'])

def register():
    data = request.json
    if not data:
        return jsonify({"error": "No input data"}), 400
    try:
        validated = register_schema.load(data = data)
    except  ValidationError as err:
        return jsonify(err.messages), 400 
    
    if User.query.filter_by(email=validated["email"]).first():
        return jsonify({"message": "Email already exists"}), 409
    if User.query.filter_by(phone_num=validated["phone_num"]).first():
        return jsonify({"message": "Phone already exists"}), 409
    validated['password']=generate_password_hash(validated["password"]).decode("utf-8")
    new_user = User(name = validated['name'] , email=validated['email'] , password=validated['password'] ,phone_num = validated['phone_num'] , role = validated['role'] )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"new user added" :new_user.user_id}) 


@authRoute.route('/login' , methods = ["POST"])

def login():
    data = request.json
    try:
        validated = login_schema.load(data=data)
    except ValidationError as err:
        return jsonify(err.messages),400
    


    if not validated['email'] or not validated['password']:
        return jsonify({"message": "Email and password required"}), 400

    exist = User.query.filter_by(email = validated['email']).first()
    if not exist:
        return jsonify ({"message":"user not found , do register"}) , 404
    if not check_password_hash(exist.password ,validated['password']):
        return jsonify({"message" : "invalid credentials"}) , 400 
    token = create_access_token(
        identity=str(exist.user_id),           
        additional_claims={               
            "role": exist.role,
            "email": exist.email,
            "name": exist.name
        }
        )
    return jsonify({
    "access_token": token,
    "name": exist.name,
    "role": exist.role,
    "email": exist.email
    }), 200
