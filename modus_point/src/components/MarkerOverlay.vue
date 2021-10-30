<template>
  <div>
    <button class="close" @click="menuCloseEvent"></button>
    <!-- 마커 정보 표시 + 길찾기 버튼 -->
  </div>
</template>

<script>
export default {

  data() {
    return {

    }
  },
  props:['selected'],
  methods: {

    menuCloseEvent: function() {
      this.$emit("menuCloseEvent")
    }

  },


}
</script>

<style>

</style>