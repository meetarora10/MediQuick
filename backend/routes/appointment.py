from flask import request, jsonify, Blueprint
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.appointment import Appointments
from database import db
appointment_bp = Blueprint("appointments", __name__)

@appointment_bp.route("/api/appointments", methods=["POST"])
@jwt_required()
def book_appointment():
    data = request.get_json()
    
    try:
        # Convert string inputs to proper Python types
        doctor_id = int(data.get('doctor_id'))
        appointment_date = datetime.strptime(data['appointment_date'], "%Y-%m-%d").date()
        start_time = datetime.strptime(data['start_time'], "%H:%M").time()
        end_time = datetime.strptime(data['end_time'], "%H:%M").time()
        if not all([doctor_id, appointment_date, start_time, end_time]):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        # Check for slot conflict (overlapping time ranges)
        conflict = Appointments.query.filter(
            Appointments.doctor_id == doctor_id,
            Appointments.appointment_date == appointment_date,
            db.or_(
                db.and_(Appointments.start_time <= start_time, Appointments.end_time > start_time),
                db.and_(Appointments.start_time < end_time, Appointments.end_time >= end_time),
                db.and_(Appointments.start_time >= start_time, Appointments.end_time <= end_time)
            )
        ).first()
        if conflict:
            return jsonify({'success': False, 'message': 'This time slot overlaps with an existing appointment.'}), 409
        new_appt = Appointments(
            patient_id= get_jwt_identity(),
            doctor_id=doctor_id,
            appointment_date=appointment_date,
            start_time=start_time,
            end_time=end_time,
            status="Scheduled"
        )

        db.session.add(new_appt)
        db.session.commit()

        return jsonify(success=True, message="Appointment booked successfully.")
    
    except Exception as e:
        db.session.rollback()
        return jsonify(success=False, message=str(e)), 400

@appointment_bp.route("/api/appointments/<int:appointment_id>", methods=["DELETE"])
@jwt_required()
def cancel_appointment(appointment_id):
    try:
        user_id = get_jwt_identity()
        appt = Appointments.query.filter_by(id=appointment_id, patient_id=user_id).first()
        if not appt:
            return jsonify(success=False, message="Appointment not found or not authorized."), 404
        db.session.delete(appt)
        db.session.commit()
        return jsonify(success=True, message="Appointment cancelled successfully.")
    except Exception as e:
        db.session.rollback()
        return jsonify(success=False, message=str(e)), 400
