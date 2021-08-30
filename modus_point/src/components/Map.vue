<template>
  <div id="map" @contextmenu="initMarkerButtonListener">
    <transition name="fade">
      <div id="sm-background" v-if="SHOW_SAVE_MAKER" @click="SHOW_SAVE_MAKER = !SHOW_SAVE_MAKER">
      </div>
    </transition>
    <transition name="fade">
      <div id="sm-foreground" v-if="SHOW_SAVE_MAKER">
        <save-maker v-on:saveEvent="closeMakeWindow"></save-maker>
      </div>
    </transition>
  </div>
</template>

<script>
import SaveMaker from './SaveMaker.vue'

export default {

  name: 'Map',
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initKakaoMap();
    }
    else {
      const script = document.createElement('script');
      script.onload = () => kakao.maps.load(this.initKakaoMap);
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=407b973edfee2735f163d9c7a5c03218'
      document.body.appendChild(script);
    }
  },
  data() {
    return {
      SHOW_SAVE_MAKER: false
    }
  },
  props: ['LOGIN'],
  components: {
    SaveMaker
  },
  methods: {
    // 카카오 맵 초기화 메서드
    initKakaoMap: function() {

      const mapContainer = document.querySelector("#map");
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude
        this.lng = position.coords.longitude
        init(this.lat,this.lng,mapContainer)
      },() => {
        console.log("현재 위치를 파악할 수 없습니다.")
        //강남역
        this.lat = 37.49780947181307
        this.lng = 127.02766764268932
        init(this.lat,this.lng,mapContainer)
      })
  
      function init(lat,lng,mapContainer) {
        const options = {
          center: new kakao.maps.LatLng(lat,lng),
          level: 3
        };
        const map = new kakao.maps.Map(mapContainer, options);

        // 지도 생성
        map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);

        // 지도 타입 변경 컨트롤을 생성한다
        const mapTypeControl = new kakao.maps.MapTypeControl();

        // 지도의 상단 우측에 지도 타입 변경 컨트롤을 추가한다
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 마커 이미지의 주소
        const markerImageUrl = 'https://t1.daumcdn.net/localimg/localimages/07/2012/img/marker_p.png', 
          markerImageSize = new kakao.maps.Size(30, 35), // 마커 이미지의 크기
          markerImageOptions = { 
              offset : new kakao.maps.Point(13, 40)// 마커 좌표에 일치시킬 이미지 안의 좌표
        };

        // 마커 이미지를 생성한다
        const markerImage = new kakao.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOptions);

        // 지도 클릭 이벤트를 등록한다 (좌클릭 : click, 우클릭 : rightclick, 더블클릭 : dblclick)
        // 맵 위 어디든지 좌클릭이 눌릴 시 이미 있는 마커메이커를 없앤다.
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
          const maker = document.querySelector('#marker-maker')
          maker.remove()
        });

        // // 지도에 마커를 생성하고 표시한다
        //   const marker = new kakao.maps.Marker({
        //     position: mouseEvent.latLng, // 마커의 좌표
        //     image : markerImage, // 마커의 이미지
        //     map: map // 마커를 표시할 지도 객체
        //   });

        kakao.maps.event.addListener(map, 'rightclick', function(mouseEvent) {
          let beforeMaker = document.querySelector('#marker-maker')
          if (beforeMaker === null) {
            const markermaker = new kakao.maps.CustomOverlay({
              map: map,
              clickable: true, //커스텀 오버레이 클릭시 지도에 이벤트 전파 방지
              content: '<div id="marker-maker" oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;"><div id="maker-button-list"><button id="marker-button">여기에 마커 만들기</button></div></div>',
              position: new kakao.maps.LatLng(mouseEvent.latLng.Ma,mouseEvent.latLng.La),
              xAnchor: 0,
              yAnchor: 0
            })
          }
          else {
            beforeMaker.remove()
            beforeMaker = new kakao.maps.CustomOverlay({
              map: map,
              clickable: true, //커스텀 오버레이 클릭시 지도에 이벤트 전파 방지
              content: '<div id="marker-maker" oncontextmenu="return false;" ondragstart="return false;" ondrop="return false;"><div id="maker-button-list"><button id="marker-button">여기에 마커 만들기</button></div></div>',
              position: new kakao.maps.LatLng(mouseEvent.latLng.Ma,mouseEvent.latLng.La),
              xAnchor: 0,
              yAnchor: 0
            })
          }
        })
        // 우클릭시 새로운 마커 생성 표시 후에 리스트로 하여 다른 기능 추가 할 수 있게 
        // 새로운 마커 생성 버튼 누르면 마커 생성 모달 창 띄움
        // 모달창에서 마커 정보 입력후 저장 누르면 서버랑 통신하고 저장 완료.
        
        // 센터 기준으로 어디까지 마커 검색해서 불러올지 로직 작성


        // 온 보딩 튜토리얼 간단하게.
      }
    },
    initMarkerButtonListener: function() {
      setTimeout(() => {
        const button = document.querySelector('#marker-button')
        button.addEventListener("click",() => {
          const maker = document.querySelector('#marker-maker')
          maker.remove()
          console.log(this.LOGIN)
          if (this.LOGIN === false) {
            alert('로그인이 필요한 서비스입니다.')
            this.$emit("showLoginForm")
          }
          else {
            this.SHOW_SAVE_MAKER = true
          }
        })
      },100)
    },
    closeMakeWindow: function() {
      this.SHOW_SAVE_MAKER = false
    }
  }
}
</script>

<style>

#map {
  width: 100%;
  height: 95%;
  z-index: 2;
}

#marker-maker {
  padding: 5px;
  width: 100px;
  height: fit-content;
  background-color: rgb(44, 44, 44);
  border-radius: 5px;
  z-index: 3;
  -webkit-animation: make-in 0.2 ease-out alternate both;
  animation: make-in 0.2s ease-out alternate both;
}

#maker-button-list {
  width: 100%;
  height: fit-content;
}

#marker-button {
  width: 100%;
  height: 20px;
  border-radius: 5px;
  background-color: white;
  overflow: hidden;
}

.make-marker-enter-active {
  -webkit-animation: make-in 0.2s ease-out;
  animation: make-in 0.2s ease-out;
}

</style>