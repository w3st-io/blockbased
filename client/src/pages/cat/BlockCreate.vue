<template>
	<section class="container">
		<div class="my-3 row card card-body bg-dark">
			<h3 class="col-12 mb-3 text-light">
				Create Block in "{{ cat_id }}"
			</h3>
			
			<block-create
				:cat_id="cat_id"
			/>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import BlockCreate from '@components/block/Create'
	import UserService from '@services/UserService'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: {
			BlockCreate
		},

		data: function() {
			return {
				cat_id: this.$route.params.cat_id,
				user_id: 'unset',
				email: 'unset',
				username: 'unset',
			}
		},

		created: async function() {
			// [REDIRECT] Not Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'Login' }) }

			// Retrieve User Data //
			try {
				let decoded = await UserService.getUserTokenDecodeData()
				this.user_id = decoded._id
				this.email = decoded.email
				this.username = decoded.username
			}
			catch(e) { this.error = e }

			// [LOG] //
			this.log()
		},

		methods: {	
			log() {
				console.log('%%% [PAGE] CatBlockCreate %%%')
				console.log('cat_id:', this.cat_id)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
			},
		}
	}
</script>