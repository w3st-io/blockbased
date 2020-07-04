<template>
	<nav class="m-5 fixed-bottom alert shadow fade-in" :class="`alert-${BSColor}`">
		{{ message }}
	</nav>
</template>

<script>
export default {
	props: {
		message: { type: String, required: true, },
		BSColor: { type: String, default: 'primary' },
	}
}
</script>

<style lang="scss" scoped>
		.fade-in {
			opacity: 1;
			animation-name: fadeInOpacity;
			animation-iteration-count: 1;
			animation-timing-function: ease-in;
			animation-duration: 1s;
		}

		@keyframes fadeInOpacity {
			0% { opacity: 0; }
			100% { opacity: 1; }
		}
</style>