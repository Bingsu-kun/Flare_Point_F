<template>
  <div id="menu-contents">
    <div id="select-category" style="margin-bottom: 10px;">
      <label id="fishing"><input type="radio" name="category" value="fishing" v-model="pickedCategory">낚시</label>
      <label id="camping"><input type="radio" name="category" value="camping" v-model="pickedCategory">캠핑</label>
      <label id="gathering"><input type="radio" name="category" value="gathering" v-model="pickedCategory">채집</label>
    </div>
    <div id="select-category" style="margin-top: 10px;">
      <label id="store"><input type="radio" name="category" value="store" v-model="pickedCategory">특별한가게</label>
      <label id="secret_place"><input type="radio" name="category" value="secret_place" v-model="pickedCategory">나만의장소</label>
    </div>
    <div>
      <input class="marker-input" placeholder="마커의 이름을 적어주세요" v-model="markerName">
      <textarea id="description" v-model="description" @keyup="checklength" class="marker-input" placeholder="마커를 설명해 주세요 (최대 100자)" style="height: 200px; resize: none; word-break: break-all; text-overflow: clip;"></textarea>
      <p v-if="DescOver" style="color: rgb(237,40,40)" >최대 100자 까지만 가능합니다!</p>
      <input class="marker-input" placeholder="마커를 대표할 태그를 적어주세요 (최대 10개)" style="font-size: 12px;" v-model="tagString">
    </div>
    <label>나만보기<input type="checkbox" name="isPrivate" value="true" v-model="isPrivate"></label>
    <button @click="saveMarker" class="marker-make-button">저장</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      pickedCategory: '',
      markerName: '',
      description: '',
      tagString: '',
      isPrivate: '',

      DescOver: false
    }
  },
  props: ['latitude', 'longitude'],
  methods: {
    saveEvent: function() {
      this.$emit('saveEvent', this.pickedCategory)
    },
    checklength: function() {
      const maxlen = 100
      const desc = document.getElementById('description').value
      if (desc.length > maxlen) {
        this.DescOver = true
        document.getElementById('description').value = desc.slice(0,99)
      }
      else {
        this.DescOver = false
      }
    },
    saveMarker: async function() {

      const name = this.markerName
      const latitude = this.latitude
      const longitude = this.longitude
      const isPrivate = this.isPrivate
      const category = this.pickedCategory
      const tagString = this.tagString
      const description = this.description

      try {
        const refreshCookie = this.getCookie('refreshToken')
        await axios({
          method: 'POST',
          url: 'http://localhost:8080/marker/create',
          headers: { Cookie: refreshCookie, Authorization: 'Bearer ' + sessionStorage.getItem('apiToken') },
          data: { name: name, latitude: latitude, longitude: longitude, isPrivate: isPrivate, category: category, tagString: tagString, description: description },
          withCredentials: true
        }).then((res) => {
          console.log(res.data.response)

          if (res.data.success === false) {
            console.log('marker create failed.')
          }
          else {
            this.saveEvent
          }
        })
      } catch (error) {
        console.log('bad connection.')
      }
    }
  }
}
</script>

<style>

input[type="radio"] {
  margin: 3px;
}

#menu-contents label {
  margin: auto;
  width: 80px;
  min-width: fit-content;
  font-size: 14px;
}

#select-category {
  display: flex;
  justify-content: space-around;
  align-content: center;
  text-align: center;
}

#select-category label {
  padding: 0 5px;
  border-radius: 15px;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
}

#select-category input {
  float: left;
}

#fishing {
  border: 2px solid rgb(81, 162, 228);
}
#camping {
  border: 2px solid rgb(96, 81, 228);
}
#gathering {
  border: 2px solid rgb(81, 228, 159);
}
#store {
  border: 2px solid rgb(228, 81, 101);
}
#secret_place {
  border: 2px solid rgb(228, 201, 81);
}


.marker-input {
  margin: 10px 0;
  width: 100%;
  height: 30px;
  border: 2px solid grey;
  border-radius: 5px;
  white-space: normal;
}

.marker-input:focus {
  border: 3px solid rgb(237, 40, 40);
}

.marker-make-button {
  margin: 30px 0;
  width: 80%;
  height: 40px;
  border-radius: 5px;
  color: white;
  background-color: rgb(237, 40, 40);
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  border: 2px solid rgb(237, 40, 40);
  text-align: center;
}

.marker-make-button:hover {
  background-color: rgb(255,255,255);
  color: black;
}

</style>