<template>
	<article class="row">
		<section class="col-12">
			<ul
				v-if="!loading && blocks != ''"
				class="m-0 px-0 border border-secondary"
			>
				<li
					v-for="(block, index) in blocks"
					:key="index"
					class="row m-0 bg-dark"
				>
					<!-- Title --> 
					<div
						class="
							col-lg-9
							col-md-8
							col-sm-8
							col-xs-8
							col-8
							p-2
						"
						@click="redirectToBlock(block._id)"
					>
						<h5 class="text-light">{{ block.title }}</h5>
						<p class="m-0 small text-secondary">
							<span v-if="block.user.username" class="text-light">
								{{ block.user.username }}
							</span>
							- {{ block.createdAt }}
						</p>
					</div>

					<!-- Total Comments -->
					<div
						class="
							col-lg-2
							col-md-2
							col-sm-2
							col-xs-3
							col-4
							p-2
							text-center
						" 
						@click="redirectToBlock(block._id)"
					>
						<p class="pb-0 m-0 align-self-center text-light">
							<span class="m-0">
								<p class="h4 m-0">
									{{ block.commentCount }}
								</p>
								<span>Comments</span>
							</span>
						</p>
					</div>

					<!-- Like -->
					<div
						class="
							col-lg-1
							col-md-2
							col-sm-2
							p-2
							text-center
						"
						@click="redirectToBlock(block._id)"
					>
						<h4 class="m-0 text-white">
							<button
								:disabled="disabled"
								@click.prevent.stop="likeBtn(block)"
								class="w-100 btn"
								:class="{
									'btn-outline-success': block.liked,
									'btn-outline-secondary': !block.liked,
								}"
							>{{ block.likeCount }} ▲</button>
						</h4>
					</div>
				</li>
			</ul>

			<!-- [DEFAULT] If No content -->
			<no-content v-if="!loading && blocks == ''" class="mt-3" />

			<!-- [LOADING] -->
			<div v-show="loading" class="m-0 mt-3 alert alert-primary">
				<div class="d-flex justify-content-center">
					<div class="spinner-grow"></div>
				</div>
			</div>

			<!-- [ALERTS] -->
			<div v-if="error" class="m-0 mt-3 alert alert-danger">
				Block List: {{ error }}
			</div>
		</section>
	</article>
</template>

<script>
	// [IMPORT] Personal //
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import BlockService from '@services/BlockService'

	// [EXPORT] //
	export default {
		components: {
			NoContent,
		},

		props: {
			blocks: { type: Array, required: true, },
		},

		data: function() {
			return {
				loading: true,
				disabled: false,
				error: '',
			}
		},

		created: async function() {
			// Disable Loading //
			this.loading = false

			// [LOG] //
			this.log()
		},

		methods: {
			/******************* [BTN] Like *******************/
			async likeBtn(block) {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					this.disabled = true
						
					if (block.liked) {
						try { await BlockService.s_unlike(block._id) }
						catch (e) { this.error = e }
					}
					else {
						try { await BlockService.s_like(block._id) }
						catch (e) { this.error = e }
					}

					this.disabled = false
				}

				// [READ] Update Blocks //
				this.$emit('refreshBlocks')
			},

			/******************* [ROUTER + LOG] *******************/
			redirectToBlock(block_id) {
				if (!this.disabled) {
					// [REDIRECT] //
					router.push({
						name: 'Block',
						params: { block_id: block_id, page: 1 }
					})
				}
			},

			log() {
				console.log('%%% [COMPONENT] BlockList %%%')
				console.log('blocks:', this.blocks)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>

<style lang='scss' scoped>
	// [IMPORT] Personal //
	@import 'src/assets/styles/bootstrap-override.scss';

	li {
		list-style: none;
		&:hover { @extend .bg-secondary; }
	}
	
	li:nth-child(even) {
		background: $backgroundGrey !important;
		&:hover { @extend .bg-secondary; }
	}

	.btn { font-size: 1em; }
</style>