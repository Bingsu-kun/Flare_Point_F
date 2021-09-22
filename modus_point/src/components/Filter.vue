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
      <input class="search-input" v-model="keyword" placeholder="다음 내용을 포함">
      <button class="search-button" @click="search"></button>
    </div>
        <!--
      무한스크롤
      -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      pickedCategory: '',
      keyword: ''
    }
  }
}
</script>
<style>
  
</style>