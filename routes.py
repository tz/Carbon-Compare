from bson import ObjectId
from flask import Flask, url_for, render_template
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('mongodb+srv://api:{}@peter-ovlls.mongodb.net/test?retryWrites=true&w=majority'.format(API_KEY))
db = client.Green

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/api/subjects')
def get_data():
    return '{}'.format([s for s in db.Subjects.find({})])

@app.route('/api/subject/<string:subject_id>')
def get_subject(subject_id):
    s = db.Subjects.find_one({"_id": ObjectId(subject_id)})
    print(s)
    return '{}'.format(s)

# url_for('static', filename='main.css')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
