node = {
    'id': 1,
    'parentId': 0,
    'text': 'Root Node',
    'children': [
        {
            'id': 2,
            'parent': 1,
            'children': [
                {
                    'id': 4,
                    'parent': 2,
                    'children': [
                        {
                            'id': 7,
                            'parent': 4,
                            'children': [
                                {
                                    'id': 9,
                                    'parent': 7
                                },{
                                    'id': 10,
                                    'parent': 7
                                }
                            ]
                        },
                        {
                            'id': 8,
                            'parent': 4
                        }
                    ]
                },
                {
                'id': 5,
                'parent': 2
                },
                {
                'id': 6,
                'parent': 2
                },
            ]
        },
        {
            'id': 3,
            'parent': 1,
            'children': [
                {
                    'id': 11,
                    'parent': 3
                },
                {
                    'id': 12,
                    'parent': 3
                }
            ]
        },
    ]
}


def get_node_ids(node) -> list:
    return_nodes = [node['id']]
    try:
        for child in node['children']:
            return_nodes.extend(get_node_ids(child))
        return return_nodes
    except KeyError:
        return return_nodes
    
all_nodes = get_node_ids(node) # Must return list
print(all_nodes)
