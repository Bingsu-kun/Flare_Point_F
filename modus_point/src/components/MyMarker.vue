<template>
  <div id="liked-markers-container">
    <div v-if="LOGIN" style="margin-top: 20px; padding: 0 10px; display:flex; justify-content: space-around;" >
      <button class="my-marker-nav">
        <img alt="liked" @click="isLikedMenu = true" :src="starOn">
      </button>
      <button class="my-marker-nav">
        <img alt="hammer" @click="isLikedMenu = false" :src="hammer">
      </button>
    </div>
    <button class="close" @click="menuCloseEvent"></button>
    <div v-if="LOGIN" style="z-index: 2">
      <div id="search-result" v-if="isLikedMenu && !LikedNoResult">
        <div id="menu-title">좋아요 한 마커</div>
        <fragment @click="selectedEvent(result.latitude,result.longitude)" v-for="result in likedMarkers" 
        :key="result.markerId" :name="result.name" :address="result.address" :tags="result.tags"
        :starSrc="starOn" :likes="getLikes(result.markerId)" :latitude="result.latitude" :longitude="result.longitude">
        </fragment>
      </div>
      <div id="no-search-result" v-if="isLikedMenu && LikedNoResult">
        <img alt="no result" src="../assets/no_markers.png">
      </div>
      <div id="search-result" v-if="!isLikedMenu && !MyNoResult">
        <div id="menu-title">내가 만든 마커</div>
        <fragment @click="selectedEvent(result.latitude,result.longitude)" v-for="result in myMarkers" 
        :key="result.markerId" :name="result.name" :address="result.address" :tags="result.tags"
        :starSrc="isLiked(result.markerId)" :likes="getLikes(result.markerId)" :latitude="result.latitude" :longitude="result.longitude">
        </fragment>
      </div>
      <div id="no-search-result" v-if="!isLikedMenu && MyNoResult">
        <img alt="no result" src="../assets/no_markers.png">
      </div>
    </div>
    <div id="no-search-result" v-if="!LOGIN">
      <div id="menu-title">
        로그인이<br>필요합니다
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      likedMarkers: JSON.parse(sessionStorage.getItem('liked')),
      myMarkers: JSON.parse(sessionStorage.getItem('my')),
      isLikedMenu: true,

      starOn: require("../assets/star_on.png"),
      starOff: require("../assets/star_off.png"),
      hammer: require("../assets/hammer.png")
    }
  },
  computed: {
    LikedNoResult: function() {
      return this.likedMarkers === [] || !this.likedMarkers ? true : false
    },
    MyNoResult: function() {
      return this.myMarkers === [] || !this.myMarkers ? true : false
    }
  },
  props: ['LOGIN','allMarkersLikes'],
  methods: {
    getLikes: function(markerId) {
      this.allMarkersLikes.forEach((element) => {
        if (element.markerId === markerId)
          return element.like
      })
    },
    isLiked: function(markerId) {
      if (this.likedMarkerIds.includes(markerId))
        return this.starOn
      else 
        return this.starOff
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
#liked-markers-container {
  padding: 20px;
}

.my-marker-nav {
  width: 120px;
  height: 30px;
  border: 0;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -5px 5px 1px #cacaca;
  background-color: white;
  transition-duration: 0.3s;
}
.my-marker-nav img {
  height: 20px;
}
.my-marker-nav:hover {
  cursor: pointer;
  box-shadow: 0;
}
</style>