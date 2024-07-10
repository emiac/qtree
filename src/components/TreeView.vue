<template>
  <div class="q-ma-md">
    <div class="q-pa-md row items-center justify-left">
      <q-input
        v-model="accountId"
        label="accountId"
        style="width: 100px"
      ></q-input>
      <q-btn
        class="q-ml-md"
        color="blue"
        dense
        :stretch="false"
        size="md"
        label="Fetch Tree"
        no-caps
        @click="treeStore.fetchTree()"
      ></q-btn>
    </div>
    <q-separator></q-separator>
    <div class="q-pa-sm row items-left">
      <q-toggle size="sm" v-model="isDense" label="Dense"></q-toggle>
      <q-toggle size="sm" v-model="isAccordion" label="Accordion"></q-toggle>
      <div class="row items-center q-ml-sm">Selected ID: {{ selectedId }}</div>
      <q-btn
        class="q-ml-sm"
        color="blue"
        dense
        size="md"
        label="Expand Top"
        no-caps
        @click="treeStore.expandAccounts"
      ></q-btn>
      <q-btn
        class="q-ml-sm"
        color="blue"
        dense
        size="md"
        label="Expand All"
        no-caps
        @click="expandAllLevels"
      ></q-btn>

      <q-btn
        class="q-ml-sm"
        color="blue"
        dense
        size="md"
        label="Collapse All"
        no-caps
        @click="collapseAll"
      ></q-btn>

      <q-btn
        class="q-ml-sm"
        color="blue"
        dense
        size="md"
        label="Special"
        no-caps
        @click="treeStore.specialFunction"
      ></q-btn>

      <q-btn
        class="q-ml-sm"
        color="blue"
        dense
        size="md"
        label="Expand All Levels"
        no-caps
        @click="treeStore.expandDownToLevels()"
      ></q-btn>
    </div>
    <q-separator></q-separator>
    <div class="q-pa-md">
      <q-tree
        :dense="isDense"
        :accordion="isAccordion"
        node-key="id"
        :nodes="tree"
        v-model:selected="selectedId"
        v-model:expanded="expandedId"
        no-nodes-label="No account supplied."
        no-transition
      >
        <template #default-header="prop">
          <div
            class="row items-center"
            :class="{ 'selected-node': prop.node.id === selectedId }"
            style="width: 100%"
          >
            <q-icon
              :name="prop.node.icon"
              :color="prop.node.iconColour"
              size="28px"
              class="q-mr-sm"
            />
            <div>{{ prop.node.text }}</div>
          </div>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTreeStore } from 'src/stores/tree.js'
const treeStore = useTreeStore()
const { tree, accountId, expandedId } = storeToRefs(treeStore)

// This must be ref(null).  ref() does not work!
const selectedId = ref(null)
const isDense = ref(false)
const isAccordion = ref(false)

// Watch the tree and expand the top accounts when it changes
watch(tree, (curr, prev) => {
  if (curr.length > 0 && prev.length === 0) {
    treeStore.expandAccounts()
  }
})

const expandAllLevels = () => {
  console.log('Tree.vue::expandAllLevels()')
  console.log(treeStore.expandAllLevels())
  treeStore.expandAllLevels()
}

const collapseAll = () => {
  expandedId.value = []
}
</script>

<style scoped>
.selected-node {
  background-color: rgb(228, 228, 228);
}
</style>
