<template>
  <div id="menu-container">
    <loading :active="isLoading" :can-cancel="true" :color="loading_color" :is-full-page="fullscreen"/>
    <button class="close" @click="menuCloseEvent"></button>
    <div id="menu-title">테마별마커</div>
    <div id="search-form" style="margin-bottom: 5px;">
      <input class="search-input" :value="keyword" placeholder="원하는 마커를 검색" @input="keyword = $event.target.value" @keydown.enter="filtering">
      <button class="search-button" @click="filtering"></button>
    </div>
    <div id="trending-tags">
      <span>인기: </span>
      <span class="t-tag" @click="tagSelected(tag)" v-for="tag in trendingTags" :key="tag">{{ tag }}</span>
    </div>
    <div id="search-result" v-if="!noResult">
      <div @click="selectedEvent(result.latitude,result.longitude)" id="frag" class="filter-result-fragment" v-for="result in filteredMarkers" :key="result.markerId">
        <div id="frag-left">
          <div id="marker-name">{{ result.name }}</div>
          <div id="marker-address">{{ result.place_addr }}</div>
          <div id="marker-tags">{{ result.tags }}</div>
        </div>
        <div id="frag-right">
          <div class="frag-link">
            <img alt="star" :src="isLiked(result.markerId)">
            {{ getLikes(result.markerId) }}
          </div>
          <div class="frag-link" @click="kakaoUrl(result.latitude,result.longitude)">
            <img alt="kakaomap" src="../assets/kakaomap.png">
            길찾기
          </div>
          <div class="frag-link">
            <img alt="share" src="../assets/share.png">
            공유하기
          </div>
        </div>
        <div id="divider"/>
      </div>
    </div>
    <div id="no-search-result" v-if="noResult"/>
  </div>
</template>

<script>
import axios from 'axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

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
      likes: [],
      likedMarkerIds: [],
      throwMarkers: [],

      starOn: require("../assets/star_on.png"),
      starOff: require("../assets/star_off.png")
    }
  },
  props: ['markers','allMarkersLikes'],
  components: {
    Loading
  },
  computed: {
    kakaoUrl: function(latitude, longitude) {
      return `https://map.kakao.com/link/to/선택한마커,${latitude},${longitude}`
    }
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
    getMyMarkers: async function() {
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
            res.data.response.forEach((element) => {
              this.likedMarkerIds.push(element.markerId)
            })
          }
        })
      } catch (error) {
        console.log('To see am I liked, need login first.')
      }
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

#frag-left {
  text-align: left;
  display: flex;
  align-content: flex-start;
}

#frag-right {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}

#marker-name {
  font-family: Pretendard-Bold;
  font-size: 16px;
  overflow: hidden;
}

#marker-address {
  font-size: 13px;
  overflow: hidden;
}

#marker-tags {
  font-size: 11px;
  overflow: hidden;
}

.frag-link {
  display: inline-flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  font-size: 11px;
}

.frag-link img {
  margin-right: 5px;
  width: 10px;
  height: 10px;
}

.frag-link:hover {
  cursor: pointer;
}

.filter-result-fragment {
  padding: 10px 20px 0 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  width: inherit;
  height: fit-content;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
}
.filter-result-fragment:hover {
  background-color: rgba(223, 160, 157, 0.2);
}
</style>