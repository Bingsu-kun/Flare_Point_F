<template>
  <div oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;">
    <span id="menu-blankmaker"/>
    <span id="menu-container">
    </span>
  </div>
</template>

<script>
export default {
  methods: {
    saveEvent: function() {
      this.$emit('saveEvent')
    }
  }
}
</script>

<style>




</style>