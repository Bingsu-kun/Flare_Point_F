<template>
  
</template>

<script>
export default {

  props: ['name','address','tags','isLiked','likes','latitue','longitude']

}
</script>

<style>

</style>

<!-- 이거 다음 할 일
1.getLikedMarkers, getMyMarkers 함수 App.vue 로그인 됬을 때만 실행되는지 체크.
모든 LikedMarkers, MyMarkers 참조 sessionStorage를 통하는지 체크

2.이 컴포넌트 완성.

3. MyMarker 완성. 

4. SaveMaker 리모델링.

5. MarkerOverlay 리모델링. (마커 수정 기능 추가)

6. User 리모델링. (Fisher 엔티티에 프사 추가 찾아보기) -->