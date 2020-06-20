<template>
	<section class="container">
		<div class="my-3 card card-body bg-dark">
			<h3 class="mb-3 text-light">
				Create Comment in "{{ block_id }}"
			</h3>
		
			<!-- Comment Create Component -->
			<comment-create
				v-if="loaded"
				:block_id="block_id"
				:blockExistance="blockExistance"
				:user_id="user_id"
				:email="email"
				:username="username"
			/>
		</div>

		<!-- [ERROR] -->
		<div v-if="error" class="mt-3 alert alert-danger">
			{{ error }}
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import CommentCreate from '@components/pages/block/CommentCreate'
	import router from '@router'
	import UserService from '@services/UserService'
	import BlockService from '@services/BlockService'

	// [EXPORT] //
	export default {
		components: {
			CommentCreate
		},

		data: function() {
			return {
				loaded: false,
				block_id: this.$route.params.block_id,
				blockExistance: false,
				user_id: 'unset',
				email: 'unset',
				username: 'unset',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'Login' }) }

			// Retrieve User Data //
			try {
				let userTokenDecodeData = await UserService.getUserTokenDecodeData()
				this.user_id = userTokenDecodeData._id
				this.email = userTokenDecodeData.email
				this.username = userTokenDecodeData.username
			}
			catch(e) { this.error = e }
			
			// Check if Block is Valid //
			try { this.blockExistance = await this.validateExistance() }
			catch (e) { this.error = e }

			// Set Loaded //
			this.loaded = true

			// [LOG] //
			this.log()
		},

		methods: {
			async validateExistance() {
				let status = false

				try {
					status = await BlockService.validateExistance(this.block_id)
				} 
				catch(e) { this.error = e }

				return status
			},

			log() {
				console.log('%%% [PAGE] BlockCommentCreate %%%')
				console.log('block_id:', this.block_id)
				console.log('blockExistance:', this.blockExistance)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
			},
		}
	}
</script>