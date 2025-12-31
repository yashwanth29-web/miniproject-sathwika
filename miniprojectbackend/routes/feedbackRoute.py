from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from customDecorator import role_required
from models.feedback import Feedback
from models.user import User, db
from schema import FeedbackSchema

FeedbackRoute = Blueprint("FeedbackRoute", __name__)
schema = FeedbackSchema()
@role_required('admin')
@FeedbackRoute.route("/GetAllFeedbacks", methods=["GET"])
def get_all_feedbacks():
    feedbacks = Feedback.query.all()
    return jsonify(schema.dump(feedbacks, many=True)), 200



@role_required('user')
@FeedbackRoute.route("/SubmitFeedback", methods=["POST"])
def submit_feedback():
    data = request.json
    print("incoming data:", data)

    try:
        validated = schema.load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400 

    feedback = Feedback(
        name =validated["name"],
        email=validated["email"],
        message=validated["message"]
    )

    db.session.add(feedback)
    db.session.commit()

    return jsonify({
        "message": "Feedback submitted successfully",
        "feedback": schema.dump(feedback)
    }), 201
