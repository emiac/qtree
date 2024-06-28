<template>
  <div class="q-ma-md">
    <div class="q-pa-md">
      <q-btn label="Fetch Tree" no-caps @click="fetchTree"></q-btn>
    </div>
    <div class="q-pa-md">
      <q-tree :nodes="nodes" node-key="id" label-key="text"></q-tree>
    </div>
    <div>End</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nodes = ref([])

const fetchTree = async () => {
  const body = JSON.stringify({ accountId: 'a1' })

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
  nodes.value = reply.data
}
</script>
