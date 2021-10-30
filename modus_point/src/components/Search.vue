<template>
  <div id="search-container">
    <h3> 지역 검색 </h3>
    <button class="close" @click="menuCloseEvent"></button>
    <div id="search-form">
      <input class="search-input" :value="keyword" @input="keyword = $event.target.value" placeholder="검색어를 입력해 주세요." @keydown.enter="search">
      <button class="search-button" @click="search"></button>
    </div>
    <div id="search-result" v-if="!noResult">
      <div @click="selectedEvent(result.y,result.x)" id="frag" class="search-result-fragment" v-for="result in searchResults" :key="result.id" >
        <div id="place-name">{{ result.place_name }}</div>
        <div id="place-address">
          <span style="margin-bottom: 5px;">{{ result.road_address_name }}</span>
          <span>(지번) {{ result.address_name }}</span>
        </div>
        <div id="place-phone">{{ result.phone }}</div>
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
      searchResults: [],
      noResult: false
    }
  },
  methods: {
    search: function() {
      const searchResult = new kakao.maps.services.Places()
      const keyword = this.keyword
      this.searchResults = []
      let noResult = this.noResult
      let result = this.searchResults
      if (keyword !== '' && keyword.length > 1)
        searchResult.keywordSearch( keyword, placeSearched )
      
      function placeSearched(data, status, pagination) {
        console.log(data)
        if (status === kakao.maps.services.Status.OK) {

          for ( let i = 0; i < data.length; i++ ) {
            result.push({ id: data[i].id, x: data[i].x, y: data[i].y, place_name: data[i].place_name, road_address_name: data[i].road_address_name, address_name: data[i].address_name, phone: data[i].phone })
          }
          setTimeout(() => {
            observeChild(io,pagination)
          },1000)
          
          const observerOption = {
            rootMargin: "100px",
            threshold: 1
          }

          const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                observer.unobserve(entry.target)
                if (pagination.hasNextPage){
                  pagination.nextPage()
                  observeChild(observer)
                }
              }
            })
          }, observerOption)
        
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

          //검색 결과 없을 때
          noResult = true

        } else if (status === kakao.maps.services.Status.ERROR) {

          alert('검색 중 오류가 발생했습니다.');

        }
      }

      //관측 요소 갱신 함수
      function observeChild(intersectionObserver,pagination) {
        const resultChilds = document.querySelectorAll("#frag")
        resultChilds.forEach((el) => {
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
    },
    menuCloseEvent: function() {
      this.$emit("menuCloseEvent")
    }
  }

}
</script>

<style>

.close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 20px;
  height: 20px;
  border: none;
  background-color: transparent;
  background-image: url("../assets/close.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transition-duration: 0.3s;
}

.close:hover {
  width: 25px;
  height: 25px;
}

#search-container {
  padding: 0 20px;
  height: 100%;
}

#search-form {
  margin: 20px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

#search-result {
  height: 80%;
  text-align: left;
  overflow: overlay;
  overflow-x: hidden;
}

#no-search-result {
  width: inherit;
  height: 400px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('../assets/not_found.png');
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
  color: rgb(25,75,130);
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
  border: 2px solid rgb(25,75,130);
}

.search-button {
  padding: 0px;
  width: 30px;
  height: 30px;
  border: 2px solid rgb(25,75,130);
  border-radius: 100%;
  background-color: white;
  background-image: url("../assets/search.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
}
.search-button:hover {
  border: 0;
  background-color: rgb(25,75,130);
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