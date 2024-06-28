import copy
import pymysql.cursors

def get_account(cxn, account_id: str) -> dict:

    '''Get an account from the database for a given accountId.'''

    with cxn.cursor() as cursor:
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

def get_top_level_nodes(cxn, account_id: str) -> list[dict]:

    '''
        Returns a list of top-level nodes.
    '''

    with cxn.cursor() as cursor:
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

def get_level_children(cxn, node: dict) -> list[dict]:
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

    with cxn.cursor() as cursor:
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
def build_tree(cxn, node: dict) -> dict:
    '''Recursively build the level tree.'''

    n = copy.deepcopy(node)
    # print('build_tree().n = {n}'.format(n=n))
    children = get_level_children(cxn, n)  # list
    if len(children) == 0:
        # print('build_tree(). No children found. Returning n: {n}'.format(n=n))
        return n

    n['children'] = []
    for child in children:
        child = build_tree(cxn, child)
        n['children'].append(child)
    return n

def build_icon(node_id: str) -> str:

    prefix = node_id[0]
    match prefix:
        case 'a':
            icon = 'factory'
        case 'l':
            icon = 'group'
        case 'm':
            icon = 'precision_manufaturing'
        case 'c':
            icon = 'settings'
        case _:
            icon = 'question_mark'
    return icon

def add_icons(node: dict) -> dict:
    # print('add_icon(): Node {i} {t}'.format(i=node['id'], t=node['text']))
    node_copy = copy.deepcopy(node)
    node_copy['icon'] = build_icon(node_id=node_copy['id'])
    # print('Added icon to {i}'.format(i=node_copy['id']))
    try:
        children = []
        for child in node_copy['children']:
            child = add_icons(node=child)
            children.append(child)
        node_copy['children'] = children
    except:
        pass
    # print('Returning...')
    return node_copy

# Main program
cfg = {
    'host': 'localhost',
    'user': 'ashley',
    'password': 'tellab@N529',
    'database': 'qtree',
    # 'raise_on_warnings': True,
    'cursorclass': pymysql.cursors.DictCursor
}

with pymysql.connect(**cfg) as cxn:
    account_id = 'a1'
    # 1.  Get the account as a dict
    tree = get_account(cxn=cxn, account_id=account_id)

    # 2. Get the top-level nodes and add to tree as property 'children
    # This step is necessary as the account node and level nodes have different
    # structures.
    top_level_nodes = get_top_level_nodes(cxn=cxn, account_id=account_id)

    tree['children'] = []
    # 3. Build the tree
    for child in top_level_nodes:
        child = build_tree(cxn=cxn, node=child)
        # print('Top-level node: {c}'.format(c=child))
        tree['children'].append(child)

    tree = add_icons(tree)
    tree = [ tree ]

    print('tree: {t}'.format(t=tree))

    # tree = { 'levelId': 'l6', 'parentId': 'l2', 'levelText': 'Tullow West'}
    # tree = build_tree(cxn, tree)
    # print('Short tree: {t}'.format(t=tree))
