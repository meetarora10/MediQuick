from flask import Blueprint, jsonify, request
from models.patient import Patient
from models.appointment import Appointment
from datetime import datetime
from database import db
from flask_jwt_extended import jwt_required, get_jwt_identity
patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/api/patient_dashboard', methods=['GET'])
@jwt_required()
def patient_dashboard():
    try:
        current_user = get_jwt_identity()
        patient = Patient.query.filter_by(id=current_user['id']).first()
        if not patient:
            return jsonify({"success": False, "message": "Patient not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500    
    
    appointments = Appointment.query.filter_by(patient_id=patient.id).all()
    return jsonify({"success": True, "data": {"patient": patient, "appointments": appointments}})
