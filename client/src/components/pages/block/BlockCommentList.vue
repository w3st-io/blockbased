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
							<img src="../../../assets/images/placeholder.png" class="m-auto w-75 rounded-lg">
						</div>
						
						<p class="m-0 text-center text-light small">
							{{ commentDetail.email }}
						</p>
					</div>

					<!-- Comment Section -->
					<div class="float-right p-2" style="flex-grow: 1; width: 77%;">
						<p v-html="commentDetail.comment" class="m-0 text-light multiline"></p>
					</div>

					<!-- Votes Section -->
					<div class="float-right text-center bg-info" style="flex-grow: 1; width: 8%;">
						<p class="m-0 text-white">
							
							<button
								class="p-0 btn unliked-up"
								style="font-size: 2em;"
							>▲</button>

							<span class="m-0 p-0">
								<h4 class="m-0 p-1">{{ upvotes }}</h4>
							</span>

							<button
								class="p-0 btn unliked-down"
								style="font-size: 2em;"
							>▼</button>
						</p>
					</div>
				</article>

				<!-- Time Stamp -->
				<div class="w-100 p-2 d-flex border-top border-secondary text-light">
					<div class="m-0 w-75 float-left small text-secondary">
						{{ new Date(commentDetail.createdAt) }}
						- {{ commentDetail._id }}
						
					</div>
					<div class="m-0 w-25 float-right small text-right text-secondary">
						<button v-if="owned()" class="py-0 btn btn-sm text-secondary">edit</button>
						<button v-if="owned()" class="py-0 btn btn-sm text-danger">delete</button>
						<button class="py-0 btn btn-sm text-danger">report</button>
					</div>
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

		methods: {
			owned() {
				return false
			},
		}
	}
</script>

<style lang="scss" scoped>
	$green: #00e200;
	$red: #e20000;
	$white: #ffffff;
	$clear: #00000000;

	li { list-style: none; }
	li:nth-child(even) { background: #42484e !important; }

	// Make Comments Wordwrapped
	.multiline { white-space: pre-wrap; }

	/* Up Vote */
	.unliked-up { color: $white }
	.unliked-up:hover {
		color: $green;
		-webkit-text-stroke-color: $green;
	}

	.liked-up {
		color: $green;
		-webkit-text-stroke-color: $green;
	}

	/* Down Vote */
	.unliked-down { color: $white }
	.unliked-down:hover {
		cursor: pointer;
		color: $red;
		-webkit-text-stroke-color: $red;
	}

	.liked-down {
		cursor: pointer;
		color: $green;
		-webkit-text-stroke-color: $green;
	}
</style>