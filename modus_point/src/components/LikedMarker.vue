<template>
  <div id="liked-markers-container">
    <button class="close" @click="menuCloseEvent"></button>
    <div v-if="LOGIN">
      <h3>좋아요한 마커 목록</h3>
      <div id="search-result" v-if="!noResult">
        <div @click="selectedEvent(result.latitude,result.longitude)" id="frag" class="filter-result-fragment" v-for="result in likedMarkers" :key="result.MarkerId">
          
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
  mount() {
    this.getLikedMarkers()
  },
  data() {
    return {
      noResult: true,
      likedMarkers: []
    }
  },
  props: ['LOGIN'],
  methods: {
    getLikedMarkers: async function() {
      try {
        await axios({
          method: 'GET',
          url: 'http://3.34.252.182:8080/marker/mylikelist',
          headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
          withCredentials: true
        }).then((res) => {

          if (res.data.success === false) {
            console.log('get liked markers failed.')
          }
          else {
            this.likedmarkers = res.data.response
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
    },
    logout: function() {
      this.$emit("logout")
    }
  } 
}
</script>
<style>
#liked-markers-container {
  padding: 20px;
}
</style>