<template>
  <div id="map" @contextmenu="initMarkerButtonListener">
    <loading :active="isLoading" :can-cancel="true" :color="loading_color" :is-full-page="fullscreen"/>
    <div id="dot-menu-background" v-if="SHOW_SAVE_MAKER" @click="SHOW_SAVE_MAKER = !SHOW_SAVE_MAKER"/>
    <transition name="menu">
      <div class="dot-menu-foreground" v-if="SHOW_SAVE_MAKER">
        <save-maker v-on:saveEvent="closeMakeWindow"></save-maker>
      </div>
    </transition>
    <transition name="menu">
      <div class="dot-menu-foreground" v-if="DOT_FILTER">
        <dot-filter v-on:filterCloseEvent="filterCloseEvent"></dot-filter>
      </div>
    </transition>
    <transition name="menu">
      <div class="dot-menu-foreground" v-if="DOT_SEARCH">
        <dot-search v-on:searchCloseEvent="searchCloseEvent"></dot-search>
      </div>
    </transition>
    <transition name="menu">
      <div class="dot-menu-foreground" v-if="DOT_LIKED">
        <dot-liked v-on:likedCloseEvent="likedCloseEvent"></dot-liked>
      </div>
    </transition>
    <div id="dot-menu" class="dots" @click="DOTMENU = !DOTMENU">
      <img :src=SidebarButtonSrc alt="dot">
    </div>
    <transition name="dot-search">
      <div id="dot-search" class="dots" v-if="DOTMENU" @click="DOT_SEARCH = !DOT_SEARCH">
        <img :src=SearchButtonSrc alt="dotsearch">
      </div>
    </transition>
    <transition name="dot-filter">
      <div id="dot-filter" class="dots" v-if="DOTMENU" @click="DOT_FILTER = !DOT_FILTER">
        <img :src=FilterButtonOnSrc alt="dotfilter">
      </div>
    </transition>
    <transition name="dot-like">
      <div id="dot-like" class="dots" v-if="DOTMENU" @click="DOT_LIKED = !DOT_LIKED">
        <img :src=LikeButtonOnSrc alt="dotmarker">
      </div>
    </transition>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import SaveMaker from './SaveMaker.vue'
import DotFilter from './Filter.vue'
import DotSearch from './Search.vue'
import DotLiked from './LikedMarker.vue'

export default {

  name: 'Map',
  mounted() {
    if (window.kakao && window.kakao.maps) {
      try {
        this.initKakaoMap();
      } catch(e) {
        console.log("Fail to load Kakao map. Check traffic limit." + e)
      }
    }
    else {
      try {
        const script = document.createElement('script');
        script.onload = () => kakao.maps.load(this.initKakaoMap);
        script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=407b973edfee2735f163d9c7a5c03218'
        document.body.appendChild(script);
      } catch(e) {
        console.log("Fail to load Kakao map. Check traffic limit." + e)
      }
    }
  },
  data() {
    return {
      SHOW_SAVE_MAKER: false,
      isLoading: false,
      fullscreen: false,
      loading_color: "#E2004B",

      DOTMENU: false,
      DOT_FILTER: false,
      DOT_SEARCH: false,
      DOT_LIKED: false,

      FilterButtonOnSrc: require("../assets/filter_on.png"),
      LikeButtonOnSrc: require("../assets/flare_on.png"),
      SidebarButtonSrc: require("../assets/sidebar.png"),
      SearchButtonSrc: require("../assets/search.png")
    }
  },
  props: ['LOGIN'],
  components: {
    Loading,
    SaveMaker,
    DotFilter,
    DotSearch,
    DotLiked
  },
  methods: {
    // 카카오 맵 초기화 메서드
    initKakaoMap: function() {
      this.isLoading = true
      const mapContainer = document.querySelector("#map");
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude
        this.lng = position.coords.longitude
        init(this.lat,this.lng,mapContainer)
        this.isLoading = false
      },() => {
        console.log("현재 위치를 파악할 수 없습니다.")
        //강남역
        this.lat = 37.49780947181307
        this.lng = 127.02766764268932
        init(this.lat,this.lng,mapContainer)
        this.isLoading = false
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

        // 마커 이미지의 주소
        const markerImageUrl = 'https://t1.daumcdn.net/localimg/localimages/07/2012/img/marker_p.png', 
          markerImageSize = new kakao.maps.Size(30, 35), // 마커 이미지의 크기
          markerImageOptions = { 
              offset : new kakao.maps.Point(13, 40)// 마커 좌표에 일치시킬 이미지 안의 좌표
        };

        // 마커 이미지를 생성한다
        const markerImage = new kakao.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOptions);

        // 지도 클릭 이벤트를 등록한다 (좌클릭 : click, 우클릭 : rightclick, 더블클릭 : dblclick)
        // 맵 위 어디든지 좌클릭 시 이미 있는 마커메이커를 없앤다.
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
          const maker = document.querySelector('#marker-maker')
          maker.remove()
        });

        // // 지도에 마커를 생성하고 표시한다
        //   const marker = new kakao.maps.Marker({
        //     position: mouseEvent.latLng, // 마커의 좌표
        //     image : markerImage, // 마커의 이미지
        //     map: map // 마커를 표시할 지도 객체
        //   });

        // 지도 우클릭 이벤트를 등록한다
        // 맵 위 어디든지 우클릭 시 마커메이커 오버레이 창을 띄운다. 이미 마커메이커가 띄워져있는 경우, 기존 메이커를 지우고 만든다.
        kakao.maps.event.addListener(map, 'rightclick', function(mouseEvent) {
          let beforeMaker = document.querySelector('#marker-maker')
          if (beforeMaker === null) {
            const markermaker = new kakao.maps.CustomOverlay({
              map: map,
              clickable: true, //커스텀 오버레이 클릭시 지도에 이벤트 전파 방지
              content: '<div id="marker-maker" oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;"><button class="marker-button">여기에 마커 만들기</button></div>',
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
              content: '<div id="marker-maker" oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;"><button class="marker-button">여기에 마커 만들기</button></div>',
              position: new kakao.maps.LatLng(mouseEvent.latLng.Ma,mouseEvent.latLng.La),
              xAnchor: 0,
              yAnchor: 0
            })
          }
        })
        // 센터 기준으로 어디까지 마커 검색해서 불러올지 로직 작성
      }
    },
    initMarkerButtonListener: function() {
      setTimeout(() => {
        const button = document.querySelector('.marker-button')
        button.addEventListener("click",() => {
          const maker = document.querySelector('#marker-maker')
          maker.remove()
          if (this.LOGIN === false) {
            alert('로그인이 필요한 서비스입니다.')
            this.$emit("showLoginForm")
          }
          else {
            this.SHOW_SAVE_MAKER = true
          }
        })
      },100)
    },
    closeMakeWindow: function() {
      this.SHOW_SAVE_MAKER = false
    },
    filterCloseEvent: function() {
      this.$emit("filterCloseEvent")
    },
    searchCloseEvent: function() {
      this.$emit("searchCloseEvent")
    },
    likedCloseEvent: function() {
      this.$emit("likedCloseEvent")
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
  padding: 20px;
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