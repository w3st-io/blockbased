<template>
	<section>
		<ul class="w-100 m-0 px-0 border border-secondary">
			<li
				v-for="commentDetail in commentDetails"
				:key="commentDetail._id"
				class="w-100 border-bottom-0 border-secondary"
			>
				<article class="w-100 d-flex">
					<!-- Image Section -->
					<div class="float-left p-2 border-right border-secondary" style="width: 15%;">
						<div class="w-100 text-center">
							<img src="../../assets/images/placeholder.png" class="m-auto w-75 rounded-lg">
						</div>
						
						<p class="m-0 text-center text-light small">
							{{ commentDetail.email }}
						</p>
					</div>

					<!-- Comment Section -->
					<div class="float-right p-2" style="flex-grow: 1; width: 77%;">
						<p class="m-0 text-light">
							{{ commentDetail.comment }}
						</p>
					</div>

					<!-- Votes Section -->
					<div class="float-right text-center" style="flex-grow: 1; width: 8%;">
						<p class="m-0 pt-3 text-white">
							<span class="h4">{{ upvotes }}</span><br>
							<span class="h2 unliked">♦</span>
						</p>
					</div>
				</article>

				<!-- Time Stamp -->
				<div class="w-100 p-2 border-top border-bottom border-secondary text-light">
					<p class="m-0 small text-secondary">
						{{ new Date(commentDetail.createdAt) }}
						- {{ commentDetail._id }}
					</p>
				</div>
			</li>
		</ul>
	</section>
</template>

<script>
	// [IMPORT] Personal //

	// [EXPORT] //
	export default {
		props: {
			commentDetails: {
				type: Array,
				required: true
			},

			upvotes: {
				type: Number,
				default: 0
			},
		},
	}
</script>

<style scoped>
	li { list-style: none; }
	li:nth-child(even) { background: #42484e !important; }

	.unliked {
		color: rgba(0, 0, 0, 0);
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: rgb(255, 255, 255);
	}
	.unliked:hover {
		cursor: pointer;
		color: rgb(0, 226, 0);
		-webkit-text-stroke-color: rgb(0, 226, 0);
	}

	.liked {
		cursor: pointer;
		color: rgb(0, 226, 0);
		-webkit-text-stroke-color: rgb(0, 226, 0);
	}
</style>