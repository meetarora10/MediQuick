import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from database import db
from flask_jwt_extended import JWTManager
from routes.auth import auth
from routes.doctor import doctor_bp
from routes.patient import patient_bp
from routes.nlp import nlp_bp
from routes.appointment import appointment_bp 
import openai
load_dotenv()  
app = Flask(__name__)
CORS(app, origins=["https://medi-quick-um5b-ldxpsgo1m-meet-aroras-projects.vercel.app"], supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', app.config['SECRET_KEY'])
openai.api_key = os.getenv("OPENAI_API_KEY")
print("OpenAI API Key:", openai.api_key)  # Debugging line to check if the key is loaded    
db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(auth, url_prefix='/api')
app.register_blueprint(doctor_bp)
app.register_blueprint(patient_bp)
app.register_blueprint(nlp_bp)
app.register_blueprint(appointment_bp)
def db_init():
    with app.app_context():
        db.create_all()
        print("Database initialized.")

db_init()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
