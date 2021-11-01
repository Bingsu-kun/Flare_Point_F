<template>
  <div id="menu-contents">
    <div id="category-name-form">
      <button id="cb-1" class="category-button" @click="categorySelect('fishing',0)"></button>
      <button id="cb-2" class="category-button" @click="categorySelect('camping',1)"></button>
      <button id="cb-3" class="category-button" @click="categorySelect('gathering',2)"></button>
      <button id="cb-4" class="category-button" @click="categorySelect('store',3)"></button>
      <button id="cb-5" class="category-button" @click="categorySelect('secret_place',4)"></button>
    </div>
    <div id="maker-body">
      <input class="marker-input" placeholder="마커의 이름을 적어주세요" :value="markerName" @input="markerName = $event.target.value">
      <textarea id="description" :value="description" @input="description = $event.target.value" @keyup="checklength" class="marker-input" placeholder="마커를 설명해 주세요 (최대 100자)" style="height: 200px; resize: none; word-break: break-all; text-overflow: clip;"></textarea>
      <p v-if="DescOver" style="color: rgb(237,40,40)" >최대 100자 까지만 가능합니다!</p>
      <input class="marker-input" placeholder="최대 10개까지 태그를 적어주세요 ex) #차박#낚시#바베큐" style="font-size: 12px;" :value="tagString" @input="tagString = $event.target.value">
    </div>
    <span id="private-selector">나만보기<input type="checkbox" name="isPrivate" v-model="isPrivate"></span>
    <button @click="saveMarker" class="marker-make-button">저장</button>
  </div>
</template>

<script>
import axios from 'axios'
import refresh from '../getRefreshedToken.js'

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
      this.$emit('saveEvent', this.savedMarker)
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
      if (category === '') {
        alert('마커를 선택해 주세요!')
        const categoryBox = document.querySelector('#category-name-form')
        categoryBox.style.borderColor = '#ED2828'
      }
      else {
        try {
          await axios({
            method: 'POST',
            url: 'http://3.34.252.182:8080/marker/create',
            headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
            data: { name: name, latitude: latitude, longitude: longitude, isPrivate: isPrivate, category: category, tagString: tagString, description: description },
            withCredentials: true
          }).then((res) => {

            if (res.data.success === false) {
              console.log('marker create failed.' + res.data.response)
            }
            else {
              this.savedMarker = res.data.response
              sessionStorage.setItem("apiToken", refresh(res.headers))
              this.saveEvent()
            }
          })
        } catch (error) {
          console.log('bad connection.' + error)
        }
      }
    },
    categorySelect: function(category,index) {
      this.pickedCategory = category
      const buttons = document.querySelectorAll('.category-button')
      let cnt = 0
      for (let btn of buttons) {
        if (cnt === index) {
          btn.style.backgroundColor = 'white'
        }
        else {
          btn.style.backgroundColor = 'darkgrey'
        }
        cnt += 1
      }
    }
  }
}
</script>

<style>

#category-name-form {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-between ;
  border: 2px solid white;
  border-radius: 5px;
}

.category-button {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: 2px solid grey;
  background-color: darkgray;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  transition-duration: 0.3s;
}

.category-button:hover {
  background-color: white;
}

#cb-1 { background-image: url("../assets/fishing_marker.png");}
#cb-2 { background-image: url("../assets/camping_marker.png");}
#cb-3 { background-image: url("../assets/gathering_marker.png");}
#cb-4 { background-image: url("../assets/store_marker.png");}
#cb-5 { background-image: url("../assets/secret_place_marker.png");}

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