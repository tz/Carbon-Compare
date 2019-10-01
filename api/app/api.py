from bson import ObjectId
import os
from pymongo import MongoClient
import json

class DB:
    def __init__(self):
        API_KEY = os.environ['GREEN_CALC_MONGO_PW']
        self._client = MongoClient('mongodb+srv://api:{}@peter-ovlls.mongodb.net/test?retryWrites=true&w=majority'.format(API_KEY))
        self._db = self._client.Green

    def query(self, collection, query, limit=None):
        if limit == 1:
            return self._db[collection].find_one(query)
        elif limit is None:
            return self._db[collection].find(query)
        else:
            raise Exception('bad query limit')

    def aggregate(self, collection, query):
        return self._db[collection].aggregate(query)

    def __del__(self):
        self._client.close()

def get_all_subjects():
    return '[{"name": "Beef", "img": "cow.png", "impact_units": "3.00", "category": "5d2678721c9d440000da14ae", "id": "5d2676581c9d440000da14ab"}, {"name": "Legumes", "img": "beans.png", "impact_units": ".05", "category": "5d2678721c9d440000da14ae", "id": "5d2677961c9d440000da14ad"}, {"name": "Pork", "img": "pig.png", "impact_units": ".781", "category": "5d2678721c9d440000da14ae", "id": "5d278c621c9d440000041dca"}, {"name": "Poultry", "img": "chicken.png", "impact_units": ".572", "category": "5d2678721c9d440000da14ae", "id": "5d278c931c9d440000041dcb"}, {"name": "Potatoes", "img": "potatoes.png", "impact_units": ".01", "category": "5d2678721c9d440000da14ae", "id": "5d278ce81c9d440000041dcc"}, {"name": "Average Car", "img": "car.png", "impact_units": ".35", "category": "5d267b8c36a05e4aaba3a9de", "id": "5d5a0ac91c9d4400009ec343"}]'
    db = DB()
    subjects = [s for s in db.aggregate("Subjects", [{'$lookup':{'from': 'Images','localField': 'image','foreignField': '_id','as': 'img'}},{'$project':{'name':1,'img.file':1,'impact_units':1,'category':1, '_id':1}}])]
    subjects = [{'name': s['name'], 'img': s['img'][0]['file'], 'impact_units': s['impact_units'], 'category': str(s['category']), 'id': str(s['_id'])} for s in subjects]
    print('{}'.format(json.dumps(subjects)))
    return '{}'.format(json.dumps(subjects))

def get_categories():
    return '[{"name": "food", "units": "serving", "img": "burger.png", "id": "5d2678721c9d440000da14ae"}, {"name": "transportation", "units": "passenger kilometer", "img": "plane.png", "id": "5d267b8c36a05e4aaba3a9de"}]'
    db = DB()
    cats = [c for c in db.aggregate("Types", [{'$lookup':{'from': 'Images','localField': 'image','foreignField': '_id','as': 'img'}},{'$project':{'name':1,'units':1, 'img.file':1, '_id':1}}])]
    cats = [{'name': c['name'], 'units': c['units'], 'img': c['img'][0]['file'], 'id': str(c['_id'])} for c in cats]
    # print('{}'.format(json.dumps(cats)))
    return '{}'.format(json.dumps(cats))


def get_subject(id):
    db = DB()
    return '{}'.format(json.dumps(db.query('Subjects', {"_id": ObjectId(id)}, 1)))
