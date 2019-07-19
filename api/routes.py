from app import api

from flask import Flask, url_for, render_template

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/api/subjects')
def get_data():
    return api.get_all_subjects()

@app.route('/api/subject/<string:subject_id>')
def get_subject(subject_id):
    return api.get_subject(subject_id)

# url_for('static', filename='main.css')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
