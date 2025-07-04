from flask import Blueprint, request, jsonify
import re

nlp_bp = Blueprint('nlp', __name__)

SYMPTOM_LIST = [
    "fever", "chest pain", "skin rash", "cough", "headache",
    "joint pain", "anxiety", "eye irritation"
]
SYMPTOM_TO_SPECIALTY = {
    "fever": "general physician",
    "chest pain": "cardiologist",
    "skin rash": "dermatologist",
    "cough": "pulmonologist",
    "headache": "neurologist",
    "joint pain": "orthopedic",
    "anxiety": "psychiatrist",
    "eye irritation": "ophthalmologist"
}

def extract_symptoms_from_text(text):
    text = text.lower()
    found = []
    for symptom in SYMPTOM_LIST:
        if re.search(rf'\\b{re.escape(symptom)}\\b', text):
            found.append(symptom)
    return found

@nlp_bp.route('/api/extract-symptoms', methods=['POST'])
def extract_symptoms():
    data = request.get_json()
    query = data.get('query', '')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    symptoms = extract_symptoms_from_text(query)
    specialties = [SYMPTOM_TO_SPECIALTY[s] for s in symptoms if s in SYMPTOM_TO_SPECIALTY]
    return jsonify({'symptoms': symptoms, 'specialties': specialties})
