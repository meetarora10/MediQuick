from database import db
class Patients(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20))
    last_known_lat = db.Column(db.Float, nullable=True)
    last_known_lng = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "last_known_lat": self.last_known_lat,
            "last_known_lng": self.last_known_lng,
            "created_at": self.created_at.isoformat(),
            "age": self.age,
            "gender": self.gender,
        }
