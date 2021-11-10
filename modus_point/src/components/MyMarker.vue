<template>
  <div id="my-markers-container">
    <button class="close" @click="menuCloseEvent"></button>
    <div v-if="LOGIN">
      <h3>내 마커 목록</h3>
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
import axios from 'axios';

export default {

  mounted() {
      this.getMyMarkers()
  },
  data() {
      return {
          noResult: true,
          myMarkers: [],
      }
  },
  props: ['LOGIN'],
  methods: {
    getMyMarkers: async function() {
      try {
        await axios({
          method: 'GET',
          url: 'http://3.34.252.182:8080/marker/mymarkers',
          headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
          withCredentials: true
        }).then((res) => {

          if (res.data.success === false) {
            console.log('get liked markers failed.')
          }
          else {
            this.myMarkers = res.data.response
            if (res.data.response !== []) {
              this.noResult = false
            }
          }
        })
      } catch (error) {
        this.logout()
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
#my-markers-container {
  padding: 20px;
}
</style>