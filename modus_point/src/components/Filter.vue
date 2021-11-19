<template>
  <div id="menu-container">
    <loading :active="isLoading" :can-cancel="true" :color="loading_color" :is-full-page="fullscreen"/>
    <button class="close" @click="menuCloseEvent"></button>
    <div id="menu-title">테마별 마커</div>
    <div id="search-form" style="margin-bottom: 5px;">
      <input class="search-input" :value="keyword" placeholder="원하는 마커를 검색" @input="keyword = $event.target.value" @keydown.enter="filtering">
      <button class="search-button" @click="filtering"></button>
    </div>
    <div id="trending-tags">
      <span>인기: </span>
      <span class="t-tag" @click="tagSelected(tag)" v-for="tag in trendingTags" :key="tag">{{ tag }}</span>
    </div>
    <div id="search-result" v-if="!noResult">
      <fragment @click="selectedEvent(result.latitude,result.longitude)" v-for="result in filteredMarkers" 
      :key="result.markerId" :name="result.name" :address="result.address" :tags="result.tags"
      :starSrc="isLiked(result.markerId)" :likes="getLikes(result.markerId)" :latitude="result.latitude" :longitude="result.longitude">
      </fragment>
    </div>
    <div id="no-search-result" v-if="noResult">
      <img alt="no result" src="../assets/no_markers.png">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Fragment from './MarkerFragment.vue'

export default {
  mounted() {
    this.isLoading = true
    this.getTrendingTags()
  },
  data() {
    return {
      keyword: '',
      noResult: false,

      isLoading: false,
      fullscreen: false,
      loading_color: "#E2004B",

      trendingTags: [],
      filteredMarkers: [],
      likedMarkerIds: [],
      throwMarkers: [],

      starOn: require("../assets/star_on.png"),
      starOff: require("../assets/star_off.png")
    }
  },
  props: ['markers','allMarkersLikes'],
  components: {
    Loading,
    Fragment
  },
  watch: {
    keyword: function() {
      document.querySelectorAll('.t-tag').forEach((element) => {
        if (this.keyword.includes(element.innerText)) {
          element.style.backgroundColor = '#F3776B'
        }
      })
    }
  },
  methods: {
    getTrendingTags: async function() {
      // 상위 몇 위 까지 가져올까요
      const TOP = 4

      try {
        await axios({
          method: 'POST',
          url: 'http://3.34.252.182:8080/tag/top',
          data: { count: TOP }
        }).then((res) => {
          if (res.data.success === false) {
            console.log('get trending tag is failed.')
          }
          else {
            for (let i = 0; i < TOP; i++) {
              this.trendingTags.push(res.data.response[i].tag)
            }
          }
          this.isLoading = false
        })
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    },
    tagSelected: function(tag) {
      if (this.keyword.includes(tag)){
        this.keyword = this.keyword.replace(tag,"").trim()
        this.filtering()
      }
      else {
        this.keyword = this.keyword + " " + tag
        this.filtering()
      }
    },
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
    getLikedMarkerIds: function() {
      JSON.parse(sessionStorage.getItem("liked")).array.forEach((element) => {
        this.likedMarkerIds.push(element.markerId)
      })
    },
    filtering: function() {
      const keywords = this.keyword.split(' ')
      this.filteredMarkers = []
      this.throwMarkers = []

      this.markers.forEach(element => {
        if (this.keyword === '') {
          this.filteredMarkers.push(element)
        }
        else {
          this.filteredMarkers.push(element)
          for (let key of keywords) {
            if (element.name.indexOf(key) === -1 && element.tags.indexOf(key) === -1){
              this.throwMarkers.push(element)
              this.filteredMarkers.pop()
            }
          }
        }
      });
      if (this.filteredMarkers.length === 0)
        this.noResult = true
      else
        this.noResult = false
      this.disabling()
    },
    disabling: function() {
      this.$emit('disableMarkers',this.throwMarkers)
    },
    selectedEvent: function(Lat,Lng) {
      this.$emit('selectedEvent',Lat,Lng)
    },
    menuCloseEvent: function() {
      this.$emit("menuCloseEvent")
    }
  }
}
</script>
<style>

#trending-tags {
  margin: 20px;
  margin-top: 5px;
  width: -webkit-fill-available;
  height: 40px;
  display: flex;
  justify-content: space-around;
  align-content: space-around;
  align-items: center;
  font-size: 13px;
  font-family: Pretendard-Bold;
}

.t-tag {
  width: 40px;
  height: 20px;
  border: 0;
  border-radius: 10px;
  background-color: white;
  box-shadow: 1px 1px 5px 1px #cacaca;
}

.t-tag:hover {
  cursor: pointer;
  background-color: rgba(223, 160, 157, 0.2);
}

</style>