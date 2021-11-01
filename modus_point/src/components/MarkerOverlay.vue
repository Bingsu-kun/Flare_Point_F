<template>
  <div id="marker-overlay-container">
    <button class="close" @click="menuCloseEvent"></button>
    <!-- 마커 정보 표시 + 길찾기 버튼 
    마커 이름 name 좋아요 버튼
    만든 날짜 createdAt
    태그 tags
    내용 description
    
    만든 사람 fisherId
    -->
    <h3>{{ selected.name }}</h3>
    <h6>Made by {{ madeBy }}</h6>
    <h6>{{ selected.createdAt }}</h6>
    <span id="marker-tags" v-for="tag in result.tags.split('#')" :key="tag">{{ tag }}</span>
    <div id="marker-overlay-description">{{ selected.description }}</div>
    <button class="marker-overlay-like" v-if="!itsMine">{{ likeCount }}</button>
    <button class="marker-overlay-mine" v-if="itsMine">삭제하기</button>
    <br>
    <a id="marker-overlay-findroad"></a>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  computed: {
    madeBy: async function() {
      const id = this.selected.fisherId
      const mf = localStorage.getItem(id)
      if (mf) {
        return mf
      }
      else {
        try {
          await axios({
            method: 'GET',
            // url: 'http://3.34.252.182:8080/marker/create',
            headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
            // data: { fisherId: id },
            withCredentials: true
          }).then((res) => {

            if (res.data.success === false) {
              console.log('get fisher failed.' + res.data.response)
            }
            else {
              // localStorage.setItem(id, res.data.response.name)
              // return res.data.response.name
            }
          })
        } catch (error) {
          console.log('bad connection.' + error)
        }
      }
    },
    likeCount: async function() {
      const id = selected.markerId
      try {
        await axios({
          method: 'GET',
          // url: 'http://3.34.252.182:8080/marker/create',
          headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
          // data: { markerId: id },
          withCredentials: true
        }).then((res) => {

          if (res.data.success === false) {
            console.log('get like failed.' + res.data.response)
          }
          else {
            // return res.data.response.like
          }
        })
      } catch (error) {
        console.log('bad connection.' + error)
      }
    },
    iLiked: function() {
      if (this.likedMarkers.indexOf(this.selected) === -1)
        return false
      else {
        document.querySelector(".marker-overlay-like").style.backgroundColor = 'rgb(237,40,40)'
        return true 
      }
    },
    itsMine: function() {
      if (this.myMarkers.indexOf(this.selected) === -1)
        return false
      else
        return true 
    }
  },
  watch: {
    selected: function() {
      this.findRoadLink(document.querySelector('#marker-overlay-findroad'))
    }
  },
  props:['selected','likedMarkers','myMarkers'],
  methods: {
    like: async function() {
      if (!sessionStorage.getItem('id'))
        this.showLoginForm()
      else if (!this.iLiked) {
        try {
          await axios({
            method: 'GET',
            // url: 'http://3.34.252.182:8080/marker/create', 좋아요
            headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
            // data: { markerId: id },
            withCredentials: true
          }).then((res) => {

            if (res.data.success === false) {
              console.log('get like failed.' + res.data.response)
            }
            else {
              // return res.data.response.like
            }
          })
        } catch (error) {
          console.log('bad connection.' + error)
        }
      }
      else {
        try {
          await axios({
            method: 'GET',
            // url: 'http://3.34.252.182:8080/marker/create', 좋아요 취소
            headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
            // data: { markerId: id },
            withCredentials: true
          }).then((res) => {

            if (res.data.success === false) {
              console.log('get like failed.' + res.data.response)
            }
            else {
              // return res.data.response.like
            }
          })
        } catch (error) {
          console.log('bad connection.' + error)
        }
      }
    },
    findRoadLink: function($target) {
      $target.setAttribute('href',`https://map.kakao.com/link/to/선택한마커,${this.selected.latitude},${this.selected.longitude}`)
    },
    menuCloseEvent: function() {
      this.$emit("menuCloseEvent")
    },
    showLoginForm: function() {
      this.$emit("showLoginForm")
    }

  },


}
</script>

<style>

</style>