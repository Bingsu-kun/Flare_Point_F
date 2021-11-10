<template>
  <div id="menu-contents">
    <button class="close" @click="menuCloseEvent"></button>
    <h3> 마커 필터링 </h3>
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
      keyword: '',
      noResult: false,

      filteredMarkers: [],
      throwMarkers: []
    }
  },
  props: ['markers'],
  methods: {
    filtering: function() {
      const keywords = this.keyword.split(' ')
      this.filteredMarkers = []
      this.throwMarkers = []

      this.markers.forEach(element => {
        if (this.keyword === '') {
          this.filteredMarkers.push(element)
        }
        else {
          this.filteredMarkers.push(element)
          for (let key of keywords) {
            if (element.name.indexOf(key) === -1 && element.tags.indexOf(key) === -1){
              this.throwMarkers.push(element)
              this.filteredMarkers.pop()
            }
          }
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
  margin: 0 3px;
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