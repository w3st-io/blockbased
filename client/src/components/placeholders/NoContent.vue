<template>
	<div class="text-center">
		<h1 class="text-light">There is no {{ contentName }} yet</h1>
		<img :src="require('../../assets/images/blockchain.svg')" class="w-25">
	</div>
</template>

<script>
	export default {
		props: {
			contentName: { type: String, default: 'content' }
		}
	}
</script>