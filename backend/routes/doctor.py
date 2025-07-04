from flask import Blueprint, jsonify, request
from models.patient import Patients
from models.doctor import Doctors
from models.appointment import Appointments
from datetime import datetime
from database import db
from flask_jwt_extended import jwt_required, get_jwt_identity
import math
doctor_bp = Blueprint('doctor', __name__)

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    return c * r
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

@doctor_bp.route('/api/doctors-nearby', methods=['GET'])
@jwt_required()
def get_doctors_nearby():
    try:
        user_id = get_jwt_identity()
        user = Patients.query.get(user_id)
        if not user:
            return jsonify({"success": False, "message": "Patient not found"}), 404
        # Check if user has location data
        if not user.last_known_lat or not user.last_known_lng:
            return jsonify({"success": False, "message": "User location not available"}), 400
        specialty = request.args.get('specialty')
        if specialty:
            all_doctors = Doctors.query.filter(Doctors.specialty.ilike(f"%{specialty}%")).all()
        else:
            all_doctors = Doctors.query.all()
        result = []
        for doc in all_doctors:
            # Check if doctor has location data
            if doc.latitude is None or doc.longitude is None:
                continue
            dist = haversine(user.last_known_lat, user.last_known_lng, doc.latitude, doc.longitude)
            result.append({
                "id": doc.id,
                "name": doc.name,
                "specialty": doc.specialty,
                "clinic_name": doc.clinic_name,
                "clinic_address": doc.clinic_address,
                "phone": doc.phone,
                "fees": doc.fees,
                "age": doc.age,
                "gender": doc.gender,
                "distance_km": round(dist, 2)
            })
        result.sort(key=lambda x: x['distance_km'])
        return jsonify(result), 200
    except Exception as e:
        print(f"Error in get_doctors_nearby: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
