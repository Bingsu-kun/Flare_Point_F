<template>
	<div id="user-profile-container">
		<div id="role-image">
			<img class="profile-img" :src="require('../assets/user.png')">
		</div>
		<div id="user-properties">
			<div>{{ Name }}</div>
			<div>{{ Email }}</div>
			<div>받은 좋아요: {{ Likes }}</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {

	mounted() {
		this.getReceivedLikes()
	},
	data() {
			return {
				Name: sessionStorage.getItem('name'),
				Email: sessionStorage.getItem('email'),
				Likes: sessionStorage.getItem('likes')
			}
	},
	methods: {
		getReceivedLikes: async function() {
      try {
        await axios({
          method: 'GET',
          url: 'http://3.34.252.182:8080/marker/mylikecount',
          headers: { Authorization: `Bearer ${sessionStorage.getItem('apiToken')}` },
          withCredentials: true
        }).then((res) => {

          if (res.data.success === false) {
            console.log('get received likes failed.')
          }
          else {
            sessionStorage.setItem("likes", res.data.response)
          }
        })
      } catch (error) {
        this.logout()
      }
    }
	},
	logout: function() {
		this.$emit("logout")
	}
}
</script>

<style>

#user-profile-container {
	width: calc(100%-20px);
	height: calc(100%-20px);
	padding: 20px;
}

#role-image {
	width: 100px;
	height: 100px;
}

#role-image img {
	width: 100%;
	height: 100%;
}

#user-properties {
	width: fit-content;
	height: 100px;
}

</style>