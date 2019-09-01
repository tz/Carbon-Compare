from app import api

from flask import Flask, url_for, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'ok'

@app.route('/api/subjects')
def get_subjects():
    return api.get_all_subjects()

@app.route('/api/categories')
def get_categories():
    return api.get_categories()

@app.route('/api/subject/<string:subject_id>')
def get_subject(subject_id):
    return api.get_subject(subject_id)

# url_for('static', filename='main.css')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
