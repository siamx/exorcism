<template>
  <q-tooltip
    anchor="bottom middle"
    self="top middle"
    content-style="font-size: 14px"
    content-class="bg-black"
    transition-show="flip-right"
    transition-hide="flip-left"
    :offset="[10, 10]"
  >
    <strong>{{ text }}</strong>
  </q-tooltip>
</template>

<script>
export default {
  props: {
    text: {
      required: true,
      type: String
    }
  }
}
</script>
