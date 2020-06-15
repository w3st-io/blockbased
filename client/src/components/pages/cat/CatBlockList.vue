<template>
	<section>
		<ul class="w-100 m-0 px-0 border border-secondary">
			<li
				class="m-0 bg-dark"
				v-for="(block, index) in blocks"
				:key="index"
			>
				<article
					class="d-inline-block w-100"
					@click="redirect(block._id)"
				>
					<!-- Title --> 
					<div class="w-75 p-2 float-left" >
						<h5 class="text-light">
							{{ block.title }}
						</h5>
						<p class="m-0 small text-secondary">
							<span class="text-light">{{ block.email }}</span>
							- {{ block.createdAt }}
						</p>
					</div>

					<!-- Vote -->
					<div class="w-25 float-right text-right">
						<h4 class="text-white m-2">
							{{ block.voteCount }}
							<span
								class="ml-2 h2 unliked"
								:class="{ 'liked': searchForUsersLike(block.voters) }"
							>♦</span>
						</h4>
					</div>
				</article>
			</li>
		</ul>
	</section>
</template>

<script>
	// [IMPORT] //
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		props: {
			username: {
				type: String,
				required: true
			},

			blocks: {
				type: Array,
				required: true
			},
		},

		methods: {
			redirect(block_id) {
				EventBus.$emit('redirect-to-block', block_id)
			},

			searchForUsersLike(block_voters) {
				let found = block_voters.find((voter) => (
					voter.username == this.username
				))

				if (found) { return true }
				else { return false }
			}
		}
	}
</script>

<style lang='scss' scoped>
	$green: rgb(0, 226, 0);

	li { list-style: none; }

	li { background: #343a40 !important; }
	li:nth-child(even) { background: #42484e !important; }

	li:hover { background: rgb(67, 72, 117) !important; }
	li:nth-child(even):hover { background: rgb(67, 72, 117) !important; }

	.unliked {
		color: rgba(0, 0, 0, 0);
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: rgb(255, 255, 255);
	}
	.unliked:hover {
		cursor: pointer;
		color: $green;
		-webkit-text-stroke-color: $green;
	}

	.liked {
		cursor: pointer;
		color: $green;
		-webkit-text-stroke-color: $green;
	}
	.liked:hover {
		cursor: pointer;
		color: rgba(0, 0, 0, 0);
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: rgb(255, 255, 255);
	}
</style>