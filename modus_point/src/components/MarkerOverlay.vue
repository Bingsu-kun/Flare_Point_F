<template>
  <div>
    <button class="close" @click="menuCloseEvent"></button>
    <!-- 마커 정보 표시 + 길찾기 버튼 
    마커 이름 name 좋아요 버튼
    만든 날짜 createdAt
    카테고리 category
    내용 description
    태그 tags
    만든 사람 fisherId
    -->
  </div>
</template>

<script>
export default {

  data() {
    return {

    }
  },
  props:['selected'],
  methods: {

    menuCloseEvent: function() {
      this.$emit("menuCloseEvent")
    }

  },


}
</script>

<style>

</style>