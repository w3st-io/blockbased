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
					<div class="w-25 float-right text-right">
						<h4 class="text-white m-2">
							{{ upvotes }}
							<span class="ml-2 h2 unliked">♦</span>
						</h4>
					</div>
				</article>
			</li>
		</ul>
	</section>
</template>

<script>
	// [IMPORT] //
	import { EventBus } from '../../main'

	// [EXPORT] //
	export default {
		props: {
			blocks: {
				type: Array,
				required: true
			},

			upvotes: {
				type: Number,
				default: 0
			}
		},

		methods: {
			redirect(block_id) {
				EventBus.$emit('redirect-to-block', block_id)
			}
		}
	}
</script>

<style scoped>
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
		color: rgb(0, 226, 0);
		-webkit-text-stroke-color: rgb(0, 226, 0);
	}
</style>