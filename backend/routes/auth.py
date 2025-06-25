from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, set_access_cookies
from flask import Blueprint, jsonify, request
from database import db
from models import Patients, Doctors
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

# Patient Registration
@auth.route('/register/patient', methods=['POST'])
def register_patient():
    print("Register route hit")
    data = request.get_json()
    if Patients.query.filter_by(email=data.get('email')).first():
        return jsonify(message="Email already registered."), 409
    new_patient = Patients(
        name=data.get('name'),
        email=data.get('email'),
        password_hash=generate_password_hash(data.get('password')),
        phone=data.get('phone')
    )
    db.session.add(new_patient)
    db.session.commit()
    return jsonify(message="Patient registered successfully."), 201

# Doctor Registration
@auth.route('/register/doctor', methods=['POST'])
def register_doctor():
    data = request.get_json()
    if Doctors.query.filter_by(email=data.get('email')).first():
        return jsonify(message="Email already registered."), 409
    new_doctor = Doctors(
        name=data.get('name'),
        email=data.get('email'),
        password_hash=generate_password_hash(data.get('password')),
        phone=data.get('phone'),
        specialty=data.get('specialty'),
        clinic_name=data.get('clinic_name'),
        clinic_address=data.get('clinic_address'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude')
    )
    db.session.add(new_doctor)
    db.session.commit()
    return jsonify(message="Doctor registered successfully."), 201

# Patient Login
@auth.route('/login/patient', methods=['POST'])
def login_patient():
    data = request.get_json()
    patient = Patients.query.filter_by(email=data.get('email')).first()
    if not patient or not check_password_hash(patient.password_hash, data.get('password')):
        return jsonify(message="Invalid credentials."), 401
    access_token = create_access_token(identity=patient.id)
    return jsonify(access_token=access_token, user={"id": patient.id, "name": patient.name, "email": patient.email, "role": "patient"})

# Doctor Login
@auth.route('/login/doctor', methods=['POST'])
def login_doctor():
    data = request.get_json()
    doctor = Doctors.query.filter_by(email=data.get('email')).first()
    if not doctor or not check_password_hash(doctor.password_hash, data.get('password')):
        return jsonify(message="Invalid credentials."), 401
    access_token = create_access_token(identity=doctor.id)
    return jsonify(access_token=access_token, user={"id": doctor.id, "name": doctor.name, "email": doctor.email, "role": "doctor"})
