<template>
	<section class="container">
		<h3 class="my-3 text-light">
			Create Comment in "{{ block_id }}"
		</h3>
		
		<!-- Comment Create Component -->
		<comment-create
			:block_id="block_id"
			:user_id="user_id"
			:email="email"
			:username="username"
		/>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import CommentCreate from '../../components/pages/block/CommentCreate'
	import router from '@router'
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		components: {
			CommentCreate
		},

		data: function() {
			return {
				block_id: this.$route.params.block_id,
				user_id: 'unset',
				email: 'unset',
				username: 'unset',	
			}
		},

		created: function() {
			// [REDIRECT] Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'Login' }) }

			// Retrieve Email //
			this.user_id = UserService.getUserId()
			this.email = UserService.getEmail()
			this.username = UserService.getUsername()
			
			// [LOG] //
			this.log()
		},

		methods: {
			log() {
				console.log('%%% [PAGE] BlockCommentCreate %%%')
				console.log('block_id:', this.block_id)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
			},
		}
	}
</script>