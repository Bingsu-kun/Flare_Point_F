<template>
  <div class="container">
    <div id="menu_bar">
      <a id="menu_logo" href="/">
        <img alt="main_logo" title="플레어포인트" src="./assets/logo.png">
      </a>
      <div id="menu_list">
        <div id="marker_filter" @mouseover="FBON = true" @mouseout="FBON = False">
          <img :src="FilterButtonSrc" v-if="!FBON">
          <img :src="FilterButtonOnSrc" v-if="FBON">
        </div>
        <div id="my_markers" @mouseover="MBON = true" @mouseout="MBON = False">
          <img :src="MarkerButtonSrc" v-if="!MBON">
          <img :src="MarkerButtonOnSrc" v-if="MBON">
        </div>
      </div>
      <div id="profile" v-if="!LOGIN" @mouseover="PBON = true" @mouseout="PBON = false" @click="SHOW_LOGIN_FORM = true">
        <img :src="ProfileButtonOnSrc" v-if="PBON">
        <img :src="ProfileButtonSrc" v-if="!PBON">
      </div>
      <div id="profile" v-if="LOGIN">
        <img :src="ProfileButtonOnSrc">
      </div>
    </div>
    <div id="map_marker_wrapper">
      <div id="map">
      </div>
      <div id="footer">
        <span>Copyright © 2021 Hephai All rights reserved.</span>
        <span>Created By Hephai.</span>
        <span>Character Design By </span>
        <span>Contact - </span>
      </div>
    </div>

    <div id="login-background" v-if="SHOW_LOGIN_FORM" @click="SHOW_LOGIN_FORM = false">
    </div>
    <div id="login-foreground" v-if="SHOW_LOGIN_FORM">
      <login-and-signup></login-and-signup>
    </div>
  </div>

</template>

<script>
import LoginAndSignup from './components/LoginAndSignup.vue'


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
      LOGIN: false,
      SHOW_LOGIN_FORM: false,

      PBON: false,
      ProfileButtonSrc: require("./assets/user.png"),
      ProfileButtonOnSrc: require("./assets/user_on.png"),

      FBON: false,
      FilterButtonSrc: require("./assets/filter.png"),
      FilterButtonOnSrc: require("./assets/filter_on.png"),

      MBON: false,
      MarkerButtonSrc: require("./assets/flare.png"),
      MarkerButtonOnSrc: require("./assets/flare_on.png")
    }
  },
  components: {
    LoginAndSignup
  },
  methods: {

    // 카카오 맵 초기화 메서드
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

#menu_list {
  margin: 2rem 0px;
  width: 100%;
  height: fit-content;
  position: relative;
  left: 0;
  z-index: 6;
}

#menu_list div {
  margin: 1rem 0px;
}

#profile {
  background-color: rgb(44, 44, 44);
  border-radius: 1rem;
  position: absolute;
  left: 0px;
  bottom: 25px;
}

#map_marker_wrapper {
  position: fixed;
  left: 8rem;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

#map {
  width: 100%;
  height: 95%;
}

#footer {
  padding: 3px;
  width: 100%;
  height: 5%;
  background-color: rgb(44, 44, 44);
  font-size: 1.5rem;
  color: rgb(136, 136, 136);
}

#footer span {
  margin: 0 2rem;
}

#login-background {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 6;
}

#login-foreground {
  
  position: fixed;
  top: 120px;
  left: 38%;
  width: 350px;
  height: 400px;
  border-radius: 20px;
  background-color: white;
  text-align: center;
  z-index: 7;
}

#login_input {
  margin: 30px 0;
}

#login_input input {
  width: 80%;
  height: 40px;
  font-size: 20px;
}

#login_form_buttons {
  margin: 30px 0 0 0;
}

.container {
  width: 100%;
  height: 100%;
  font-size: 2rem;
}

</style>
