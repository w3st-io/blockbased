<template>
	<BContainer fluid class="p-0">
		<BRow>
			<!-- Left Button -->
			<BCol cols="2" md="1" class="mb-0 text-left">
				<BButton
					variant="outline-primary"
					id="prevButton"
					class="w-100 h-100 p-0 text-primary"
					pill
				><ArrowLeftIcon class="m-auto" /></BButton>
			</BCol>

			<!-- All Sliders -->
			<BCol cols="8" md="10" class="my-slider">
				<!-- Tiny Slider -->
				<VueTinySlider
					v-bind="options"
					ref="slider"
					class="vts"
					style="height: 380px;"
				>
					<div
						v-for="(slide, i) in slides"
						:key="i"
						class="h-100"
					>
						<a :href="slide.url">
							<BCard
								:img-src="slide.image"
								img-alt=""
								img-top
								bg-variant="dark"
								text-variant="light"
								border-variant="secondary"
								class="h-100 card"
							>
								<BCardText>
									<h6 class="text-primary">
										{{
											slide.headline.length > 80 ?
												slide.headline.substring(0, 80 - 3) + '...' :
												slide.headline
										}}
									</h6>
									
									<h6 class="text-secondary">
										{{
											new Date(slide.datetime * 1000).toLocaleString()
										}}
									</h6>
								</BCardText>
							</BCard>
						</a>
					</div>
				</VueTinySlider>
			</BCol>

			<!-- Right Button -->
			<BCol cols="2" md="1" class="mb-0 text-right">
				<BButton
					variant="outline-primary"
					id="nextButton"
					class="w-100 h-100 p-0 text-primary"
					pill
				><ArrowRightIcon class="m-auto" /></BButton>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import { ArrowLeftIcon, ArrowRightIcon } from 'vue-feather-icons'
	import VueTinySlider from 'vue-tiny-slider'

	export default {
		props: {
			slides: {
				type: Array,
				required: true
			}
		},

		components: {
			ArrowLeftIcon,
			ArrowRightIcon,
			VueTinySlider,
		},

		data() {
			return {
				window: {
					width: 0,
					height: 0
				},

				options: {
					container: '.my-slider',
					items: 1,
					gutter: 0,
					nav: false,
					controls: true,
					prevButton: '#prevButton',
					nextButton: '#nextButton',
					loop: true,
					autoplay: true,
					autoplayButtonOutput: false,
					autoplayTimeout: 5000,
				},
			}
		},

		methods: {
			handleResize() {
				this.window.width = window.innerWidth;
				this.window.height = window.innerHeight;

				// Extra small devices (portrait phones, less than 576px)
				if (this.window.width > 575.98) {
					this.options.items = 1
					this.options.gutter = 5
				}

				// Small devices (landscape phones, less than 768px)
				if (this.window.width > 767.98) {
					this.options.items = 2
					this.options.gutter = 8
				}

				// Medium devices (tablets, less than 992px)
				if (this.window.width > 991.98) {
					this.options.items = 3
					this.options.gutter = 10
				}

				// Medium devices (tablets, less than 992px)
				if (this.window.width > 1200) {
					this.options.items = 3
					this.options.gutter = 15
				}
			},
		},

		created() {
			window.addEventListener('resize', this.handleResize)
			this.handleResize()
		},

		destroyed() {
			window.removeEventListener('resize', this.handleResize)
		},
	}
</script>

<style lang="scss" scoped>
	@import '../../assets/styles/bootstrap-override.scss';

	.image {
		max-width: 100%;

		&:hover {
			@extend .shadow;
		}
	}

	.card {
		&:hover {
			background-color: rgba(255, 255, 255, 0.15) !important;
		}
	}

	img {
		background-image: url(
			'https://awlights.com/wp-content/uploads/sites/31/2017/05/placeholder_featured_image.svg'
		);
		min-height: 177px;
	}
</style>