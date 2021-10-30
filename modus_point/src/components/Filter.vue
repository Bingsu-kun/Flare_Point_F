<template>
  <div id="menu-contents">
    <button class="close" @click="menuCloseEvent"></button>
    <div id="category-name-form" style="margin-top: 40px;">
      <button id="cb-1" class="category-button" @click="categorySelect('fishing',0)"></button>
      <button id="cb-2" class="category-button" @click="categorySelect('camping',1)"></button>
      <button id="cb-3" class="category-button" @click="categorySelect('gathering',2)"></button>
      <button id="cb-4" class="category-button" @click="categorySelect('store',3)"></button>
      <button id="cb-5" class="category-button" @click="categorySelect('secret_place',4)"></button>
    </div>
    <div>
      <button id="cb-6" class="category-button" style="width: 100%; background-color: white" @click="categorySelect('',5)">모든 카테고리</button>
    </div>
    <div id="search-form" style="margin-top: 20px">
      <input class="search-input" :value="keyword" placeholder="다음 내용을 포함" @input="keyword = $event.target.value" @keydown.enter="filtering">
      <button class="search-button" @click="filtering"></button>
    </div>
      <div id="search-result" v-if="!noResult">
        <div @click="selectedEvent(result.latitude,result.longitude)" id="frag" class="filter-result-fragment" v-for="result in filteredMarkers" :key="result.MarkerId">
          
          <div id="marker-name">{{ result.name }}</div>
          <span id="marker-tags" v-for="tag in result.tags.split('#')" :key="tag">{{ tag }}</span>
         
        </div>
      </div>
      <div id="no-search-result" v-if="noResult"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pickedCategory: '',
      keyword: '',
      noResult: false,

      filteredMarkers: [],
      throwMarkers: []
    }
  },
  props: ['markers'],
  methods: {
    filtering: function() {
      const keyword = this.keyword
      const pickedCategory = this.pickedCategory
      this.filteredMarkers = []
      this.throwMarkers = []

      this.markers.forEach(element => {
        if (pickedCategory === '') {
          if (keyword === '') {
            this.filteredMarkers.push(element)
          }
          else {
            if (element.name.indexOf(keyword) !== -1 || element.tags.indexOf(keyword) !== -1) {
              this.filteredMarkers.push(element)
            }
            else {
              this.throwMarkers.push(element.markerId)
            }
          }
        }
        else if (element.category.toLowerCase() === pickedCategory){
          if (keyword === '') {
            this.filteredMarkers.push(element)
          }
          else {
            if (element.name.indexOf(keyword) !== -1 || element.tags.indexOf(keyword) !== -1) {
              this.filteredMarkers.push(element)
            }
            else {
              this.throwMarkers.push(element.markerId)
            }
          }
        }
        else {
          this.throwMarkers.push(element.markerId)
        }
        
      });
      if (this.filteredMarkers.length === 0)
        this.noResult = true
      else
        this.noResult = false
      this.disabling()
    },
    disabling: function() {
      this.$emit('disableMarkers',this.throwMarkers)
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
    },
    selectedEvent: function(Lat,Lng) {
      this.$emit('selectedEvent',Lat,Lng)
    },
    menuCloseEvent: function() {
      this.$emit("menuCloseEvent")
    }
  }
}
</script>
<style>

#marker-name {
  margin: 0;
  font-size: 20px;
}

#marker-tags {
  margin: 0 1px;
  padding: 2px 4px;
  font-size: 10px;
  border: 1px solid rgb(25,75,130);
  border-radius: 10px;
}

.filter-result-fragment {
  margin: 5px 0;
  padding: 5px;
  width: inherit;
  height: fit-content;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
}
.filter-result-fragment:hover {
  background-color: rgba(40,40,40,0.5);
}
</style>