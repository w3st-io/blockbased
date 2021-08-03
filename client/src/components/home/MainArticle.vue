<template>
	<!-- Main Article -->
	<BCard bg-variant="dark" border-variant="secondary" class="mb-2 card" no-body>
		<a :href="news.url">
			<BRow>
				<BCol cols="12" md="7">
					<img
						:src="news.image"
						alt=""
						class="w-100 rounded-left main-img"
					>
				</BCol>

				<BCol cols="12" md="5" class="">
					<div class="w-100 p-3">
						<h6 class="text-primary">{{ news.headline }}</h6>
						<p class="mb-2 text-light">
							{{
								news.summary.length > 200 ?
									news.summary.substring(0, 200 - 3) + '...' :
									news.summary
							}}
						</p>
						<p class="text-secondary">
							{{ new Date(news.datetime * 1000).toLocaleString() }}
						</p>
					</div>
				</BCol>
			</BRow>
		</a>
	</BCard>
</template>

<script>
	export default {
		props: {
			news: {
				type: Object,
				required: true,
			}
		},
	}
</script>

<style lang="scss" scoped>
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