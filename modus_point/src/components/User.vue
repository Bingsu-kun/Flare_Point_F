<template>
	<div id="user-profile-container">
		<span id="role-image">
		</span>
		<span id="user-properties">
			<h4>{{ Name }}</h4>
			<div>Email: {{ Email }}</div>
			<div>직업: {{ Role }}  받은 좋아요: {{ Likes }}</div>
			<div style="color: grey">직업은 좋아요 수에 따라 변동됩니다</div>
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
}

#user-properties {
	width: fit-content;
	height: 100px;
}

</style>