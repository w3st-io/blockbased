<template>
	<div>
		<!-- lg -->
		<VueTinySlider v-bind="lg" class="d-none d-lg-block my-3">
			<div v-for="(img, index) in images" :key="index" class="text-center">
				<img :src="img" class="rounded" style="max-width: 100%;">
			</div>
		</VueTinySlider>

		<!-- md -->
		<VueTinySlider v-bind="md" class="d-none d-md-block d-lg-none my-3">
			<div v-for="(img, index) in images" :key="index" class="text-center">
				<img :src="img" class="rounded" style="max-width: 100%;">
			</div>
		</VueTinySlider>

		<!-- sm -->
		<VueTinySlider v-bind="sm" class="d-none d-sm-block d-md-none my-3">
			<div v-for="(img, index) in images" :key="index" class="text-center">
				<img :src="img" class="rounded" style="max-width: 100%;">
			</div>
		</VueTinySlider>

		<!-- xs -->
		<VueTinySlider v-bind="xs" class="d-block d-sm-none my-3">
			<div v-for="(img, index) in images" :key="index" class="text-center">
				<img :src="img" class="rounded" style="max-width: 100%;">
			</div>
		</VueTinySlider>
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
			VueTinySlider,
		},

		data() {
			return {
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