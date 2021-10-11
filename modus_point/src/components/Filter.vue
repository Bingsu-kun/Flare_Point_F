<template>
  <div id="menu-contents">
    <div id="select-category" style="margin-bottom: 10px;">
      <label id="fishing"><input type="radio" name="category" value="fishing" v-model="pickedCategory">낚시</label>
      <label id="camping"><input type="radio" name="category" value="camping" v-model="pickedCategory">캠핑</label>
      <label id="gathering"><input type="radio" name="category" value="gathering" v-model="pickedCategory">채집</label>
    </div>
    <div id="select-category" style="margin-top: 10px; margin-bottom: 20px">
      <label id="store"><input type="radio" name="category" value="store" v-model="pickedCategory">특별한가게</label>
      <label id="secret_place"><input type="radio" name="category" value="secret_place" v-model="pickedCategory">나만의장소</label>
    </div>
    <div id="search-form" style="margin-top: 20px">
      <input class="search-input" v-model="keyword" placeholder="다음 내용을 포함" @keydown.enter="filtering">
      <button class="search-button" @click="search"></button>
    </div>
      <div id="search-result">
        <div @click="searchSelectedEvent(result.y,result.x)" id="frag" class="search-result-fragment" v-for="result in filteredMarkers" :key="result.MarkerId">
          <!-- 무한 스크롤 내부 수정 필요 
          <div id="place-name">{{ result.name }}</div>
          <div id="place-tags">
            <span style="margin-bottom: 5px;">{{ result.road_address_name }}</span>
            <span>(지번) {{ result.address_name }}</span>
          </div>
          <div id="place-phone">{{ result.phone }}</div>
          -->
        </div>
        <img v-if="noResult" id="NO-RESULT" alt="no-result">
      </div>
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
      const markers = this.markers
      const keyword = this.keyword
      const pickedCategory = this.pickedCategory

      markers.array.forEach(element => {

        if (element.category.toLowerCase() === pickedCategory){
          if (keyword === '') {
            this.filteredMarkers.add(element)
          }
          else {
            if (keyword in element.name || keyword in element.tagString) {
              this.filteredMarkers.add(element)
            }
            else {
              this.throwMarkers.add(element)
            }
          }
        }
        else {
          this.throwMarkers.add(element)
        }
        
      });

      this.disabling()
    },

    disabling: function() {
      this.$emit('disableMarkers',this.throwMarkers)
    }
  }
}
</script>
<style>
  
</style>