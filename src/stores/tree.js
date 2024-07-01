import { ref } from 'vue'
import { defineStore } from 'pinia'

const addType = (node) => {
  let nodeType
  switch (node.id.substring(0, 1)) {
    // assets
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
    // assets
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
  switch (node.id.substring(0, 1)) {
    // assets
    case 'a':
      iconColour = 'black'
      break
    // levels
    case 'l':
      iconColour = 'blue'
      break
    case 'm':
      iconColour = 'green'
      break
    // component
    case 'c':
      iconColour = 'red'
      break
    // sample point
    case 'p':
      iconColour = 'orange'
      break
    // sample
    case 's':
      iconColour = 'yellow'
      break
    default:
      iconColour = 'black'
  }
  return iconColour
}

const fixNodes = (nodeArray) => {
  // Adds icon and type to tree
  nodeArray.forEach((node) => {
    node.type = addType(node)
    node.icon = addIcon(node)
    node.iconColour = addIconColour(node)
    if (node.children) {
      return fixNodes(node.children)
    }
    return node
  })
  return nodeArray
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
        const childNodes = traverse(c)
        childIds.push(...childNodes)
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

    tree.value = fixNodes(reply.data)
    console.log('treeStore.js::fetchTree() at end: tree: ', tree.value)
  }

  const expandAccounts = () => {
    console.log('treeStore::expandTopLevel()')
    const idArr = []
    console.log(tree.value)
    tree.value.forEach((account) => {
      idArr.push(account.id)
    })
    return idArr
  }

  const expandTopLevels = () => {
    const idArr = []
    tree.value.forEach((account) => {
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
    // console.log('tree: ', tree.value)
    // const node = tree.value[0]
    // console.log('node: ', node)
    // const ids = getNodeIdsDownToType(node)
    // console.log('ids: ', ids)

    const ids = []
    tree.value.forEach((account) => {
      console.log('account = ', account)
      console.log(account.id)
      ids.push(account.id)
      console.log('ids: ', ids)
      if (account.children) {
        account.children.forEach((c) => {
          console.log('c.id: ', c.id)
          ids.push(c.id)
          console.log('ids: ', ids)
          console.log('Calling getNodeIdsDownToType(c)...')
          const childNodes = getNodeIdsDownToType(c)
          console.log('childNodes: ', childNodes)
          ids.push([...childNodes])
          console.log('ids: ', ids)
        })
      }
    })
    console.log('return ids: ', ids)
    return ids

    // const accountIds = []
    // const levelIds = []
    // tree.value.forEach((account) => {
    //   accountIds.push(account.id)
    //   if (account.children) {
    //     account.children.forEach((node) => {
    //       if (node.type === 'level') {
    //         levelIds.push(node.id)
    //         levelIds.push(...getLevelIds(node))
    //       }
    //     })
    //   }
    //   console.log(accountIds)
    //   return accountIds
    //   // return [...accountIds, ...levelIds]
    // })
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
