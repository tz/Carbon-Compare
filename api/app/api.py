from bson import ObjectId
import os
from pymongo import MongoClient

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

    def __del__(self):
        self._client.close()
        
def get_all_subjects():
    db = DB()
    return '{}'.format([s for s in db.query('Subjects', {})])

def get_subject(id):
    db = DB()
    return '{}'.format(db.query('Subjects', {"_id": ObjectId(id)}, 1))
