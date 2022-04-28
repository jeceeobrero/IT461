from flask import g
from db import Db


class Cat():
    cat_list = [
        {'id': 1, 'name': 'Miming'},
        {'id': 2, 'name': 'Chucky'}
    ]

    def sanitize(self, cats):
        clean_cats = []
        for cat in cats:
            if not isinstance(cat, dict) or not ('id' in cat and 'name' in cat):
                continue
            clean_cats.append(cat)
        return clean_cats

    def post(self, cats):
        if not isinstance(cats, (list, tuple)):
            cats = [cats]
        clean_cats = self.sanitize(cats)
        if len(cats) != len(clean_cats):
            return False
        db = Db()
        db.connect()
        for cat in clean_cats:
            sql = "INSERT INTO cats(name) VALUES(%s)"
            print(sql)
            db.query(sql, cat['name'])
            self.cat_list.append(cat)

    def get(self, filters=None):
        cats = self.cat_list
        if filters is not None:
            if 'id' in filters:
                cats = None
                for item in self.cat_list:
                    if int(item['id']) == int(filters['id']):
                        cats = item
                        break
            # if another filter
        return cats

    def put(self, cats):
        if not isinstance(cats, (list, tuple)):
            cats = [cats]
        clean_cats = self.sanitize(cats)
        if len(cats) != len(clean_cats):
            return False
        for cat in clean_cats:
            for index, item in enumerate(self.cat_list):
                if int(item['id']) == int(cat['id']):
                    self.cat_list[index]['name'] = cat['name']
                    break
        return cats

    def delete(self, cats):
        counter = 0
        if not isinstance(cats, (list, tuple)):
            cats = [cats]
        for cat in cats:
            for index, item in enumerate(self.cat_list):
                if int(item['id']) == int(cat):
                    del self.cat_list[index]
                    counter += 1
                    break
        return counter
