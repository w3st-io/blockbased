<template>
	<div
		class="parallax"
		:style="`
			height: ${height}px;
			background-image: url(${imgURL});
		`"
		v-rellax="{ speed: parallaxNumber }"
	>
		<h1
			v-if="text"
			class="my-auto text-center text-primary nav-spacer"
			style="font-size: 4em;"
		>{{ text }}</h1>
	</div>
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

			text: {
				type: String,
				default: '',
			},

			rellaxNumber: {
				type: Number,
				default: 2,
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

	.nav-spacer {
		padding-top: 220px;
		text-shadow: black 0.05em 0.05em 0.2em;
	}

	@media only screen and (max-width: 991px) { .nav-spacer { padding-top: 280px; } }

	@media only screen and (max-width: 768px) { .nav-spacer { padding-top: 240px; } }
</style>