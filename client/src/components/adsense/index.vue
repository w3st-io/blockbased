<template>
	<BCard bg-variant="dark">
		<div
			v-html="adsenseContent"
			id="ads-goes-here"
			style="background: #1d1f29; padding-top: 60px; text-align: center;"
		></div>
	</BCard>
</template>

<script>
	export default {
		data() {
			return {
				adsenseContent: '',
			}
		},

		mounted() {
			this.adsenseContent = document.getElementById(
				'div-adsense'
			).innerHTML
		}
	}
</script>