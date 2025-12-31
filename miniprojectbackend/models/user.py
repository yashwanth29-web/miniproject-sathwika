from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    user_id = db.Column(db.Integer , primary_key = True)
    name = db.Column(db.String , nullable = False)
    email = db.Column(db.String , nullable = False)
    password = db.Column(db.String, nullable = False)
    phone_num = db.Column(db.BigInteger , nullable = False)
    role = db.Column(db.String , nullable = False)
    
    