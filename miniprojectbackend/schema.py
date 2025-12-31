from datetime import date
from marshmallow import Schema , fields ,  validate  , validates_schema , ValidationError
class UserSchema(Schema):
    user_id =fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True , validate=validate.Length(min = 3 , max =100))
    confirm_password = fields.Str(required=True)
    phone_num =fields.Int(required=True )
    role = fields.Str(required=True)
    @validates_schema
    def validate_passwords(self, data, **kwargs):
        if data["password"] != data["confirm_password"]:
            raise ValidationError("Passwords do not match")
        

class FeedbackSchema(Schema):
    feedback_id = fields.Int(dump_only=True)
    name = fields.Str(required=True , validate=validate.Length(min=2))
    email = fields.Email(required=True)
    message = fields.Str(required=True , validate=validate.Length(min=5))

class RegisterSchema(Schema):
    user_id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    phone_num = fields.Int(required=True)
    role = fields.Str(required=True)

    password = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=100),
        load_only=True
    )
    confirm_password = fields.Str(required=True, load_only=True)

    @validates_schema
    def validate_passwords(self, data, **kwargs):
        if data["password"] != data["confirm_password"]:
            raise ValidationError("Passwords do not match")
        

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)

class TowerSchema(Schema):
    tower_id = fields.Int(dump_only=True)
    tower_name = fields.Str(required=True, validate=validate.Length(min=2))
    no_of_floors = fields.Int(required=True, validate=validate.Range(min=1))
    no_of_flats = fields.Int(required=True, validate=validate.Range(min=1))
    area = fields.Str(required=True)

    flats = fields.Nested("FlatSchema", many=True, dump_only=True)
    amenities = fields.Nested("AmenitiesSchema", many=True, dump_only=True)

class FlatSchema(Schema):
    flat_id = fields.Int(dump_only=True)
    flat_number = fields.Int(required=True, validate=validate.Range(min=1))
    rent = fields.Int(required=True, validate=validate.Range(min=1))
    availability = fields.Str(
        required=True,
        validate=validate.OneOf(["available", "occupied", "booked"])
    )
    tower_id = fields.Int(required=True)

class BookingSchema(Schema):
    booking_id = fields.Int(dump_only=True)
    flat_id = fields.Int(required=True)
    tower_id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    booking_status = fields.Str(
        validate=validate.OneOf(["pending", "approved", "rejected"]),
        load_default="pending"
    )

class AmenitiesSchema(Schema):
    amenity_id = fields.Int(dump_only=True)
    amenity_name = fields.Str(required=True, validate=validate.Length(min=2))
    description = fields.Str(required=True)
    tower_id = fields.Int(required=True)


class PaymentSchema(Schema):
    payment_id = fields.Int(dump_only=True)
    booking_id = fields.Int(required=True)

    payment_status = fields.Str(
        dump_only=True,
        validate=validate.OneOf(["pending", "completed", "failed"])
    )

    amount = fields.Float(dump_only=True)
    user_id = fields.Int(dump_only=True)


class LeaseSchema(Schema):
    lease_id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    flat_id = fields.Int(dump_only=True)
    tower_id = fields.Int(dump_only=True)
    booking_id = fields.Int(dump_only=True)

    start_date = fields.Date(dump_only=True)
    end_date = fields.Date(dump_only=True)
    rent = fields.Float(dump_only=True)
    lease_status = fields.Str(dump_only=True)
