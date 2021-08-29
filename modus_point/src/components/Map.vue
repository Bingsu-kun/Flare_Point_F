<template>
  <div id="map">
  </div>
</template>

<script>

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
      
    }
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
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
          // 지도에 마커를 생성하고 표시한다
          const marker = new kakao.maps.Marker({
            position: mouseEvent.latLng, // 마커의 좌표
            image : markerImage, // 마커의 이미지
            map: map // 마커를 표시할 지도 객체
          });
        });
        // 우클릭시 새로운 마커 생성 표시 후에 리스트로 하여 다른 기능 추가 할 수 있게 
        // 다른 곳 누르면 창 사라짐.
        // 새로운 마커 생성 버튼 누르면 마커 생성 모달 창 띄움
        // 모달창에서 마커 정보 입력후 저장 누르면 서버랑 통신하고 저장 완료.
        
        // 센터 기준으로 어디까지 마커 검색해서 불러올지 로직 작성

        // 마커 클릭시 창 띄워야 되는데 마커 클릭 이벤트 있는지?

        // 모달 창 생성 애니메이션 넣고 싶은데 방법을 찾아보자

        // 온 보딩 튜토리얼 간단하게.
      }
    }
  }
}
</script>

<style>

#map {
  width: 100%;
  height: 95%;
}

</style>