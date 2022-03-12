import { createApp } from 'vue'
import App from './App.vue'

const script = document.createElement('script')

script.id = 'kakaoScript'
script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=12658ca88c9c540ede74d413df66f251&libraries=services'
document.body.appendChild(script);

createApp(App).mount('#app')
