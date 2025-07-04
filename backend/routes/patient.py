from flask import Blueprint, jsonify, request
from models.patient import Patients
from models.appointment import Appointments
from models.doctor import Doctors
from datetime import datetime
from database import db
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/api/patient_dashboard', methods=['GET'])
@jwt_required()
def patient_dashboard():
    try:
        patient_id = get_jwt_identity()
        patient = Patients.query.get(patient_id)
        if not patient:
            return jsonify({"success": False, "message": "Patient not found"}), 404
        appointments = Appointments.query.filter_by(patient_id=patient.id).all()
        appointments_data = []
        for a in appointments:
            appt_dict = a.serialize()
            doctor = Doctors.query.get(a.doctor_id)
            appt_dict["doctorName"] = doctor.name if doctor else None
            appointments_data.append(appt_dict)
        return jsonify({
            "success": True,
            "data": {
                "patient": patient.serialize(),
                "appointments": appointments_data
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500    
    
@patient_bp.route('/api/update-location', methods=['POST'])
@jwt_required()
def update_location():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    lat = data.get("latitude")
    lng = data.get("longitude")

    user = Patients.query.get(current_user_id)
    if user:
        user.last_known_lat = lat
        user.last_known_lng = lng
        db.session.commit()
        return jsonify({"message": "Location updated successfully"}), 200
    return jsonify({"error": "User not found"}), 404


@patient_bp.route('/api/patient/profile', methods=['PUT'])
@jwt_required()
def update_patient_profile():
    try:
        patient_id = get_jwt_identity()
        patient = Patients.query.get(patient_id)
        if not patient:
            return jsonify({"success": False, "message": "Patient not found"}), 404
        data = request.get_json()
        # Only update fields that exist in the model
        for field in ["name", "email", "phone", "age", "gender"]:
            if field in data:
                setattr(patient, field, data[field])
        db.session.commit()
        return jsonify({"success": True, "data": {"patient": patient.serialize()}}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@patient_bp.route('/api/appointments', methods=['POST'])
@jwt_required()
def book_appointment():
    try:
        patient_id = get_jwt_identity()
        data = request.get_json()
        doctor_id = data.get('doctor_id')
        appointment_date = data.get('appointment_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        if not all([doctor_id, appointment_date, start_time, end_time]):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        # Check for slot conflict
        existing = Appointments.query.filter_by(
            doctor_id=doctor_id,
            appointment_date=appointment_date,
            start_time=start_time,
            end_time=end_time
        ).first()
        if existing:
            return jsonify({'success': False, 'message': 'This slot is already booked.'}), 409
        new_appt = Appointments(
            patient_id=patient_id,
            doctor_id=doctor_id,
            appointment_date=appointment_date,
            start_time=start_time,
            end_time=end_time,
            status='Scheduled'
        )
        db.session.add(new_appt)
        db.session.commit()
        return jsonify({'success': True, 'data': {'appointment': new_appt.serialize()}}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
