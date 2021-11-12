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
      <div>{{ selected.name }}</div>
      <div>{{ selected.createdAt.slice(0,10) }}</div>
      <span id="marker-tags" v-for="tag in selected.tags.split('#')" :key="tag">{{ tag }}</span>
    </div>
    <div id="marker-overlay-description">{{ selected.description }}</div>
    <div id="marker-overlay-buttons">
      <button class="marker-overlay-like" @click="like">{{ likeCount }}</button>
      <button class="marker-overlay-mine" v-if="itsMine" @click="confirmDel = true">삭제하기</button>
      <br>
      <button class="marker-overlay-findroad" @click="window.open(`https://map.kakao.com/link/to/선택한마커,${this.selected.latitude},${this.selected.longitude}`)">길찾기</button>
    </div>
    <div id="confirm-delete" v-if="confirmDel">
      <h3>정말 마커를 삭제할까요?</h3>
      <button class="negative-button" @click="confirmDel = false">아니요</button>
      <button class="positive-button" @click="deleteMarker">네</button>
    </div> 
  </div>
</template>

<script>
import axios from 'axios';

export default {
  mounted() {
    this.getLikedMarkers()
    this.getMyMarkers()
  },
  computed: {
    iLiked: function() {
      return this.checkMarker(this.likedMarkers)
    },
    itsMine: function() {
      console.log(this.checkMarker(this.myMarkers))
      return this.checkMarker(this.myMarkers)
    }
  },
  data() {
    return {
      noResult: true,
      confirmDel: false,
      likedMarkers: [],
      myMarkers: [],
      likeCount: 0,

      starOn: require("../assets/star_on.png"),
      starOff: require("../assets/star_off.png")
    }
  },
  props:['selected'],
  methods: {
    getLikedMarkers: async function() {
      try {
        await axios({
          method: 'GET',
          url: 'http://3.34.252.182:8080/marker/mylikelist',
          headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
          withCredentials: true
        }).then((res) => {

          if (res.data.success === false) {
            console.log('get liked markers failed.')
          }
          else {
            this.likedmarkers = res.data.response
            if (res.data.response !== []) {
              this.noResult = false
            }
          }
        })
      } catch (error) {
        this.logout()
      }
    },
    getMyMarkers: async function() {
      try {
        await axios({
          method: 'GET',
          url: 'http://3.34.252.182:8080/marker/mymarkers',
          headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
          withCredentials: true
        }).then((res) => {

          if (res.data.success === false) {
            console.log('get my markers failed.')
          }
          else {
            this.myMarkers = res.data.response
            if (res.data.response !== []) {
              this.noResult = false
            }
          }
        })
      } catch (error) {
        this.logout()
      }
    },
    getLikeCount: async function() {
      const id = this.selected.markerId
      try {
        await axios({
          method: 'POST',
          url: 'http://3.34.252.182:8080/marker/thiscount',
          data: { markerId: id },
          withCredentials: true
        }).then((res) => {

          if (res.data.success === false) {
            console.log('get like failed.' + res.data.response)
            this.likeCount = '?'
          }
          else {
            this.likeCount = res.data.response.like
          }
        })
      } catch (error) {
        this.likeCount = '?'
      }
    },
    like: async function() {
      const id = this.selected.markerId
      if (!sessionStorage.getItem('id'))
        this.showLoginForm()
      else if (!this.iLiked) {
        try {
          await axios({
            method: 'POST',
            url: 'http://3.34.252.182:8080/marker/like', // 좋아요
            headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
            data: { markerId: id },
            withCredentials: true
          }).then((res) => {

            if (res.data.success === false) {
              console.log('get like failed.' + res.data.response)
            }
            else {
              this.likedMarkers.push(this.selected)
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
            method: 'DELETE',
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
    deleteMarker: async function() {
      const id = this.selected.markerId
      const mfId = this.selected.fisherId
      try {
        await axios({
          method: 'DELETE',
          url: 'http://3.34.252.182:8080/marker/delete',
          headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}`},
          data: { markerId: id, mfId: mfId },
          withCredentials: true
        }).then((res) => {
          if (res.data.success === false) {
            console.log('deleting failed.' + res.data.response)
          }
          else {
            this.deleteEvent(this.selected)
            alert("삭제되었습니다.")
          }
        })
      } catch (error) {
        console.log('bad connection.' + error)
      }
    },
    checkMarker: function(markers) {
      let cnt = 0
      for (let mk of markers) {
        if (mk.markerId === this.selected.markerId)
          return true
        else if (cnt === markers.length)
          return false
        else
          cnt++
      }
    },
    menuCloseEvent: function() {
      this.$emit("menuCloseEvent")
    },
    showLoginForm: function() {
      this.$emit("showLoginForm")
    },
    deleteEvent: function(selected) {
      this.confirmDel = false
      this.menuCloseEvent()
      this.$emit("deleteEvent",selected)
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

#confirm-delete {
  width: 300px;
  height: 130px;
  padding: 20px;
  background-color: white;
  border-radius: 20px;
  position: fixed;
  left: calc(50% - 150px);
  top: calc(50% - 65px);
}

.negative-button {
  width: 80px;
  height: 40px;
  margin: 0 20px;
  background-color: rgb(237, 40, 40);
  color: white;
  border: 0;
  border-radius: 5px;
  transition-duration: 0.3s;
}

.negative-button:hover {
  width: 85px;
  height: 45px;
}

.positive-button {
  width: 80px;
  height: 40px;
  margin: 0 20px;
  background-color: rgb(170,170,170);
  color: black;
  border: 0;
  border-radius: 5px;
  transition-duration: 0.3s;
}

.positive-button:hover {
  width: 85px;
  height: 45px;
}

.marker-overlay-like {
  width: 150px;
  height: 50px;
  background-image: url('../assets/star_on.png');
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