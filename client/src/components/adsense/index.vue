<template>
	<div
		v-html="adsenseContent"
		id="ads-goes-here"
		style="adholder"
	></div>
</template>

<script>
	export default {
		data() {
			return {
				adsenseContent: '',
			}
		},

		created() {
			this.adsenseContent = document.getElementById('div-adsense').innerHTML
		}
	}
</script>

<style lang="scss" scoped>
	.adholder {
		background: #1d1f29;
	}
</style>