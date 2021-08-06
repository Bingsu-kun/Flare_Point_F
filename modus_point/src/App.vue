<template>
  <div class="container">
    <div id="main_logo">
      <img alt="main_logo" title="모두의포인트" src="./assets/logo.png">
    </div>
    <header>
      <div id="menu_bar">
        <div id="fisher_profile">
          여기에 프로필
        </div>
        <div id="filters">
          여기에 필터들
        </div>
        <div id="search_bar">
          <span>
            <img id="search_button" src="" alt="search" title="검색버튼">
            <input type="text" placeholder="검색어를 입력해주세요" />
          </span>
        </div>
      </div>
    </header>
    <div class="map_marker_wrapper">
      <div id="map">
      </div>
      <div id="marker_spec">
      </div>
    </div>
    <div class="footer">
    </div>
  </div>

</template>

<script>

export default {
  name: 'App',
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initKakaoMap();
    }
    else {
      const script = document.createElement('script');
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initKakaoMap);
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=407b973edfee2735f163d9c7a5c03218'
      document.body.appendChild(script);
    }
  },
  data() {
    return {
      
    }
  },
  components: {
    
  },
  methods: {

    initKakaoMap: function() {

      const mapContainer = document.querySelector("#map");
      let x,y;

      //지도가 처음 표시될 때 좌표. TODO - 후에 geometry이용해서 x,y 값 사용자의 현재 위치로 받아들이기.
      x = 33.450701;
      y = 126.570667;

      const options = {
        center: new kakao.maps.LatLng(x,y),
        level: 3
      };

      const map = new kakao.maps.Map(mapContainer, options);
      map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
      
      //마커 테스트
      // const markerPosition = new kakao.maps.LatLng(35.19656853772262, 129.0807270648317);

      // const marker = new kakao.maps.Marker({
      //   position: markerPosition
      // });
      // marker.setMap(map)

    }
  }
}
</script>

<style>

html {
  font-size: 10px;
}

template {
  margin: 0px;
}

header {
  width: 100%;
  height: 7.5rem;
  position: sticky;
  top: 0;
  z-index: 4;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#main_logo {
  height: fit-content;
  padding: 0px 5rem;
  margin: 6rem 0px;
}

#menu_bar {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  padding: 0px 3rem;
  background-color: rgba(255,255,255,0.8);
  
}

#search_bar {
  display: inline;
  padding: 0px 1rem;
}

#map_marker_wrapper {
  margin: 5rem;
  width: 100%;
  height: fit-content;
}

#map {
  text-align: center;
  width: 80%;
  height: 60rem;
}

.container {
  height: 200rem;
  font-size: 2rem;

}

.container img {
  max-width: 100%;
  height: 30%;
}

</style>
