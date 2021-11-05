<template>
  <div id="my-markers-container">
    <button class="close" @click="menuCloseEvent"></button>
    <div v-if="LOGIN">
      <h3>좋아요한 마커 목록</h3>
      <div id="search-result" v-if="!noResult">
        <div @click="selectedEvent(result.latitude,result.longitude)" id="frag" class="filter-result-fragment" v-for="result in myMarkers" :key="result.MarkerId">
          
          <div id="marker-name">{{ result.name }}</div>
          <span id="marker-tags" v-for="tag in result.tags.split('#')" :key="tag">{{ tag }}</span>
          
        </div>
      </div>
      <div id="no-search-result" v-if="noResult"/>
    </div>
    <div v-if="!LOGIN">
      로그인 후 이용하실 수 있습니다
    </div>
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
  props: ['LOGIN','myMarkers'],
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