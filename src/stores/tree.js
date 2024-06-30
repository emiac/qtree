import { ref } from 'vue'
import { defineStore } from 'pinia'

const buildIcon = (node) => {
  // Returns an icon based on first character in node ID
  let icon = ''
  switch (node.id.substring(0, 1)) {
    // assets
    case 'a':
      icon = 'factory'
      break
    // levels
    case 'l':
      icon = 'folder'
      break
    case 'm':
      // asset (m = 'machine')
      switch (node.type) {
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
    case 'c':
      icon = 'settings'
      break
    // sample point
    case 'p':
      icon = 'valve'
      break
    // sample
    case 's':
      icon = 'water_drop'
      break
    default:
      icon = 'question_mark'
  }
  return icon
}

const buildIconColour = (node) => {
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

export const useTreeStore = defineStore('tree', () => {
  // State

  const nodes = ref([])
  const accountId = ref()

  const addIcons = (nodeArray) => {
    nodeArray.forEach((node) => {
      node.icon = buildIcon(node)
      node.iconColour = buildIconColour(node)
      if (node.children) {
        return addIcons(node.children)
      }
      return node
    })
    return nodeArray
  }

  return {
    nodes,
    accountId,
    addIcons,
  }
})
