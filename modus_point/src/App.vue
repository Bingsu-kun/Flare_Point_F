<template>
  <div class="container">
    <div id="menu_bar">
      <a id="menu_logo" href="/">
        <img alt="main_logo" title="플레어포인트" src="./assets/logo.png">
      </a>
      <ul id="menu_list">
        <li id="marker_filter"></li>
        <li id="my_markers"></li>
      </ul>
      <div id="profile">
        <img alt="fisher" title="프로필" src="./assets/user.png">
      </div>
    </div>
    <div class="map_marker_wrapper">
      <!--
      <div id="map">
      </div>
      -->
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
      

    }
  }
}
</script>

<style>

html {
  font-size: 10px;
}

body {
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#menu_bar {
  padding: 25px 0px;
  width: 8rem;
  background-color: rgb(44, 44, 44);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 5;
  text-align: center;
}

#menu_bar img {
  width: 80%;
}

#menu_logo {
  height: fit-content;
}

#profile {
  position: absolute;
  left: 0px;
  bottom: 25px;
}

#map_marker_wrapper {
  display: flex;
  width: 100%;
  height: fit-content;
}

#map {
  margin: 2rem 2rem;
  text-align: center;
  width: 70%;
  height: 60rem;
  float: left;
}

.container {
  height: 200rem;
  font-size: 2rem;
}

</style>
