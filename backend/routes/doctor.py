from flask import Blueprint, jsonify, request
from models.patient import Patients
from models.doctor import Doctors
from models.appointment import Appointments
from datetime import datetime
from database import db
from flask_jwt_extended import jwt_required, get_jwt_identity
doctor_bp = Blueprint('doctor', __name__)

@doctor_bp.route('/api/doctor_dashboard', methods=['GET'])
@jwt_required()
def doctor_dashboard():
    try:
        doctor_id = get_jwt_identity()
        doctor =   Doctors.query.get(doctor_id)
        if not doctor:
            return jsonify({"success": False, "message": "Doctor not found"}), 404
        appointments = Appointments.query.filter_by(doctor_id=doctor.id).all()
        appointments_data = [a.serialize() for a in appointments]
        return jsonify({
            "success": True,
            "data": {
                "doctor": doctor.serialize(),
                "appointments": appointments_data
            }
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

