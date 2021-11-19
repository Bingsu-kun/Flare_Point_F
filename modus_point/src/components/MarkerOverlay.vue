<template>
  <div id="menu-container">
    <button class="close" @click="overlayCloseEvent"></button>
    <div style="padding: 20px 0">
      <div id="marker-title">{{ selected.name }}</div>
      <div id="marker-tags">{{ selected.tags }}</div>
      <div id="marker-date">업데이트 일자 : {{ selected.createdAt.slice(0,10) }}</div>
      <div id="marker-link">
        <div class="marker-link-buttons">
          <img alt="star" v-if="iLiked" :src="starOn" @click="dislike">
          <img alt="star" v-if="!iLiked" :src="starOff" @click="like">
          <div id="marker-overlay-like" style="font-size: 11px">{{ getLikeCount(seleted.markerId) }}</div>
        </div>
        <div class="marker-link-buttons">
          <img alt="kakaomap" :src="kakaomap" @click="findKakaoRoad(selected.latitude,selected.longitude)">
          <div style="font-size: 11px">길찾기</div>
        </div>
        <div class="marker-link-buttons">
          <img alt="share" :src="shareIcon">
          <div style="font-size: 11px">공유하기</div>
        </div>
      </div>
      <div id="marker-addr">주소: {{ selected.place_addr }}</div>
      <div style="padding: 10px 20px">
        <div style="margin-bottom: 10px; font-family: Pretendard-Bold; font-size: 16px; text-align: left;">마커 제작자의 한 마디</div>
        <comment :comment="selected.description" :userProfImgName="makerProfImgName" :userName="makerName" :date="selected.createdAt.slice(0,10)"></comment>
      </div>
    </div>
    <button class="comment-button" v-if="!itsMine">방문 후기 남기기</button>
    <div id="marker-link" v-if="itsMine">
      <div class="marker-link-buttons">
        <img alt="trash" @click="confirmDel" :src="trash">
        <div style="font-size: 11px">삭제하기</div>
      </div>
      <div class="marker-link-buttons">
        <img alt="fix" :src="fix" @click="notiOn = true">
        <div style="font-size: 11px">수정하기</div>
      </div>
    </div>
    <transition name="fade">
      <div id="confirm-delete" v-if="confirmDel">
        <div id="menu-title">정말 마커를 삭제할까요?!</div>
        <button class="negative-button" @click="confirmDel = false">아니요</button>
        <button class="positive-button" @click="deleteMarker">네</button>
      </div> 
    </transition>
    <div v-if="commentsExist" style="width: -webkit-fill-available; height: 250px; display: flex; align-items: center; justify-content: center;">
      <div>후기가 없습니다</div>
    </div>
    <transition name="noti">
      <noti v-if="notiOn" @notiEvent="notiOn = false" :text="'기능 개발 중 입니다'"></noti>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import comment from './Comment.vue'
import noti from './Noti.vue'

export default {
  mounted() {
    JSON.parse(sessionStorage.getItem('liked')).array.forEach(element => {
      this.likedMarkers.push(element)
    });
    JSON.parse(sessionStorage.getItem('my')).array.forEach(element => {
      this.myMarkers.push(element)
    });
    this.getMadeBy
  },
  computed: {
    iLiked: function() {
      if (this.likedMarkers)
        return this.checkMarker(this.likedMarkers)
      else
        return false
    },
    itsMine: function() {
      if (this.myMarkers)
        return this.checkMarker(this.myMarkers)
      else
        return false
    },
    commentsExist: function() {
      if (this.comments.length !== 0)
        return false
      else
        return true
    }
  },
  components: {
    comment,
    noti
  },
  data() {
    return {
      noResult: true,
      confirmDel: false,
      likedMarkers: [],
      myMarkers: [],
      makerProfImgName: '',
      makerName: '',
      comments: [],

      notiOn: false,
      
      starOn: require("../assets/star_on.png"),
      starOff: require("../assets/star_off.png"),
      kakaomap: require("../assets/kakaomap.png"),
      shareIcon: require("../assets/share.png"),
      trash: require("../assets/trash.png"),
      fix: require("../assets/hammer.png")
    }
  },
  props:['selected'],
  methods: {
    getLikeCount: async function(markerId) {
      try {
        await axios({
          method: 'POST',
          url: 'http://3.34.252.182:8080/marker/thiscount',
          data: { markerId: markerId },
          withCredentials: true
        }).then((res) => {

          if (res.data.success === false) {
            console.log('get like failed.' + res.data.response)
            this.likeCount = '?'
          }
          else {
            return res.data.response.like
          }
        })
      } catch (error) {
        this.likeCount = '?'
      }
    },
    getMadeBy: async function() {
      const id = this.selected.fisherId

      try {
        await axios({
          method: 'GET',
          url: `http://3.34.252.182:8080/fisher/${id}`,
          withCredentials: true
        }).then((res) => {
          if (res.data.success === false) {
            console.warn('get fisher failed.' + res.data.response)
          }
          else {
            this.makerProfImgName = res.data.response.fisher.profImageName
            this.makerName = res.data.response.fisher.fishername
          }
        })
      } catch (error) {
        console.warn(error)
      }
    },
    like: async function() {
      const id = this.selected.markerId

      if (!sessionStorage.getItem('id'))
        this.showLoginForm()
      else {
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
              sessionStorage.setItem('liked',this.likedMarkers)
              document.querySelector('#marker-overlay-like').innerText = document.querySelector('#marker-overlay-like').innerText + 1
            }
          })
        } catch (error) {
          console.log('bad connection.' + error)
        }
      }
    },
    dislike: async function() {
      const id = this.selected.markerId

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
            for (let mk of this.likedMarkers) {
              if (mk.markerId === this.selected.markerId)
                this.likedMarkers.pop(mk)
            }
            sessionStorage.setItem('liked',this.likedMarkers)
            document.querySelector('#marker-overlay-like').innerText = document.querySelector('#marker-overlay-like').innerText - 1
          }
        })
      } catch (error) {
        console.log('bad connection.' + error)
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
    findKakaoRoad: function(latitude, longitude) {
      window.open(`https://map.kakao.com/link/to/선택한마커,${latitude},${longitude}`)
    },
    overlayCloseEvent: function() {
      this.$emit("overlayCloseEvent")
    },
    showLoginForm: function() {
      this.$emit("showLoginForm")
    },
    doUpdate: function() {
      this.$emit("doUpdate")
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

#marker-title {
  padding: 5px 0;
  font-family: Pretendard-Black;
  font-size: 20px;
}

#marker-tags {
  padding: 5px 0;
  font-family: Pretendard-Bold;
  font-size: 13px;
}

#marker-date {
  font-size: 11px;
}

#marker-addr {
  padding: 5px 0;
  font-size: 13px;
}

#marker-link {
  margin: 10px 0;
  padding: 0 40px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}

#marker-link img {
  height: 20px;
}

.marker-link-buttons {
  margin: 0 20px;
  width: 40px;
}
.marker-link-buttons img:hover {
  cursor: pointer;
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

.comment-button {
  width: -webkit-fill-available;
  height: 50px;
  border: 0;
  background-color: #cacaca;
  font-family: Pretendard-Bold;
  font-size: 13px;
  transition-duration: 0.2s;
}

.comment-button:hover {
  cursor: pointer;
  background-color: #F3776B;
  color: white;
}

.negative-button {
  width: 80px;
  height: 40px;
  margin: 0 20px;
  background-color: #F3776B;
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

</style>