<template>
	<section class="my-4 container">
		<!-- Set Page Title -->
		<vue-headful :title="`Cat - ${catTitle}`"/>

		<article class="card card-body bg-dark">
			<!-- Title With Create Button -->
			<title-header
				:cat_id="cat_id"
				:catTitle="catTitle"
				:badgeValue="pageNumber"
				:leftBtnEmitName="'cat-prev'"
				:rightBtnEmitName="'cat-next'"
			/>

			<!-- Display All the Blocks -->
			<block-list
				:cat_id="cat_id"
				:pageIndex="pageIndex"
				:amount="5"
			/>
		</article>

		<!-- [ALERTS] -->
		<div v-show="error" class="mt-3 alert alert-danger">
			Cat Page: {{ error }}
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import BlockList from '@components/block/List'
	import TitleHeader from '@components/cat/TitleHeader'
	import router from '@router'
	import { EventBus } from '@main'
	import { cats } from '@defaults/cats'

	// [EXPORT] //
	export default {
		components: {
			BlockList,
			TitleHeader,
		},

		data: function() {
			return {
				cat: {},
				catTitle: '',
				cat_id: this.$route.params.cat_id,
				pageNumber: parseInt(this.$route.params.page),
				pageIndex: parseInt(this.$route.params.page - 1),
				error: '',
			}
		},

		created: async function() {
			// Get Cat Details //
			this.cat = cats.find(cat => cat.cat_id === this.cat_id)
			this.catTitle = this.cat.title


			// [--> EMMIT] cat-prev, cat-next, redirect-to-block //
			EventBus.$on('cat-prev', () => { this.prevPage() })
			EventBus.$on('cat-next', () => { this.nextPage() })

			// [LOG] //
			//this.log()
		},

		methods: {
			prevPage() {
				// As long as the page is not going into 0 or negative //
				if (this.pageNumber != 1) {
					this.pageNumber--

					router.push({ path: `/cat/${this.cat_id}/${this.pageNumber}` })
					EventBus.$emit('force-rerender')
				}
			},

			nextPage() {
				// As long as page does not exceed max Number of Pages //
				if (this.pageNumber == this.pageNumber) {
					this.pageNumber++

					router.push({ path: `/cat/${this.cat_id}/${this.pageNumber}` })
					EventBus.$emit('force-rerender')
				}
			},

			test() {
				
			},

			log() {
				console.log('%%% [PAGE] Cat %%%')
				console.log('cat_id:', this.cat_id)
				console.log('pageNumber:', this.pageNumber)
				console.log('pageIndex:', this.pageIndex)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>