<template>
    <div id="my-markers-container">
        <!--
        무한 스크롤 내부 수정 필요.
        <div @click="searchSelectedEvent(result.y,result.x)" id="frag" class="search-result-fragment" v-for="result in searchResults" :key="result.id">
            <div id="place-name">{{ result.place_name }}</div>
            <div id="place-address">
            <span style="margin-bottom: 5px;">{{ result.road_address_name }}</span>
            <span>(지번) {{ result.address_name }}</span>
            </div>
            <div id="place-phone">{{ result.phone }}</div>
        </div>
        <img v-if="noResult" id="NO-RESULT" alt="no-result">

        -->
  </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: ['myMarkers'],
    methods: {
        
    }

}
</script>

<style>

</style>