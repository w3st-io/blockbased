<template>
	<div class="text-center">
		<h1 class="text-light">{{ text }}</h1>
		<img :src="require('../../assets/images/blockchain.svg')" class="w-25">
	</div>
</template>

<script>
	export default {
		props: {
			text: { type: String, default: 'there is no content yet' }
		}
	}
</script>