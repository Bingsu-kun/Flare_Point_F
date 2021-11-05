<template>
	<div id="user-profile-container">
		<span id="role-image">
			<img class="profile-img" :src="require('../assets/user.png')">
		</span>
		<span id="user-properties">
			<h3>{{ Name }}</h3>
			<h6>{{ Email }}</h6>
			<div>{{ Role }} - 받은 좋아요: {{ Likes }}</div>
		</span>
	</div>
</template>

<script>
export default {
	data() {
			return {
				Name: sessionStorage.getItem('name'),
				Role: '탐험가',//sessionStorage.getItem('role')
				Email: sessionStorage.getItem('email'),
				Likes: sessionStorage.getItem('likes')
			}
	}

}
</script>

<style>

#role-image {
	width: 100px;
	height: 100px;
	display: flex;
	justify-content: center;
	align-content: center;
}

#user-properties {
	width: fit-content;
	height: 100px;
	display: flex;
	justify-content: center;
	align-content: center;
}

</style>