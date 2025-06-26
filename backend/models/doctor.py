from database import db
class Doctors(db.Model):
    __tablename__ = 'doctors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20))
    specialty = db.Column(db.String(100))
    clinic_name = db.Column(db.String(100))
    clinic_address = db.Column(db.String(200))
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    fees = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "specialty": self.specialty,
            "clinic_name": self.clinic_name,
            "clinic_address": self.clinic_address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "fees": self.fees,
            "created_at": self.created_at.isoformat()
        }