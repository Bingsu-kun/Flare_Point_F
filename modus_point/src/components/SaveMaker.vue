<template>
  <div oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;">
    <h1>마커 만들기</h1>
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

#sm-background {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 6;
}

#sm-foreground {
  
  position: fixed;
  top: 20%;
  left: 33%;
  width: 500px;
  height: 800px;
  border-radius: 20px;
  background-color: white;
  text-align: center;
  z-index: 7;
}

</style>