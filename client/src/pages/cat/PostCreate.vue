<template>
	<section class="container">
		<div class="my-3 row card card-body bg-dark">
			<h3 class="col-12 mb-3 text-light">
				Create Post in "{{ catTitle }}"
			</h3>

			<!-- [COMPONENT] Create -->
			<post-create :cat_id="cat_id" />
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PostCreate from '@components/post/Create'
	//import router from '@router'
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
			// Get Cat Details //
			this.cat = cats.find(cat => cat.cat_id === this.cat_id)
			this.catTitle = this.cat.title

			// [REDIRECT] Not Log Needed //
			//if (!localStorage.usertoken) { router.push({ name: 'Login' }) }
			
			// [LOG] //
			//this.log()
		},

		methods: {	
			log() {
				console.log('%%% [PAGE] CatPostCreate %%%')
				console.log('cat_id:', this.cat_id)
			},
		}
	}
</script>