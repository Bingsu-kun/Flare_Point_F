<template>
  <div>
    <transition name="fade-in">
      <div id="login_input" v-if="isLogin">
        <h1>로그인</h1>
        <p>이메일</p>
        <input type="email" v-model="principal">
        <p style="color: rgb(237,40,40)">{{ login_email_error }}</p>
        <p>패스워드</p>
        <input type="password" v-model="credentials">
        <p>{{ login_password_error }}</p>
        <button class="login_button" @click="login">로그인</button>
        <button class="login_button" @click="isLogin = false">회원가입</button>
      </div>
    </transition>
    <transition name="fade-in">
      <div id="signup_input" v-if="!isLogin">
        <img class="back" :src="BackButtonSrc" @click="isLogin = true" alt="뒤로가기">
        <h2>회원가입</h2>
        <div>
          <input id="signup_email_input" placeholder="이메일" type="email" v-model="principal" @keyup="autoEmailCheck">
          <p v-if="email_error_message != null">{{ email_error_message }}</p>
          <input placeholder="비밀번호(영문,숫자,특수문자 포함 6 ~ 20자)" type="password" v-model="credentials">
          <input placeholder="비밀번호 확인" type="password" v-model="checkCredentials">
          <input id="signup_name_input" placeholder="닉네임(2~10자)" type="text" v-model="name" @keyup="autoNameCheck">
          <p v-if="name_error_message != null">{{ name_error_message }}</p>
        </div>
        <p>{{ signup_error_message }}</p>
        <button style="margin: 15px 30px 0 30px" class="login_button" @click="signup">회원가입</button>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginAndSignup',

  mounted() {

  },

  data() {
    return {
      isLogin: true,

      BackButtonSrc: require("./../assets/back.png"),

      login_email_error: null,
      login_password_error: null,
      email_error_message: null,
      name_error_message: null, 
      signup_error_message: null,

      principal: null,
      credentials: null,
      checkCredentials: null,
      name: null,

      emailChecked: false,
      nameChecked: false,

      COOKIE_NAME: 'refreshToken',

      timer: null
    }
  },

  methods: {

    //--------------------------- login -----------------------------------

    autoLogin: async function() {
      try {
        const refreshCookie = this.getCookie(this.COOKIE_NAME)
        await axios({
          method: 'GET',
          url: 'http://localhost:8080/fisher/me',
          headers: { Cookie: refreshCookie, Authorization: 'Bearer ' + sessionStorage.getItem('apiToken') },
          withCredentials: true
        }).then((res) => {
          console.log(res.data.response)

          if (res.data.success === false) {
            console.log('refreshToken is expired.')
          }
          else {
            sessionStorage.setItem("apiToken", res.data.response.apiToken)
            sessionStorage.setItem("name", res.data.response.fisher.fishername)
            sessionStorage.setItem("role", res.data.response.fisher.role)
            sessionStorage.setItem("email", res.data.response.fisher.email)
            sessionStorage.setItem("id", res.data.response.fisher.id)

            this.loginEvent()
          }
        })
      } catch (error) {
        console.log('bad connection.')
      }
    },

    login: async function() {
      const principal = this.principal
      const credentials = this.credentials

      //axios를 이용해서 백에 /login 
      if (principal === null || credentials === null) {
        if (principal === null)
          this.login_email_error = "이메일은 필수로 입력해 주세요!"
        if (credentials === null)
          this.login_password_error = "비밀번호는 필수로 입력해 주세요!"
      }
      else {
        this.login_email_error = null
        this.login_password_error = null
        const refreshCookie = this.getCookie(this.COOKIE_NAME)
        try {
          await axios({
            method: 'POST',
            url: 'http://localhost:8080/fisher/login',
            data: { principal: principal, credentials: credentials },
            headers: { Cookie: refreshCookie, Authorization: 'Bearer ' + sessionStorage.getItem('apiToken') },
            withCredentials: true
            }).then((res) => { 
            //apiToken, refreshToken, FisherDTO
            console.log(res.data)

            if (res.data.success === false) {
              const statusCode = res.data.error.status
        
              if (statusCode === 401)
                //unauthorized -> 비밀번호 불일치
                this.login_password_error = "비밀번호가 일치하지 않습니다."
              else if (statusCode === 406)
                //not_acceptable -> 이메일 형식 불일치
                this.login_email_error = "이메일 형식에 맞지 않습니다."
              else if (statusCode === 500)
                this.login_email_error = "존재하지 않는 아이디입니다."

            }
            else{
              sessionStorage.setItem("apiToken", res.data.response.apiToken)
              sessionStorage.setItem("name", res.data.response.fisher.fishername)
              sessionStorage.setItem("role", res.data.response.fisher.role)
              sessionStorage.setItem("email", res.data.response.fisher.email)
              sessionStorage.setItem("id", res.data.response.fisher.id)

              this.loginEvent()
            }
          })
        } catch (error) {
          const statusCode = error.response.status
          console.warn("unexpected error occured" + error)
        }
      }
      
    },

    //-------------------------- signup -----------------------------------

    signup: async function() {
      //회원가입 처리

      const principal = this.principal
      const credentials = this.credentials
      const checkCredentials = this.checkCredentials
      const name = this.name

      // 비밀번호 확인 체크
      if (credentials !== checkCredentials)
        this.signup_error_message = "비밀번호와 비밀번호 확인이 일치하지 않습니다."
      // email 또는 닉네임 중복 체크 안했을 때.
      else if (this.emailChecked === false)
        this.signup_error_message = "이메일 중복체크를 진행해 주세요!"
      else if (this.nameChecked === false)
        this.signup_error_message = "닉네임 중복체크를 진행해 주세요!"
      else {
        try {
          await axios({
            method: 'POST',
            url: 'http://localhost:8080/fisher/join',
            data: { principal: principal, credentials: credentials, name: name },
            withCredentials: true
          })
          .then((res) => {
            //apiToken, refreshToken, fisher
            
            console.log(res.data.response)

            if (res.data.success === false) {
              console.log(`unexpected error occured`)              
            }
            else {
              sessionStorage.setItem("apiToken", res.data.response.apiToken)
              sessionStorage.setItem("name", res.data.response.fisher.fishername)
              sessionStorage.setItem("role", res.data.response.fisher.role)
              sessionStorage.setItem("email", res.data.response.fisher.email)
              sessionStorage.setItem("id", res.data.response.fisher.id)

              alert(`가입되었습니다! 환영합니다 ${name}님:)`)

              this.isLogin = true
            }
          })
        } catch (error) {
          console.error("unexpected error occured" + error)
        }
      }

    },

    //------------------------------------ exist check ---------------------------------------

    autoEmailCheck: function() {
      this.emailChecked = false
      if(this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.emailCheck()
      }, 300)
    },

    autoNameCheck: function() {
      this.nameChecked = false
      if(this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.nameCheck()
      }, 300)
    },

    emailCheck: async function() {
      //email 중복체크
      const principal = this.principal

      try {
        await axios({
          method: 'POST',
          url: 'http://localhost:8080/fisher/join/email/exists',
          data: { req: principal }
        })
        .then((res) => {
          console.log(res)

          if (res.data.success === false) {
            const statusCode = res.data.error.status

            if (statusCode === 400)
              this.email_error_message = "이메일 형식에 맞지 않습니다."
            else if (statusCode === 409) 
              this.email_error_message = "이미 같은 이메일이 존재합니다.."
          }
          else {
            this.emailChecked = true
            this.email_error_message = "사용 가능한 이메일입니다!"
          }
        })
      } catch (error) {
        console.warn("unexpected error occured" + error)
        this.email_error_message = "서버와의 연결이 좋지 않습니다.."
      } 
    },

    nameCheck: async function() {
      //닉넴 중복체크
      const name = this.name

      try {
        await axios({
          method: 'POST',
          url: 'http://localhost:8080/fisher/join/name/exists',
          data: { req: name }
        })
        .then((res) => {
          console.log(res)

          if (res.data.success === false) {
            const statusCode = res.data.error.status
        
            if (statusCode === 400)
              this.name_error_message = "닉네임은 2자 이상 10자 이하여야 입니다."
            else if (statusCode === 409) 
              this.name_error_message = "이미 같은 닉네임이 존재합니다.."
          }
          else{
            this.nameChecked = true
            this.name_error_message = "사용 가능한 닉네임입니다!"
          }
        })
      } catch (error) {
        console.warn("unexpected error occured" + error)
        this.name_error_message = "서버와의 연결이 좋지 않습니다.."
      } 
    },

    // --------------------------------- util --------------------------------------

    loginEvent: function() {
      this.$emit("loginEvent")
    },

    getCookie: function(name) {
      const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      console.log(document.cookie)
      return value? value[2] : null;
    }
  },

}
</script>

<style>

p {
  text-align: left;
  font-size: 14px;
}

#login_input {
  padding: 30px;
  font-size: 20px;
}

#login_input input {
  width: 100%;
  height: 30px;
  font-size: 14px;
}


#signup_input {
  padding: 30px;
  font-size: 20px;
}

#signup_input input {
  margin: 10px 0;
  width: 100%;
  height: 30px;
  font-size: 14px;
}

.back {
  margin: 10px 0 10px 30px;
  width: 4rem;
  height: 4rem;
  -webkit-transition-duration: 0.4;
  transition-duration: 0.4;
  position: absolute;
  left: 0%;
}

.back:hover {
  -webkit-animation: slide-left 0.5s ease-out alternate both;
	animation: slide-left 0.5s ease-out alternate both;
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
  text-align: center;
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
    -webkit-transform: translateX(-1rem);
            transform: translateX(-1rem);
  }
}
@keyframes slide-left {
  0% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
  }
  100% {
    -webkit-transform: translateX(-1rem);
            transform: translateX(-1rem);
  }
}

</style>