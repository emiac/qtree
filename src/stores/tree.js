import { ref } from 'vue'
import { defineStore } from 'pinia'

const addType = (node) => {
  let nodeType
  switch (node.id.substring(0, 1)) {
    // root
    case 'r':
      nodeType = 'root'
      break
    // account
    case 'a':
      nodeType = 'account'
      break
    // levels
    case 'l':
      nodeType = 'level'
      break
    case 'm':
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
    // root
    case 'root':
      icon = 'home'
      break
    // account
    case 'account':
      icon = 'factory'
      break
    // levels
    case 'level':
      icon = 'folder'
      break
    case 'asset':
      // asset (m = 'machine')
      switch (node.subType) {
        case 'truck':
          icon = 'local_shipping'
          break
        case 'aircraft':
          icon = 'flight'
          break
        case 'bus':
          icon = 'directions_bus'
          break
        default:
          icon = 'question_mark'
      }
      break
    // component
    case 'component':
      icon = 'settings'
      break
    // sample point
    case 'sample-point':
      icon = 'valve'
      break
    // sample
    case 'sample':
      icon = 'water_drop'
      break
    default:
      icon = 'question_mark'
  }
  return icon
}

const addIconColour = (node) => {
  let iconColour = ''
  switch (node.type) {
    case 'root':
      iconColour = 'black'
      break
    // account
    case 'account':
      iconColour = 'black'
      break
    // levels
    case 'level':
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

const fixNode = (node) => {
  // Adds icon and type to tree
  console.log('fixNode().node = ', node)
  node.type = addType(node)
  node.icon = addIcon(node)
  node.iconColour = addIconColour(node)
  if (node.children) {
    node.children.forEach((c) => fixNode(c))
  }
  console.log('fixNode(): Returning node: ', node)
  return node
}

const traverse = (node) => {
  const idArr = []
  idArr.push(node.id)
  if (node.children) {
    const childIds = []
    node.children.forEach((c) => {
      childIds.push(...traverse(c))
    })
    idArr.push(...childIds)
  }
  return idArr
}

const getNodeIdsDownToType = (node) => {
  // const types = ['account', 'level', 'asset', 'component', 'sample-point', 'sample']
  // const index = types.findIndex(downToType)
  // if (index === -1) {
  //   return []
  // }
  const types = ['level', 'account']
  const idArr = []
  idArr.push(node.id)
  if (node.children) {
    const childIds = []
    node.children.forEach((c) => {
      if (types.includes(c.type)) {
        childIds.push(...traverse(c))
      }
    })
    idArr.push(...childIds)
  }
  return idArr
}

export const useTreeStore = defineStore('tree', () => {
  // State
  const tree = ref([])
  const accountId = ref(null)

  // Actions
  const fetchTree = async () => {
    // Returns a basic tree consisting of an account + levels only.
    if (!accountId.value) {
      accountId.value = 'a1'
    }
    const body = JSON.stringify({ accountId: accountId.value })

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

    tree.value = [fixNode(reply.data)]
    console.log('treeStore.js::fetchTree() at end: tree: ', tree.value)
  }

  const expandAccounts = () => {
    console.log('treeStore::expandAccounts()')
    const idArr = []
    console.log(tree.value[0]) // Object
    tree.value[0].children.forEach((account) => {
      console.log('expandAccounts().account = ', account)
      idArr.push(account.id)
    })
    return idArr
  }

  const expandTopLevels = () => {
    const idArr = []
    tree.value[0].children.forEach((account) => {
      idArr.push(account.id)
      if (account.children) {
        account.children.forEach((topLevelNode) => {
          if (topLevelNode.type == 'level') idArr.push(topLevelNode.id)
        })
      }
    })
    return idArr
  }

  const expandAllLevels = () => {
    console.log('tree.js::expandAllLevels()')
    const ids = []
    tree.value.forEach((account) => {
      ids.push(account.id)
      if (account.children) {
        account.children.forEach((c) => {
          ids.push(c.id)
          ids.push(...getNodeIdsDownToType(c))
        })
      }
    })
    return ids
  }

  return {
    tree,
    accountId,
    fetchTree,
    expandAccounts,
    expandTopLevels,
    expandAllLevels
  }
})
