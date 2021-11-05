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
    <div id="marker-overlay-header">
      <h3>{{ selected.name }}</h3>
      <h6>{{ selected.createdAt.slice(0,10) }}</h6>
      <span id="marker-tags" v-for="tag in selected.tags.split('#')" :key="tag">{{ tag }}</span>
    </div>
    <div id="marker-overlay-description">{{ selected.description }}</div>
    <div id="marker-overlay-buttons">
      <button class="marker-overlay-like" v-if="!itsMine">{{ likeCount }}</button>
      <button class="marker-overlay-mine" v-if="itsMine">삭제하기</button>
      <br>
      <button class="marker-overlay-findroad" @click="window.open(`https://map.kakao.com/link/to/선택한마커,${this.selected.latitude},${this.selected.longitude}`)">길찾기</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  computed: {
    likeCount: function() {
      return this.getLikeCount()
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
  props:['selected','likedMarkers','myMarkers'],
  methods: {
    getLikeCount: async function() {
      const id = this.selected.markerId
      console.log(id)
      try {
        await axios({
          method: 'POST',
          url: 'http://3.34.252.182:8080/marker/thiscount',
          data: { markerId: id },
          withCredentials: true
        }).then((res) => {

          if (res.data.success === false) {
            console.log('get like failed.' + res.data.response)
            return '?'
          }
          else {
            return res.data.response.like
          }
        })
      } catch (error) {
        console.log('bad connection.' + error)
        return '?'
      }
    },
    like: async function() {
      const id = this.selected.markerId
      if (!sessionStorage.getItem('id'))
        this.showLoginForm()
      else if (!this.iLiked) {
        try {
          await axios({
            method: 'GET',
            url: 'http://3.34.252.182:8080/marker/like', // 좋아요
            headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
            data: { markerId: id },
            withCredentials: true
          }).then((res) => {

            if (res.data.success === false) {
              console.log('get like failed.' + res.data.response)
            }
            else {
              this.likeCount += 1
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
            url: 'http://3.34.252.182:8080/marker/dislike', //좋아요 취소
            headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
            data: { markerId: id },
            withCredentials: true
          }).then((res) => {

            if (res.data.success === false) {
              console.log('get like failed.' + res.data.response)
            }
            else {
              this.likeCount -= 1
            }
          })
        } catch (error) {
          console.log('bad connection.' + error)
        }
      }
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

#marker-overlay-container {
  padding: 20px;
}

#marker-overlay-description {
  width: inherit;
  height: fit-content;
  background-color: rgb(170, 170, 170);
  border-radius: 20px;
}

#marker-overlay-buttons {
  bottom: 20px;
}

.marker-overlay-like {
  width: 150px;
  height: 50px;
  background-image: url('../assets/flare_on.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 2px solid rgb(237, 40, 40);
  background-color: white;
  transition-duration: 0.3s;
  color: black;
  font: bold;
}

.marker-overlay-like:hover {
  background-color: rgb(237, 40, 40);
  color: white;
}

.marker-overlay-mine {
  width: 150px;
  height: 50px;
  background-image: url('../assets/trash.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 2px solid rgb(170, 170, 170);
  background-color: white;
  transition-duration: 0.3s;
  color: black;
  font: bold;
}

.marker-overlay-mine:hover {
  background-color: rgb(170, 170, 170);
  color: white;
}

.marker-overlay-findroad {
  width: 150px;
  height: 50px;
  border: 2px solid rgb(254, 255, 200);
  background-color: white;
  transition-duration: 0.3s;
  color: rgb(26, 62, 224);
  font: bold;
}

.marker-overlay-findroad:hover {
  background-color: rgb(254, 255, 200);
}

</style>