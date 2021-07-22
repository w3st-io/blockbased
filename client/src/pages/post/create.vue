<template>
	<BContainer class="my-3">
		<BCard bg-variant="dark">
			<BRow v-if="!loading">
				<BCol cols="12">
					<h3 class="mb-3 text-light">Create Post in {{ catTitle }}</h3>

					<!-- [COMPONENT] Create -->
					<Create :cat="cat" />
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Create from '@/components/post/Create'
	import PageService from '@/services/PageService'
	import router from '@/router'

	// [EXPORT] //
	export default {
		components: {
			Create
		},

		data() {
			return {
				loading: false,
				cat_id: this.$route.params.cat_id,
				reqData: {},
				cats: [],
				cat: {},
				catTitle: '',
			}
		},

		methods: {
			async submit() {
				if (localStorage.usertoken) {
					console.log('submit')
				}
				else {
					this.error = 'Error unable to update comment, no token passed'
				}
			},

			log() {
				console.log('%%% [PAGE] CatPostCreate %%%')
				console.log('data:', this.reqData)
				console.log('cat_id:', this.cat_id)
			},

			async getPageData() {
				this.loading = true

				this.reqData = await PageService.s_post_create()

				if (this.reqData.status) {
					// Store Cats //
					this.categories = this.reqData.categories
					
					// Get Cat Details //
					this.categories.forEach(category => {
						console.log(category)

						category.cats.forEach(cat => {
							if (cat.cat_id === this.cat_id) { this.cat = cat }
						})
					})

					this.catTitle = this.cat.title
				}

				this.loading = false
			},
		},

		created: async function() {
			// [REDIRECT] Not Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'user_login' }) }

			// Get Page Data //
			await this.getPageData()
			
			// [LOG] //
			this.log()
		},
	}
</script>