from flask import Blueprint, jsonify, request
from models.patient import Patients
from models.appointment import Appointments
from datetime import datetime
from database import db
from flask_jwt_extended import jwt_required, get_jwt_identity
doctor_bp = Blueprint('doctor', __name__)

@doctor_bp.route('/api/doctor_dashboard', methods=['GET'])
@jwt_required()
def doctor_dashboard():
    try:
        current_user = get_jwt_identity()
        if not current_user or 'id' not in current_user:
            return jsonify({"success": False, "message": "Unauthorized"}), 401
        
        doctor = Patients.query.filter_by(id=current_user['id'], role='doctor').first()
        if not doctor:
            return jsonify({"success": False, "message": "Doctor not found"}), 404  
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    appointments = Appointments.query.filter_by(doctor_id=doctor.id).all()
    return jsonify({"success": True, "data": {"doctor": doctor, "appointments": appointments}})

