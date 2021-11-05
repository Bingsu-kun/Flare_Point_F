<template>
  <div class="container" oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;">
    <div id="menu_bar" >
      <a id="menu_logo" href="/">
        <img style="margin-top: 30px;" alt="main_logo" title="플레어포인트" src="./assets/logo.png">
      </a>
      <div id="profile" v-if="!LOGIN" @click="showLogin">
        <button class="main-login">로그인</button>
      </div>
      <div id="profile" v-if="LOGIN">
        <img class="profile-img" :src="ProfileButtonSrc" @click="SHOW_USER_PROFILE = !SHOW_USER_PROFILE">
      </div>
    </div>
    <div id="map_marker_wrapper">
      <kakao-map :LOGIN="LOGIN" @showLoginForm="showLogin"></kakao-map>
    </div>
    <transition name="fade">
      <div id="login-background" v-if="SHOW_LOGIN_FORM" @click="closeLogin">
        <div id="login-foreground" v-if="SHOW_LOGIN_FORM" @click.stop>
          <login-and-signup @loginEvent="setLogin"></login-and-signup>
        </div>
      </div>
    </transition>
    <transition name="menu">
      <div class="user-profile" v-if="SHOW_USER_PROFILE">
        <user></user>
      </div>
    </transition>
  </div>
</template>

<script>
import LoginAndSignup from './components/LoginAndSignup.vue'
import KakaoMap from './components/Map.vue'
import User from './components/User.vue'

export default {
  name: 'App',
  mounted() {
    setTimeout(() => {
      LoginAndSignup.methods.autoLogin()
    },500)
  },
  data() {
    return {
      LOGIN: false,
      SHOW_LOGIN_FORM: false,

      ProfileButtonSrc: require("./assets/user.png")
    }
  },
  components: {
    LoginAndSignup,
    KakaoMap,
    User
  },
  methods: {

    setLogin: function(isAuto) {
      this.LOGIN = true
      this.SHOW_LOGIN_FORM = false
      this.KakaoMap.getLikedMarkers()
      this.KakaoMap.getMyMarkers()
      if (!isAuto) {
        this.KakaoMap.reRender()
      }
    },

    showLogin: function() {
      this.SHOW_LOGIN_FORM = true
    },

    closeLogin: function() {
      this.SHOW_LOGIN_FORM = false
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

button {
  font-family: Pretendard-Regular;
}

input {
  font-family: Pretendard-Regular;
}

input:focus {
  outline: none;
}

#app {
  font-family: Pretendard-Regular, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#menu_bar {
  padding: 25px 0px;
  width: 80px;
  background: rgb(25,75,130);
  box-shadow: 2rem 0 2rem 5px rgba(100, 100, 100, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 5;
  text-align: center;
  display: flex;
  justify-content: center;
}

#menu_bar img {
  min-width: 50px;
  width: 65%;
}

#menu_logo {
  height: fit-content;
}

#profile {
  position: absolute;
  bottom: 5%;
  display: flex;
  justify-content: center;
  -webkit-box-pack: center;
  align-items: center;
  -webkit-box-align: center;
}

.profile-img {
  border-radius: 100%;
  transition-duration: 0.3s;
}

.profile-img:hover {
  background-color: rgb(170, 170, 170);
}

.main-login {
  width: 80%;
  min-width: 75px;
  height: 40px;
  border-radius: 10px;
  color: black;
  background-color: white;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  border: 0px;
  box-shadow: 0 5px 5px 0 rgba(0,0,0,0.5);
  text-align: center;
  font-size: 100%;
}

.main-login:hover {
  background-color: rgb(237,40,40);
  color: white;
  box-shadow: 0 5px 5px 3px (0,0,0,0.5);
}

#map_marker_wrapper {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: calc(100% - 80px);
  height: 100%;
  z-index: 1;
}

#login-background {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  -webkit-box-pack: center;
  align-items: center;
  -webkit-box-align: center;
  background-color: rgba(0,0,0,0.5);
  z-index: 7;
}

#login-foreground {
  width: 450px;
  height: 550px;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 1rem 1rem 5px rgba(0,0,0,0.5);
  text-align: center;
  z-index: 8;
}
#login-foreground input {
  border: 0 0 2px 0 soled rgba(100, 50, 216, 0.7);
}

#dot-menu {
  position: fixed;
  right: 5%;
  bottom: 5%;
  background: rgb(25,75,130);
  z-index: 3;
}

#dot-search {
  position: fixed;
  right: 5%;
  bottom: 53%;
  background: white;
  z-index: 2;
}

#dot-filter {
  position: fixed;
  right: 5%;
  bottom: 41%;
  background: white;
  z-index: 2;
}

#dot-like {
  position: fixed;
  right: 5%;
  bottom: 29%;
  background: white;
  z-index: 2;
}

#dot-my {
  position: fixed;
  right: 5%;
  bottom: 17%;
  background: white;
  z-index: 2;
}

.dots {
  border-radius: 100%;
  width: 80px;
  height: 80px;
  box-shadow: 0 0 1rem 5px rgba(100, 100, 100, 0.8);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dots img {
  width: 50%;
}

.dots:hover {
  margin-bottom: 20px;
}

.user-profile{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 320px;
  height: 200px;
  padding: 20px;
  border-radius: 0 20px 20px 0;
  background-color: white;
  box-shadow: 2rem 0 2rem 5px rgba(100, 100, 100, 0.8);
  text-align: center;
  justify-content: center;
  z-index: 4;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100%;
  font-size: 2rem;
}

.fade-in-enter-active {
  -webkit-animation: fade-in 0.4s ease-out;
  animation: fade-in 0.4s ease-out;
}

.fade-enter-active {
  -webkit-animation: fade-in 0.4s ease-out;
  animation: fade-in 0.4s ease-out;
}

.fade-leave-active {
  -webkit-animation: fade-out 0.4s ease-out;
  animation: fade-out 0.4s ease-out;
}

.dot-search-enter-active {
  -webkit-animation: dot-search-in 0.4s ease-out;
  animation: dot-search-in 0.4s ease-out;
}
.dot-search-leave-active {
  -webkit-animation: dot-search-out 0.4s ease-out;
  animation: dot-search-out 0.4s ease-out;
}
.dot-filter-enter-active {
  -webkit-animation: dot-filter-in 0.4s ease-out;
  animation: dot-filter-in 0.4s ease-out;
}
.dot-filter-leave-active {
  -webkit-animation: dot-filter-out 0.4s ease-out;
  animation: dot-filter-out 0.4s ease-out;
}
.dot-like-enter-active {
  -webkit-animation: dot-like-in 0.4s ease-out;
  animation: dot-like-in 0.4s ease-out;
}
.dot-like-leave-active {
  -webkit-animation: dot-like-out 0.4s ease-out;
  animation: dot-like-out 0.4s ease-out;
}
.dot-my-enter-active {
  -webkit-animation: dot-my-in 0.4s ease-out;
  animation: dot-my-in 0.4s ease-out;
}
.dot-my-leave-active {
  -webkit-animation: dot-my-out 0.4s ease-out;
  animation: dot-my-out 0.4s ease-out;
}

@-webkit-keyframes fade-in {
  0% {
            opacity: 0;
  }
  100% {
            opacity: 1;
  }
}
@keyframes fade-in {
  0% {
            opacity: 0;
  }
  100% {
            opacity: 1;
  }
}
@-webkit-keyframes fade-out {
  0% {
            opacity: 1;
  }
  100% {
            opacity: 0;
  }
}
@keyframes fade-out {
  0% {
            opacity: 1;
  }
  100% {
            opacity: 0;
  }
}
@-webkit-keyframes make-in {
  0% {
    width: 0;
    height: 0;
  }
  100% {
    width: 150px;
    height: 25px;
  }
}
@keyframes make-in {
  0% {
    width: 0;
    height: 0;
  }
  100% {
    width: 150px;
    height: 25px;
  }
}
@-webkit-keyframes dot-search-in {
  0% {
    bottom: 5%;
  }
  100% {
    bottom: 53%;
  }
}
@keyframes dot-search-in {
  0% {
    bottom: 5%;
  }
  100% {
    bottom: 53%;
  }
}
@-webkit-keyframes dot-filter-in {
  0% {
    bottom: 5%;
  }
  100% {
    bottom: 41%;
  }
}
@keyframes dot-filter-in {
  0% {
    bottom: 5%;
  }
  100% {
    bottom: 41%;
  }
}
@-webkit-keyframes dot-like-in {
  0% {
    bottom: 5%;
  }
  100% {
    bottom: 29%;
  }
}
@keyframes dot-like-in {
  0% {
    bottom: 5%;
  }
  100% {
    bottom: 29%;
  }
}
@-webkit-keyframes dot-my-in {
  0% {
    bottom: 5%;
  }
  100% {
    bottom: 17%;
  }
}
@keyframes dot-my-in {
  0% {
    bottom: 5%;
  }
  100% {
    bottom: 17%;
  }
}
@-webkit-keyframes dot-search-out {
  0% {
    bottom: 53%;
  }
  100% {
    bottom: 5%;
  }
}
@keyframes dot-search-out {
  0% {
    bottom: 53%;
  }
  100% {
    bottom: 5%;
  }
}
@-webkit-keyframes dot-filter-out {
  0% {
    bottom: 41%;
  }
  100% {
    bottom: 5%;
  }
}
@keyframes dot-filter-out {
  0% {
    bottom: 41%;
  }
  100% {
    bottom: 5%;
  }
}
@-webkit-keyframes dot-like-out {
  0% {
    bottom: 29%;
  }
  100% {
    bottom: 5%;
  }
}
@keyframes dot-like-out {
  0% {
    bottom: 29%;
  }
  100% {
    bottom: 5%;
  }
}
@-webkit-keyframes dot-my-out {
  0% {
    bottom: 17%;
  }
  100% {
    bottom: 5%;
  }
}
@keyframes dot-my-out {
  0% {
    bottom: 17%;
  }
  100% {
    bottom: 5%;
  }
}

@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}

</style>
