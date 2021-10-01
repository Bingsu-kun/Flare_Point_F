<template>
  <div id="menu-contents">
    <div id="categoty-name-form">
      <select id="category-selector" name="category" v-model="pickedCategory">
        <option value="">카테고리</option>
        <option value="fishing">낚시</option>
        <option value="camping">캠핑</option>
        <option value="gathering">채집</option>
        <option value="store">특별한가게</option>
        <option value="secret_place">나만의장소</option>
      </select>
      <span id="private-selector">나만보기<input type="checkbox" name="isPrivate" v-model="isPrivate"></span>
    </div>
    <div id="maker-body">
      <input class="marker-input" placeholder="마커의 이름을 적어주세요" :value="markerName" @input="markerName = $event.target.value">
      <textarea id="description" :value="description" @input="description = $event.target.value" @keyup="checklength" class="marker-input" placeholder="마커를 설명해 주세요 (최대 100자)" style="height: 200px; resize: none; word-break: break-all; text-overflow: clip;"></textarea>
      <p v-if="DescOver" style="color: rgb(237,40,40)" >최대 100자 까지만 가능합니다!</p>
      <input class="marker-input" placeholder="마커를 대표할 태그를 적어주세요 (최대 10개)" style="font-size: 12px;" :value="tagString" @input="tagString = $event.target.value">
    </div>
    <button @click="saveMarker" class="marker-make-button">저장</button>
  </div>
</template>

<script>
import axios from 'axios'
import getCookie from '../getCookie.js'

export default {
  data() {
    return {
      pickedCategory: '',
      markerName: '',
      description: '',
      tagString: '',
      isPrivate: false,

      DescOver: false,

      savedMarker: ''
    }
  },
  props: ['latitude', 'longitude'],
  methods: {
    saveEvent: function() {
      this.$emit('saveEvent', this.pickedCategory, this.savedMarker)
    },
    // description 100자 제한. (not byte)
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

      let name = this.markerName
      const latitude = this.latitude
      const longitude = this.longitude
      const isPrivate = this.isPrivate
      const category = this.pickedCategory
      const tagString = this.tagString
      let description = this.description

      if (name === '') {
        const userInfo = sessionStorage.getItem("name")
        name = `${userInfo}님의 마커`
      }
      if (description === '') {
        description = '내용이 없습니다.'
      }
      if (category === '') {
        alert('카테고리를 선택해 주세요!')
        const category = document.getElementById("#category-selector")
        category.style.borderColor('#ED2828')
      }
      else {
        try {
          const refreshCookie = getCookie('refreshToken')
          await axios({
            method: 'POST',
            url: 'http://localhost:8080/marker/create',
            headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
            data: { name: name, latitude: latitude, longitude: longitude, isPrivate: isPrivate, category: category, tagString: tagString, description: description },
            withCredentials: true
          }).then((res) => {

            if (res.data.success === false) {
              console.log('marker create failed.' + res.date.response)
            }
            else {
              this.savedMarker = res.data.response
              this.saveEvent()
            }
          })
        } catch (error) {
          console.log('bad connection.' + error)
        }
      }
    }
  }
}
</script>

<style>

#categoty-name-form {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-between ;
}

#category-selector {
  padding: 1px 2px;
  width: 120px;
  height: 34px;
  border: 2px solid grey;
  border-radius: 5px;
  display: inline-flex;
  justify-content: center;
  text-align: center;
}

#private-selector {
  font-size: 14px;
  width: 80px;
  height: 30px;
  border: 2px solid grey;
  border-radius: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

#maker-body {
  width: 100%;
  height: 80%;
}

.marker-input {
  margin: 10px 0;
  width: inherit;
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