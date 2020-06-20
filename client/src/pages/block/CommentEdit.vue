<template>
	<section class="container">
		<div class="my-3 card card-body bg-dark">
			<h3 class="mb-3 text-light">
				Edit Comment "{{ comment_id }}"
			</h3>
		
			<!-- Comment Edit Component -->
			<comment-edit
				v-if="!loading"
				:comment_id="comment_id"
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
	import CommentEdit from '@components/comment/CommentEdit'
	import router from '@router'
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		components: {
			CommentEdit
		},

		data: function() {
			return {
				loading: true,
				comment_id: this.$route.params.comment_id,
				user_id: 'unset',
				email: 'unset',
				username: 'unset',	
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

			// Set Loaded //
			this.loaded = false
			
			// [LOG] //
			this.log()
		},

		methods: {
			log() {
				console.log('%%% [PAGE] CommentEdit %%%')
				//console.log('localStorage.userToken:', localStorage.usertoken)
				console.log('comment_id:', this.comment_id)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
			},
		}
	}
</script>