<template>
  <div id="my-markers-container">
    <button class="close" @click="menuCloseEvent"></button>
        <!--
        무한 스크롤 내부 수정 필요.
        <div @click="selectedEvent(result.latitude,result.longitude)" id="frag" class="search-result-fragment" v-for="result in myMarkers" :key="result.markerId">
            <div id="place-name">{{ result.place_name }}</div>
            <div id="place-address">
            <span style="margin-bottom: 5px;">{{ result.road_address_name }}</span>
            <span>(지번) {{ result.address_name }}</span>
            </div>
            <div id="place-phone">{{ result.phone }}</div>
        </div>
        <img v-if="noResult" id="NO-RESULT" alt="no-result">

        -->
  </div>
</template>

<script>
export default {
  mounted() {
      this.isNoResult(this.myMarkers)
  },
  data() {
      return {
          noResult: false,
      }
  },
  props: ['myMarkers'],
  methods: {
    isNoResult: function(myMarkers) {
        if (myMarkers === []) {
            this.noResult = true
        }
        else {
            this.noResult = false
        }
    },
    selectedEvent(Lat, Lng) {
        this.$emit('selectedEvent',Lat,Lng)
    },
    menuCloseEvent: function() {
      this.$emit("menuCloseEvent")
    }
  }

}
</script>

<style>

</style>