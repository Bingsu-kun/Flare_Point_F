<template>
  <div id="search-container">
    <h3> 지역 검색 </h3>
    <div id="search-form">
      <input class="search-input" :value="keyword" @input="keyword = $event.target.value" placeholder="검색어를 입력해 주세요." @keydown.enter="search">
      <button class="search-button" @click="search"></button>
    </div>
    <div id="search-result">
      <div @click="selectedEvent(result.y,result.x)" id="frag" class="search-result-fragment" v-for="result in searchResults" :key="result.id">
        <div id="place-name">{{ result.place_name }}</div>
        <div id="place-address">
          <span style="margin-bottom: 5px;">{{ result.road_address_name }}</span>
          <span>(지번) {{ result.address_name }}</span>
        </div>
        <div id="place-phone">{{ result.phone }}</div>
      </div>
      <img v-if="noResult" id="NO-RESULT" alt="no-result">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyword: '',
      searchResults: [],
      noResult: false
    }
  },
  methods: {
    search: function() {
      const searchResult = new kakao.maps.services.Places()
      const keyword = this.keyword
      this.searchResults = []
      let result = this.searchResults
      let no = this.noResult
      if (keyword !== '' && keyword.length > 1)
        searchResult.keywordSearch( keyword, placeSearched )
      
      function placeSearched(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {

          for ( let i = 0; i < data.length; i++ ) {
            result.push({ id: data[i].id, x: data[i].x, y: data[i].y, place_name: data[i].place_name, road_address_name: data[i].road_address_name, address_name: data[i].address_name, phone: data[i].phone })
          }
          setTimeout(() => {
            observeChild(io,pagination)
          },1000)
          
          const observerOption = {
            root: null,
            rootMargin: "0px 0px 0px 0px",
            threshold: 0.5
          }

          const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                if (pagination.hasNextPage){
                  pagination.nextPage()
                  observer.unobserve(entry.target)
                  observeChild(observer)
                }
              }
            })
          }, observerOption)
        
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

            //검색 결과 없을 때
            no = true

        } else if (status === kakao.maps.services.Status.ERROR) {

            alert('검색 중 오류가 발생했습니다.');

        }
      }

      //관측 요소 갱신 함수
      function observeChild(intersectionObserver,pagination) {
        const resultChilds = document.querySelectorAll("#frag")
        resultChilds.forEach(el => {
          if (!el.nextElementSibling) {
            intersectionObserver.observe(el)
          } else {
            intersectionObserver.disconnect()
          }
        })
      }
    },
    selectedEvent: function(Lat,Lng) {
      this.$emit("selectedEvent",Lat,Lng)
    }
  }

}
</script>

<style>

#search-container {
  padding: 30px 20px;
  height: 100%;
}

#search-form {
  margin: 20px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

#search-result {
  margin: 17px 0;
  height: 80%;
  text-align: left;
  overflow: overlay;
  overflow-x: hidden;
}

#place-name {
  font-size: 20px;
}

#place-address {
  color:gray;
  font-size: 12px;
}
#place-address span {
  margin-right: 10px;
}

#place-phone {
  color: royalblue;
  font-size: 12px;
}

.search-input {
  padding: 0 5px;
  width: 80%;
  height: 30px;
  border: 2px solid grey;
  border-radius: 5px;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
}
.search-input:focus {
  border: 2px solid blueviolet
}

.search-button {
  padding: 0;
  width: 30px;
  height: 30px;
  border: 2px solid blueviolet;
  border-radius: 100%;
  background-color: white;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
}
.search-button:hover {
  border: 0;
  background-color: blueviolet;
}

.search-result-fragment {
  margin: 5px 0;
  padding: 10px;
  width: inherit;
  height: fit-content;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
}
.search-result-fragment:hover {
  background-color: rgba(40,40,40,0.5);
}
</style>