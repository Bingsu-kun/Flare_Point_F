<template>
  <div>
    <div class="login-form" v-if="isLogin">
      <h1>로그인</h1>
      <div id="login_input">
        <input id="principal" placeholder="이메일">
      </div>
      <div id="login_input">
        <input id="credencial" placeholder="비밀번호">
      </div>
      <div>
        <button class="login_button" @click="login">로그인</button>
        <button class="login_button" @click="isLogin = false">회원가입</button>
      </div>
    </div>
    <div class="signup-from" v-if="!isLogin">
      <img class="back" :src="BackButtonSrc" @click="isLogin = true">
      <h2>회원가입</h2>
      <div id="signup_input">
        <input id="principal" placeholder="이메일" >
        <button id="e-check" class="signup_button" @click="emailCheck">중복확인</button>
      </div>
      <div id="signup_input">
        <input style="margin-right: 65px" id="credential" placeholder="비밀번호">
      </div>
      <div id="signup_input">
        <input style="margin-right: 65px" id="checkCredential" placeholder="비밀번호 확인">
      </div>
      <div id="signup_input">
        <input id="fishername" placeholder="닉네임">
        <button id="n-check" class="signup_button" @click="nameCheck">중복확인</button>
      </div>
      <button style="margin: 15px 30px 0 30px" class="login_button" @click="signup">회원가입</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',

  mounted() {
    // auto login 
    // 첫 화면 띄울 때 요청 받아와서 Header에 apiToken있는지 체크, 없으면 Cookie에 refreshToken있는지 체크.
    // 둘 중 하나라도 있으면 백에 /login 요청.
    // 로그인 성공시 data의 login 플래그 true로.

  },

  data() {
    return {
      isLogin: true,

      BackButtonSrc: require("./../assets/back.png")
    }
  },

  methods: {

    //-----------------------------login----------------------------------

    login: function() {
      const principal = document.getElementById('principal').value;
      const credential = document.getElementById('credential').value;
      //axios를 이용해서 백에 /login 

      //response를 받아 Header에 apiToken을, Cookie에 refreshToken을, data의 fisher변수에 값을 저장.

      //로그인 실패시 에러처리
    },

    signup: function() {
      //회원가입 처리
      //비밀번호 확인 체크 로직
    },

    emailCheck: function() {
      //email 중복첵
    },

    nameCheck: function() {
      //닉넴 중복첵
    }

  },

}
</script>

<style>

#login_input {
  margin: 30px 0;
}

#login_input input {
  width: 80%;
  height: 40px;
  font-size: 20px;
}

#signup_input {
  margin: 10px 0;
}

#signup_input input {
  width: 60%;
  height: 30px;
  font-size: 14px;
}

.back {
  margin: 10px 0 10px 30px;
  width: 4rem;
  height: 4rem;
  -webkit-transition-duration: 0.4;
  transition-duration: 0.4;
  position: fixed;
  top: 135px;
  left: 39%
}

.back:hover {
  -webkit-animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.login_button {
  margin: 50px 30px 0 30px;
  width: 80px;
  height: 40px;
  border-radius: 5px;
  color: white;
  background-color: rgb(237, 40, 40);
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  border: 2px solid rgb(237, 40, 40);
}

.login_button:hover {
  background-color: rgb(255,255,255);
  color: black;
}

.signup_button {
  margin: 20px 0 0 5px;
  width: 60px;
  height: 25px;
  border-radius: 3px;
  color: white;
  background-color: rgb(237, 40, 40);
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  border: 2px solid rgb(237, 40, 40);
  font-size: 0.6rem;
}

.signup_button:hover {
  background-color: rgb(255,255,255);
  color: black;
}


@-webkit-keyframes slide-left {
  0% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
  }
  100% {
    -webkit-transform: translateX(-2rem);
            transform: translateX(-2rem);
  }
}
@keyframes slide-left {
  0% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
  }
  100% {
    -webkit-transform: translateX(-2rem);
            transform: translateX(-2rem);
  }
}

</style>