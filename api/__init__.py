import copy
from typing import Union

from flask import Flask, request, jsonify
from flask_mysqldb import MySQL, MySQLdb
from flask_cors import CORS

def get_account(cursor, account_id) -> dict:
    '''Get an account node by accountId'''

    query = '''
        SELECT
            CONCAT('n', accountId) AS id,
            accountText AS text
        FROM
            account
        WHERE
            accountActive = 1
                AND 
            accountId = %s 
    '''
    cursor.execute(query, (account_id[1:], ))
    account_data = cursor.fetchone()
    return account_data

def get_root_sites(cursor, account_id: str) -> list[dict]:
    '''Select root site nodes by accountId'''

    query = '''
        SELECT
            CONCAT('d', siteId) AS id,
            CONCAT('n', parentId) AS parentId,
            siteText AS text
        FROM
            site
        WHERE
            siteActive = 1 
                AND 
            siteRoot = 1 
                AND 
            parentId = %s
    '''
    cursor.execute(query, (account_id, ))
    # Returns a list of site nodes
    return cursor.fetchall()

def get_site_children(cursor, parent_id: str) -> list[dict]:
    '''Return a tree of subsites for root site.'''

    query = '''
        SELECT
            CONCAT('d', siteId) AS id,
            CONCAT('d', parentId) AS parentId,
            siteText AS text
        FROM
            site
        WHERE
            siteActive = 1 
                AND 
            siteRoot = 0 
                AND 
            parentId = %s
    '''
    cursor.execute(query, ('{p}'.format(p=parent_id[1:]), ))
    # Returns a list of site nodes
    return cursor.fetchall()  # list[dict]

def build_site_tree(cursor, node: dict) -> dict:
    '''
        Builds a tree of sites from the root side node.

        Accepts a node as an argument.
        Returns a node .   
    '''

    n = copy.deepcopy(node)
    site_children = get_site_children(cursor=cursor, parent_id=n['id'])
    if len(site_children) == 0:
        return n
    else:
        kids = []
        for child in site_children:
            kids.append(build_site_tree(cursor, child))
        n['children'] = kids
        return n

db = MySQL()

def create_app():

    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config.from_pyfile('config.py', silent=True)

    db.init_app(app)

    @app.route('/get_tree', methods=['POST'])
    def get_tree():
        body = request.get_json()
        account_ids = body['accountIds']  # list
        # return jsonify({
        #         'status': 'ok',
        #         'data': account_id
        #     })

        tree = []

        try:
            with db.connection.cursor() as cursor:

                # Populate the tree with the accounts
                for acc_id in account_ids:
                    account = get_account(cursor=cursor, account_id=acc_id) # list[dic]
                    tree.append(account)

                # Add the root sites
                for account in tree:
                    account_id = account['id'][1:]
                    root_sites = get_root_sites(cursor=cursor, account_id=account_id)
                    try:
                        account['children'].append(root_sites)
                    except KeyError:
                        account['children'] = root_sites

                    # Get the sub sites for each root site
                    kids = []
                    for root_site in account['children']:
                        root_site = build_site_tree(cursor, root_site)  # node
                        kids.append(root_site)
                    account['children'] = kids
                return jsonify({
                    'status': 'ok',
                    'data': tree
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

        # {id: d3, parent: d1, text: Carlow North}

# # Recursive function
# def build_tree(cursor, node: dict) -> dict:
#     '''Recursively build the level tree.'''

#     n = copy.deepcopy(node)
#     # print('build_tree().n = {n}'.format(n=n))
#     children = get_level_children(cursor=cursor,node=n)  # list
#     if len(children) == 0:
#         print('build_tree(). No children found. Returning n: {n}'.format(n=n))
#         return n

#     n['children'] = []
#     for child in children:
#         child = build_tree(cursor=cursor, node=child)
#         n['children'].append(child)
#     return n
