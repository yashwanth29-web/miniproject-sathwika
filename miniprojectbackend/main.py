from datetime import timedelta
from flask import Flask , jsonify
from functools import wraps
from routes.feedbackRoute import FeedbackRoute
from routes.feedbackRoute import FeedbackRoute
from routes.leaseRoute import leaseRoute
from routes.authroute import db 
from flask_jwt_extended import JWTManager, get_jwt_identity  ,  jwt_required, verify_jwt_in_request
from routes.flatRoutes import FlatRoute
from routes.authroute import authRoute
from config import Config
from routes.towerCrud import TowerRoute
from routes.paymentRoute import PaymentRoute
from routes.booking import bookingRoute
from routes.amenitiesRoute import AmenitiesRoute
from flask_migrate import Migrate
from flask_cors import CORS


app = Flask(__name__)
app.config.from_object(Config)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=30)

CORS(app, origins="http://localhost:4200") 
migrate = Migrate(app, db)  
db.init_app(app)
jwt = JWTManager(app)
app.register_blueprint(authRoute , url_prefix = "/authRoute")
app.register_blueprint(TowerRoute , url_prefix = "/TowerRoute")
app.register_blueprint(FlatRoute , url_prefix = "/FlatRoute")
app.register_blueprint(AmenitiesRoute , url_prefix = "/AmenitiesRoute")
app.register_blueprint(PaymentRoute , url_prefix = "/PaymentRoute")
app.register_blueprint(bookingRoute , url_prefix = "/bookingRoute")
app.register_blueprint(leaseRoute , url_prefix = "/leaseRoute")
app.register_blueprint(FeedbackRoute , url_prefix = "/FeedbackRoute")   



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
