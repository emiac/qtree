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
        @click="fetchTree"
      ></q-btn>
    </div>
    <q-separator></q-separator>
    <div class="q-pa-xs row items-left">
      <q-toggle size="xs" v-model="isDense" label="Dense"></q-toggle>
      <q-toggle size="xs" v-model="isAccordion" label="Accordion"></q-toggle>
      <div class="row items-center q-ml-sm">Selected ID: {{ selected }}</div>
    </div>
    <q-separator></q-separator>
    <div class="q-pa-md">
      <q-tree
        :dense="isDense"
        :accordion="isAccordion"
        node-key="id"
        :nodes="nodes"
        v-model:selected="selected"
        @update:selected="console.log('selected')"
        no-nodes-label="No account supplied."
        no-transition
      >
        <template #default-header="prop">
          <div
            class="row items-center"
            :class="{ 'selected-class': prop.node.id === selected }"
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
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTreeStore } from 'src/stores/tree.js'
const treeStore = useTreeStore()
const { nodes, accountId } = storeToRefs(treeStore)

const selected = ref()
const isDense = ref(false)
const isAccordion = ref(false)

const fetchTree = async () => {
  if (!accountId.value) {
    accountId.value = 'a1'
  }
  const body = JSON.stringify({ accountId: accountId.value })

  console.log(`body: ${body}`)
  const reponse = await fetch('http://localhost:5000/get_tree', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': true,
    },
    body,
  })
  const reply = await reponse.json()
  console.log(reply)
  const tree = treeStore.addIcons(reply.data)
  console.log('tree: ', tree)
  nodes.value = tree
}
</script>

<style scoped>
.selected-node {
  background-color: pink;
}
</style>
