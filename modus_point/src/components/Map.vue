<template>
  <div id="map" @contextmenu="initMarkerButtonListener">
    <loading :active="isLoading" :can-cancel="true" :color="loading_color" :is-full-page="fullscreen"/>
    <div id="dot-menu-background" v-if="SHOW_SAVE_MAKER" @click="SHOW_SAVE_MAKER = !SHOW_SAVE_MAKER"/>
    <transition name="menu">
      <div class="dot-menu-foreground" v-if="SHOW_SAVE_MAKER">
        <save-maker :latitude="centerLat" :longitude="centerLng" @saveEvent="saveEvent"></save-maker>
      </div>
    </transition>
    <transition name="menu">
      <div class="dot-menu-foreground" v-if="DOT_FILTER">
        <dot-filter :markers="markers" @disableMarkers="disableMarkers" @selectedEvent="selectedEvent" @menuCloseEvent="enableMarkers(menuCloseEvent)"></dot-filter>
      </div>
    </transition>
    <transition name="menu">
      <div class="dot-menu-foreground" v-if="DOT_SEARCH">
        <dot-search @selectedEvent="selectedEvent" @menuCloseEvent="menuCloseEvent"></dot-search>
      </div>
    </transition>
    <transition name="menu">
      <div class="dot-menu-foreground" v-if="DOT_LIKED">
        <dot-liked :likedMarkers="likedMarkers" @selectedEvent="selectedEvent" @menuCloseEvent="menuCloseEvent"></dot-liked>
      </div>
    </transition>
    <transition name="menu">
      <div class="dot-menu-foreground" v-if="DOT_MY">
        <dot-my :myMarkers="myMarkers" @selectedEvent="selectedEvent" @menuCloseEvent="menuCloseEvent"></dot-my>
      </div>
    </transition>
    <transition name="menu">
      <div class="dot-menu-foreground" v-if="SHOW_THIS_MARKER">
        <marker-overlay :selected="selected" :likedMarkers="likedMarkers" :myMarkers="myMarkers" @showLoginForm="showLoginForm" @menuCloseEvent="menuCloseEvent"></marker-overlay>
      </div>
    </transition>
    <div id="dot-menu" class="dots" @click="DOTMENU = !DOTMENU">
      <img :src=SidebarButtonSrc alt="dot">
    </div>
    <transition name="dot-search">
      <div id="dot-search" class="dots" v-if="DOTMENU" @click="DOT_SEARCH = !DOT_SEARCH; DOT_FILTER = false; DOT_LIKED = false; DOT_MY = false; DOTMENU = false">
        <img :src=SearchButtonSrc alt="dotsearch">
      </div>
    </transition>
    <transition name="dot-filter">
      <div id="dot-filter" class="dots" v-if="DOTMENU" @click="DOT_FILTER = !DOT_FILTER; DOT_SEARCH = false; DOT_LIKED = false; DOT_MY = false; DOTMENU = false">
        <img :src=FilterButtonOnSrc alt="dotfilter">
      </div>
    </transition>
    <transition name="dot-like">
      <div id="dot-like" class="dots" v-if="DOTMENU" @click="DOT_LIKED = !DOT_LIKED; DOT_SEARCH = false; DOT_FILTER = false; DOT_MY = false; DOTMENU = false">
        <img :src=LikeButtonOnSrc alt="dotlike">
      </div>
    </transition>
    <transition name="dot-my">
      <div id="dot-my" class="dots" v-if="DOTMENU" @click="DOT_MY = !DOT_MY; DOT_SEARCH = false; DOT_FILTER = false; DOT_LIKED = false; DOTMENU = false">
        <img :src=MyMkButtonSrc alt="dotmarker">
      </div>
    </transition>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import axios from 'axios';

import SaveMaker from './SaveMaker.vue'
import DotFilter from './Filter.vue'
import DotSearch from './Search.vue'
import DotLiked from './LikedMarker.vue'
import DotMy from './MyMarker.vue'
import MarkerOverlay from './MarkerOverlay.vue'

export default {

  name: 'Map',
  mounted() {
    if (window.kakao && window.kakao.maps) {
      try {
        this.initKakaoMap();
      } catch(e) {
        console.log("Fail to load Kakao map." + e)
      } finally {
        setTimeout(() => {
          this.getAllMarkers(() => {
            this.isLoading = false
          })
          if ( this.LOGIN === true ){
            this.getLikedMarkers()
            this.getMyMarkers()
          }
        }, 8000)
      }
    }
    else {
      try {
        const script = document.createElement('script');
        script.onload = () => kakao.maps.load(this.initKakaoMap());
        script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=12658ca88c9c540ede74d413df66f251&libraries=services'
        document.body.appendChild(script);
      } catch(e) {
        console.log("Fail to load Kakao map." + e)
      } finally {
        setTimeout(() => {
          this.getAllMarkers(() => {
            this.isLoading = false
          })
        }, 8000)
      }
    }
    
  },
  data() {
    return {
      map: null,
      markers: [],
      renderedMarkers: [],
      likedMarkers: [],
      myMarkers: [],
      selected: null,
      SHOW_SAVE_MAKER: false,
      isLoading: false,
      fullscreen: false,
      loading_color: "#E2004B",

      centerLat: '',
      centerLng: '',
      SHOW_THIS_MARKER: false,

      DOTMENU: false,
      DOT_FILTER: false,
      DOT_SEARCH: false,
      DOT_LIKED: false,
      DOT_MY: false,

      FilterButtonOnSrc: require("../assets/filter_on.png"),
      LikeButtonOnSrc: require("../assets/flare_on.png"),
      SidebarButtonSrc: require("../assets/sidebar.png"),
      SearchButtonSrc: require("../assets/search.png"),
      MyMkButtonSrc: require("../assets/user_on.png")
    }
  },
  props: ['LOGIN'],
  components: {
    Loading,
    SaveMaker,
    DotFilter,
    DotSearch,
    DotLiked,
    DotMy,
    MarkerOverlay
  },
  methods: {
    // 카카오 맵 초기화 메서드
    initKakaoMap: function() {
      this.isLoading = true
      const mapContainer = document.querySelector("#map");
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude
        this.lng = position.coords.longitude
        this.map = init(this.lat,this.lng,mapContainer)
      },() => {
        console.log("현재 위치를 파악할 수 없습니다.")
        //강남역
        this.lat = 37.49780947181307
        this.lng = 127.02766764268932
        this.map = init(this.lat,this.lng,mapContainer)
      })
  
      function init(lat,lng,mapContainer) {
        const options = {
          center: new kakao.maps.LatLng(lat,lng),
          level: 3
        };
        const map = new kakao.maps.Map(mapContainer, options);
        // 지도 생성
        map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);

        // 지도 타입 변경 컨트롤을 생성한다
        const mapTypeControl = new kakao.maps.MapTypeControl();

        // 지도의 상단 우측에 지도 타입 변경 컨트롤을 추가한다
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 지도 클릭 이벤트를 등록한다 (좌클릭 : click, 우클릭 : rightclick, 더블클릭 : dblclick)
        // 맵 위 어디든지 좌클릭 시 이미 있는 마커메이커를 없앤다.
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
          const maker = document.querySelector('#marker-maker')
          if (maker !== null)
            maker.remove()
        });

        // 지도 우클릭 이벤트를 등록한다
        // 맵 위 어디든지 우클릭 시 마커메이커 오버레이 창을 띄운다. 이미 마커메이커가 띄워져있는 경우, 기존 메이커를 지우고 만든다.
        kakao.maps.event.addListener(map, 'rightclick', function(mouseEvent) {
          let beforeMaker = document.querySelector('#marker-maker')
          map.panTo(new kakao.maps.LatLng(mouseEvent.latLng.Ma, mouseEvent.latLng.La))
          if (beforeMaker === null) {
            const markermaker = new kakao.maps.CustomOverlay({
              map: map,
              clickable: true, //커스텀 오버레이 클릭시 지도에 이벤트 전파 방지
              content: '<div id="marker-maker"><button class="marker-button">여기에 마커 만들기</button></div>',
              position: new kakao.maps.LatLng(mouseEvent.latLng.Ma,mouseEvent.latLng.La),
              xAnchor: 0,
              yAnchor: 0
            })
          }
          else {
            beforeMaker.remove()
            beforeMaker = new kakao.maps.CustomOverlay({
              map: map,
              clickable: true, //커스텀 오버레이 클릭시 지도에 이벤트 전파 방지
              content: '<div id="marker-maker"><button class="marker-button">여기에 마커 만들기</button></div>',
              position: new kakao.maps.LatLng(mouseEvent.latLng.Ma,mouseEvent.latLng.La),
              xAnchor: 0,
              yAnchor: 0
            })
          }
        })
        // 센터 기준으로 어디까지 마커 검색해서 불러올지 로직 작성
        return map;
      }
    },
    initMarkerButtonListener: function() {
      const button = document.querySelector('.marker-button')
      const maker = document.querySelector('#marker-maker')
      const center = this.map.getCenter()
      this.centerLat = center.Ma
      this.centerLng = center.La
      setTimeout(() => {
        button.addEventListener("click",() => {
          maker.remove()
          if (this.LOGIN === false) {
            this.showLoginForm()
          }
          else {
            this.DOT_FILTER = false
            this.DOT_SEARCH = false
            this.DOT_LIKED = false
            this.DOT_MY = false
            this.SHOW_SAVE_MAKER = true
            
            this.map.setLevel(1,{ animate: true })
          }
        })
      },100)
    },
    //모든 마커들을 서버또는 localStorage에서 가져온다.
    getAllMarkers: async function(callback) {

      try {
        //axios로 모든 마커 가져오기
        await axios({
          method: 'GET',
          url: 'http://3.34.252.182:8080/marker/all',
          withCredentials: true
        }).then((res) => {
          console.log(res.data.response)

          if (res.data.success === false) {
            console.log('marker loading failed by server issue.')
          }
          else {
            this.markers = res.data.response
          }

        })
      } catch (error) {
        console.log('marker loading failed.' + error)
      } finally {
        if (this.markers !== []) {
          for (let mk of this.markers){
                this.renderMarker(mk)
          }
        }
        callback()
      }
    },
    getLikedMarkers: async function() {
      try {
        await axios({
          method: 'GET',
          url: 'http://3.34.252.182:8080/marker/mylikelist',
          headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
          withCredentials: true
        }).then((res) => {
          console.log(res.data.response)

          if (res.data.success === false) {

            console.log('get liked markers failed.')
          }
          else {
            //TODO - likedmarkers에 저장 List를 받아왔을 때 데이터 형식 확인.
            //this.likedmarkers = res.data.response
          }
        })
      } catch (error) {
        console.warn("unexpected error occured" + error)
      }
    },
    getMyMarkers: async function() {
      for(let mk of this.markers) {
        if (mk.fisherId === sessionStorage.getItem("id"))
          this.myMarkers.push(mk)
      }
    },
    renderMarker: function(mk,callback) {
      const Lat = mk.latitude
      const Lng = mk.longitude
      const markerImageUrl = (category) => {
        if (category === "fishing")
          return require("../assets/fishing_marker.png")
        else if (category === "camping")
          return require("../assets/camping_marker.png")
        else if (category === "gathering")
          return require("../assets/gathering_marker.png")
        else if (category === "store")
          return require("../assets/store_marker.png")
        else if (category === "secret_place")
          return require("../assets/secret_place_marker.png")
        else
          console.log('category error.')
      } 
      if (mk.isPrivate === false) {
        // 지도에 마커를 생성하고 표시한다
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(Lat,Lng), // 마커의 좌표
          image : new kakao.maps.MarkerImage(markerImageUrl(mk.category.toLowerCase()), new kakao.maps.Size(36, 36), { offset : new kakao.maps.Point(18, 36) }), // 마커의 이미지
          map: this.map, // 마커를 표시할 지도 객체
          title: mk.markerId
        });

        kakao.maps.event.addListener(marker,'click',() => {
          this.map.panTo(new kakao.maps.LatLng(Lat,Lng))
          this.selected = findSelected(this.markers,Lat,Lng)
          this.SHOW_THIS_MARKER = true
        })

        kakao.maps.event.addListener(marker,'mouseover',() => {
          marker.image = new kakao.maps.MarkerImage(markerImageUrl(mk.category.toLowerCase()), new kakao.maps.Size(50, 50), { offset : new kakao.maps.Point(25, 50) })
        })

        kakao.maps.event.addListener(marker,'mouseout',() => {
          marker.image = new kakao.maps.MarkerImage(markerImageUrl(mk.category.toLowerCase()), new kakao.maps.Size(36, 36), { offset : new kakao.maps.Point(18, 36) })
        })
    
        this.renderedMarkers.push(marker)
      }
      else {
        //isPrivate가 true일 경우 제작자가 지금 로그인한 사람과 같은지 확인 후 렌더한다.
        const id = sessionStorage.getItem('id')
        if (id === mk.fisherId ){
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(Lat,Lng), // 마커의 좌표
            image : new kakao.maps.MarkerImage(markerImageUrl(mk.category.toLowerCase()), new kakao.maps.Size(36, 36), { offset : new kakao.maps.Point(18, 36) }), // 마커의 이미지
            map: this.map, // 마커를 표시할 지도 객체
            title: mk.markerId
          });

          kakao.maps.event.addListener(marker,'click',() => {
            this.map.panTo(new kakao.maps.LatLng(Lat,Lng))
            this.selected = findSelected(this.markers,Lat,Lng)
            this.SHOW_THIS_MARKER = true
          })

          kakao.maps.event.addListener(marker,'mouseover',() => {
            marker.image = new kakao.maps.MarkerImage(markerImageUrl(mk.category.toLowerCase()), new kakao.maps.Size(50, 50), { offset : new kakao.maps.Point(25, 50) })
          })

          kakao.maps.event.addListener(marker,'mouseout',() => {
            marker.image = new kakao.maps.MarkerImage(markerImageUrl(mk.category.toLowerCase()), new kakao.maps.Size(36, 36), { offset : new kakao.maps.Point(18, 36) })
          })

          this.renderedMarkers.push(marker)
        }
      }
      function findSelected (markers,Lat,Lng) {
        for (let mk of markers) {
          if (mk.latitude === Lat && mk.longitude === Lng)
            return mk
        }
      }
      callback()
    },
    saveEvent: function(savedMarker) {
      this.SHOW_SAVE_MAKER = false
      this.renderMarker(savedMarker)

      //새로 생성된 마커를 배열에 추가
      this.markers.push(savedMarker)
      this.map.setLevel(3,{ animate: true })
    },
    selectedEvent: function(Lat,Lng) {
      this.map.panTo(new kakao.maps.LatLng(Lat,Lng))
    },
    menuCloseEvent: function() {
      this.DOT_FILTER = false
      this.DOT_SEARCH = false
      this.DOT_LIKED = false
      this.DOT_MY = false
      this.SHOW_THIS_MARKER = false
    },
    disableMarkers: function(markers) {
      this.renderedMarkers.forEach((element) => {
        if (markers.indexOf(parseInt(element.getTitle())) !== -1)
          element.setVisible(false)
        else 
          element.setVisible(true)
      })
    },
    enableMarkers: function(callback) {
      this.renderedMarkers.forEach((element) => {
        if (element.getVisible() === false)
          element.setVisible(true)
      })
      callback()
    },
    showLoginForm: function() {
      this.$emit("showLoginForm")
    },
    reRender: function() {
      this.isLoading = true
      this.renderedMarkers.forEach((element) => {
        element.remove()
      })
      this.renderMarker(this.markers,() => {
        this.isLoading = false
      })
    }
  }
}
</script>

<style>

#map {
  width: 100%;
  height: 100%;
  z-index: 2;
}

#marker-maker {
  padding: 2px 5px 5px 5px;
  width: 150px;
  height: 25px;
  background-color: white;
  border-radius: 0 20px 20px 20px;
  border: 2px solid rgb(150,150,150);
  z-index: 3;
  -webkit-animation: make-in 0.2s ease-out;
  animation: make-in 0.2s ease-out;
}

#maker-button-list {
  width: 100%;
  height: fit-content;
}

#dot-menu-background {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3;
}

#menu-contents {
  padding: 0 20px;
}
#menu-contents div {
  margin: 10px 0;
}

.dot-menu-foreground {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  min-width: 320px;
  width: 28%; 
  height: 100%;
  border-radius: 0 20px 20px 0;
  background-color: white;
  box-shadow: 2rem 0 2rem 5px rgba(100, 100, 100, 0.8);
  text-align: center;
  justify-content: center;
  z-index: 4;
  overflow: hidden;
}

.marker-button {
  width: 100%;
  height: 25px;
  border-radius: 20px;
  color: white;
  background-color: rgb(237, 40, 40);
  border: 2px solid rgb(237, 40, 40);
  overflow: hidden;
}

.marker-button:hover {
  background-color: rgb(255,255,255);
  color: black;
}

.make-marker-enter-active {
  -webkit-animation: make-in 0.2s ease-out;
  animation: make-in 0.2s ease-out;
}

.menu-enter-active {
  -webkit-animation: menu-in 0.4s ease-out;
  animation: menu-in 0.4s ease-out;
}
.menu-leave-active {
  -webkit-animation: menu-out 0.4s ease-in;
  animation: menu-out 0.4s ease-in;
}

@-webkit-keyframes menu-in {
  0% {
    -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
  }
  95% {
    -webkit-transform: translateX(3%);
            transform: translateX(3%);
  }
  100% {
    -webkit-transform: translateX(0%);
            transform: translateX(0%);
  }
}
@keyframes menu-in {
  0% {
    -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
  }
  95% {
    -webkit-transform: translateX(3%);
            transform: translateX(3%);
  }
  100% {
    -webkit-transform: translateX(0%);
            transform: translateX(0%);
  }
}
@-webkit-keyframes menu-out {
  0% {
    -webkit-transform: translateX(0%);
            transform: translateX(0%);
  }
  5% {
    -webkit-transform: translateX(3%);
            transform: translateX(3%);
  }
  100% {
    -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
  }
}
@keyframes menu-out {
  0% {
    -webkit-transform: translateX(0%);
            transform: translateX(0%);
  }
  5% {
    -webkit-transform: translateX(3%);
            transform: translateX(3%);
  }
  100% {
    -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
  }
}
</style>