<template>
	<div>
		<!-- All Sliders -->
		<div v-for="(slider, index) in sliders" :key="index">
			<VueTinySlider v-bind="slider.options" :class="slider.class">
				<!-- All Images -->
				<div v-for="(img, index) in images" :key="index" class="text-center">
					<img :src="img" class="rounded image">
				</div>
			</VueTinySlider>
		</div>
	</div>
</template>

<script>
	import VueTinySlider from 'vue-tiny-slider'

	export default {
		props: {
			images: {
				type: Array,
				required: true,
			},

			totalOnLg: {
				type: Number,
				default: 4
			},
		},

		components: {
			VueTinySlider
		},

		data() {
			return {
				sliders: [
					// LG
					{
						class: 'd-none d-lg-block my-3',
						options: {
							items: this.totalOnLg,
							gutter: 20,
							nav: false,
							controls: false,
							loop: true,
							autoplay: true,
							autoplayButtonOutput: false,
							autoplayTimeout: 2000,
						},
					},
					// MD
					{
						class: 'd-none d-md-block d-lg-none my-3',
						options: {
							items: this.totalOnLg - 1,
							gutter: 20,
							nav: false,
							controls: false,
							loop: true,
							autoplay: true,
							autoplayButtonOutput: false,
							autoplayTimeout: 2000,
						},
					},
					// SM
					{
						class: 'd-none d-sm-block d-md-none my-3',
						options: {
							items: this.totalOnLg - 2,
							gutter: 20,
							nav: false,
							controls: false,
							loop: true,
							autoplay: true,
							autoplayButtonOutput: false,
							autoplayTimeout: 2000,
						},
					},
					// XS
					{
						class: 'd-block d-sm-none my-3',
						options: {
							items: this.totalOnLg - 3,
							gutter: 20,
							nav: false,
							controls: false,
							loop: true,
							autoplay: true,
							autoplayButtonOutput: false,
							autoplayTimeout: 2000,
						},
					},
				],
				lg: {
					items: this.totalOnLg,
					gutter: 20,
					nav: false,
					controls: false,
					loop: true,
					autoplay: true,
					autoplayButtonOutput: false,
					autoplayTimeout: 2000,
				},
				md: {
					items: this.totalOnLg - 1,
					gutter: 20,
					nav: false,
					controls: false,
					loop: true,
					autoplay: true,
					autoplayButtonOutput: false,
					autoplayTimeout: 2000,
				},
				sm: {
					items: this.totalOnLg - 2,
					gutter: 20,
					nav: false,
					controls: false,
					loop: true,
					autoplay: true,
					autoplayButtonOutput: false,
					autoplayTimeout: 2000,
				},
				xs: {
					items: this.totalOnLg - 3,
					gutter: 20,
					nav: false,
					controls: false,
					loop: true,
					autoplay: true,
					autoplayButtonOutput: false,
					autoplayTimeout: 2000,
				},
			}
		},
	}
</script>

<style lang="scss">
	.image { max-width: 100%; }
</style>