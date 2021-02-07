<template>
	<div
		class="parallax"
		:style="`
			height: ${height}px;
			background-image: url(${imgURL});
		`"
		v-rellax="{ speed: 2 }"
	></div>
</template>

<script>
	export default {
		props: {
			imgURL: {
				required: true,
			},

			height: {
				default: 400,
			},
		},
	}
</script>

<style lang="scss" scoped>
	.parallax {
		/* Set a specific height */
		//min-height: 500px;
		//max-height: 600px;
		height: 400px;

		/* Create the parallax scrolling effect */
		background-attachment: fixed;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	/* Turn off parallax scrolling for all tablets and phones. Increase/decrease the pixels if needed */
	@media only screen and (max-device-width: 320px) {
		.parallax { background-attachment: scroll; }
	}
</style>