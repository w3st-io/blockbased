<template>
	<BContainer>
		<BCard bg-variant="dark" class="my-3">
			<BRow>
				<BCol cols="12">
					<h3 class="mb-3 text-light">Create Post in {{ catTitle }}</h3>

					<!-- [COMPONENT] Create -->
					<PostCreate :cat_id="cat_id" />
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import PostCreate from '@components/post/Create'
	import router from '@router'
	import { cats } from '@defaults/cats'

	// [EXPORT] //
	export default {
		components: {
			PostCreate
		},

		data: function() {
			return {
				cat_id: this.$route.params.cat_id,
				cat: {},
				catTitle: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'login' }) }

			// Get Cat Details //
			this.cat = cats.find(cat => cat.cat_id === this.cat_id)
			this.catTitle = this.cat.title
			
			// [LOG] //
			//this.log()
		},

		methods: {
			async submit() {
				if (localStorage.usertoken) {
					console.log('submit')
				}
				else { this.error = 'Error unable to update comment, no token passed' }
			},

			log() {
				console.log('%%% [PAGE] CatPostCreate %%%')
				console.log('cat_id:', this.cat_id)
			},
		}
	}
</script>