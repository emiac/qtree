import copy

from flask import Flask, request, jsonify
from flask_mysqldb import MySQL, MySQLdb
from flask_cors import CORS

def get_account(cursor, account_id: str) -> dict:
    query = '''
                SELECT
                    accountId AS id,
                    accountText AS text
                FROM
                    account
                WHERE
                    accountId = %s
            '''
    cursor.execute(query, (account_id, ))
    return cursor.fetchone()

def get_top_level_nodes(cursor, account_id: str) -> list[dict]:

    query = '''
        SELECT
            levelId AS id,
            parentId AS parentId,
            levelText AS text
        FROM
            level
        WHERE
            parentId = %s
    '''
    cursor.execute(query, (account_id, ))
    return cursor.fetchall()

def get_level_children(cursor, node: dict) -> list[dict]:
    '''
        Returns the node supplied, but with the added property of 'children' (if child nodes are present), else returns the original node untouched.

        node = { 'levelId: 1, 'parentId': 'a1', 'levelText': 'Carlow' }
        returns: [
            { 'levelId: 'l3', 'parentId': 'l1', 'levelText': 'Carlow North' }
            { 'levelId: 'l4', 'parentId': 'l2', 'levelText': 'Carlow South' }
        ]
    '''

    n = copy.deepcopy(node)
    # print('get_level_children().n = {n}'.format(n=n))

    query = '''
        SELECT
            levelId AS id,
            parentId AS parentId,
            levelText AS text
        FROM
            level
        WHERE
            parentId = %s
    '''
    cursor.execute(query, (n['id'], ))
    children = cursor.fetchall()
    # [
    #   { 'levelId': 2, 'parentId': 1, 'levelText': 'Carlow North' },
    #   { 'levelId': 3, 'parentId': 1, 'levelText': 'Carlow South' },
    # ]

    return children

# Recursive function
def build_tree(cursor, node: dict) -> dict:
    '''Recursively build the level tree.'''

    n = copy.deepcopy(node)
    # print('build_tree().n = {n}'.format(n=n))
    children = get_level_children(cursor=cursor,node=n)  # list
    if len(children) == 0:
        print('build_tree(). No children found. Returning n: {n}'.format(n=n))
        return n

    n['children'] = []
    for child in children:
        child = build_tree(cursor=cursor, node=child)
        n['children'].append(child)
    return n

db = MySQL()

def create_app():

    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config.from_pyfile('config.py', silent=True)

    db.init_app(app)

    @app.route('/get_tree', methods=['POST'])
    def get_tree():
        print('Arrived...')
        body = request.get_json()
        account_id = body['accountId']
        # return jsonify({
        #         'status': 'ok',
        #         'data': account_id
        #     })


        try:
            with db.connection.cursor() as cursor:
                tree = get_account(cursor=cursor, account_id=account_id)
                top_level_nodes = get_top_level_nodes(cursor=cursor, account_id=account_id)
                tree['children'] = []
                for child in top_level_nodes:
                    child = build_tree(cursor=cursor, node=child)
                    # print('Top-level node: {c}'.format(c=child))
                    tree['children'].append(child)

                return jsonify({
                    'status': 'ok',
                    'data': [ tree ]
                })
        except MySQLdb.OperationalError as err:
            return jsonify({
                'status': 'error',
                'data': err
            })
        except Exception as err:
            return jsonify({
                'status': 'error',
                'data': err
            })

    return app
