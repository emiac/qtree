import { ref } from 'vue'
import { defineStore } from 'pinia'

const addType = (node) => {
  let nodeType
  switch (node.id.substring(0, 1)) {
    // account
    case 'n':
      nodeType = 'account'
      break
    // levels
    case 'd':
      nodeType = 'site'
      break
    case 'a':
      nodeType = 'asset'
      break
    // component
    case 'c':
      nodeType = 'component'
      break
    // sample point
    case 'p':
      nodeType = 'sample-point'
      break
    // sample
    case 's':
      nodeType = 'sample'
      break
    default:
      nodeType = ''
  }
  return nodeType
}

const addIcon = (node) => {
  // Returns an icon based on first character in node ID
  let icon
  switch (node.type) {
    // account
    case 'account':
      icon = 'mdi-factory'
      break
    // levels
    case 'site':
      icon = 'mdi-folder-account'
      break
    case 'asset':
      // asset
      icon = node.subType
      break
    // component
    case 'component':
      icon = 'mdi-cog'
      break
    // sample point
    case 'sample-point':
      icon = 'mdi-pipe-valve'
      break
    // sample
    case 'sample':
      icon = 'mdi-water'
      break
    default:
      icon = 'mdi-help'
  }
  return icon
}

const addIconColour = (node) => {
  let iconColour = ''
  switch (node.type) {
    // account
    case 'account':
      iconColour = 'black'
      break
    // levels
    case 'site':
      iconColour = 'blue'
      break
    case 'asset':
      iconColour = 'green'
      break
    // component
    case 'component':
      iconColour = 'red'
      break
    // sample point
    case 'sample-point':
      iconColour = 'orange'
      break
    // sample
    case 'sample':
      iconColour = 'yellow'
      break
    default:
      iconColour = 'black'
  }
  return iconColour
}

const fixTreeNodes = (nodeArr) => {
  // Recursive function to add type, icon and iconColour to each node
  // Argument is array of nodes
  // Returns an array of nodes

  const tree = []
  nodeArr.forEach((n) => {
    n.type = addType(n)
    n.icon = addIcon(n)
    n.iconColour = addIconColour(n)
    if (n.children) {
      n.children = fixTreeNodes(n.children)
      tree.push(n)
    } else {
      tree.push(n)
    }
  })
  return tree
}

const getAllNodeIds = (node) => {
  // Recursive function to get all node id's from a given root node
  const ids = [node.id]
  if (node.children) {
    node.children.forEach((n) => {
      ids.push(...getAllNodeIds(n))
    })
    return ids
  } else {
    return ids
  }
}

const getNodeIdsOfNodesWithChildren = (node) => {
  const ids = [node.id]
  if (node.children) {
    node.children.forEach((n) => {
      if (n.children) {
        ids.push(...getNodeIdsOfNodesWithChildren(n))
      }
    })
    return ids
  } else {
    return ids
  }
}

const getAllNodeIdsByType = (node, types) => {
  // Recursive function to get all node id's down to a given type
  // The arguments are:
  //    tree [nodes]
  //    array of type
  //      Needs to include all type from top to bottom
  //      ['account', 'site'], ['account', 'site', 'asset'],
  //      ['account', 'site', 'asset', component] are valid

  const ids = []
  if (types.includes(node.type)) {
    ids.push(node.id)
  }
  if (node.children) {
    node.children.forEach((n) => {
      if (types.includes(n.type)) {
        ids.push(...getAllNodeIdsByType(n, types))
      }
    })
  } else {
    return ids
  }

  return ids
}

// eslint-disable-next-line no-unused-vars
const getAllTreeNodeIds = (nodeArr) => {
  // Return all nodes in a tree with multiple root nodes
  const ids = []
  nodeArr.forEach((a) => {
    ids.push(...getAllNodeIds(a))
  })
  return ids
}

const getNodeTreeNodeIdsOfNodesWithChildren = (nodeArr) => {
  const ids = []
  nodeArr.forEach((a) => {
    ids.push(...getNodeIdsOfNodesWithChildren(a))
  })
  return ids
}

const getAllTreeNodesOfType = (nodeArr, types) => {
  const ids = []
  nodeArr.forEach((n) => {
    ids.push(...getAllNodeIdsByType(n, types))
  })
  return ids
}

export const useTreeStore = defineStore('tree', () => {
  // State
  const tree = ref([])
  const accountId = ref(null)
  const expandedId = ref([])

  // Actions
  const fetchTree = async () => {
    // Returns a basic tree consisting of an account + sites only.
    expandedId.value = []
    let accountIds
    if (!accountId.value) {
      accountIds = ['a1']
    }
    const body = JSON.stringify({ accountIds })

    console.log(`body: ${body}`)
    const reponse = await fetch('http://localhost:5000/get_tree', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': true
      },
      body
    })
    const reply = await reponse.json()
    console.log('reply: ', reply.data)

    tree.value = fixTreeNodes(reply.data)
    expandAccounts()
    // tree.value = reply.data
    console.log('treeStore.js::fetchTree() at end: tree: ', tree.value)
  }

  const expandAccounts = () => {
    expandedId.value = []
    tree.value.forEach((a) => {
      expandedId.value.push(a.id)
    })
    console.log('expandAccounts().expandedId: ', expandedId.value)
  }

  const expandAllLevels = () => {
    expandedId.value = getNodeTreeNodeIdsOfNodesWithChildren(tree.value)
  }

  const expandDownToLevels = () => {
    expandedId.value = getAllTreeNodesOfType(tree.value, ['account'])
  }

  const specialFunction = () => {
    // test if by expanding nodes down on the tree it forces the parent node to expand too
    // expandedId.value = ['d6']
    // Does not work.  Have to expand the parent nodes too
    expandedId.value = ['n1', 'd2', 'd6']
  }

  return {
    tree,
    accountId,
    expandedId,
    fetchTree,
    expandAccounts,
    expandAllLevels,
    expandDownToLevels,
    specialFunction
  }
})
