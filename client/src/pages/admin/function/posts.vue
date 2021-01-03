<template>
	<BContainer>
		<BCard bg-variant="dark" class="my-3">
			<BRow class="mt-3">
				<BCol cols="12">
					<!-- Posts -->
					<Posts :posts="posts" @refreshData="getData()" />
				</BCol>
			</BRow>

			<!-- [ALERTS] -->
			<BRow class="my-3">
				<BCol cols="12">
					<Alert v-if="error" variant="danger" :message="error" />
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Posts from '@components/admin/function/Posts'
	import Alert from '@components/misc/Alert'
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			Posts,
		},

		data: function() {
			return {
				returned: {},
				posts: [],
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Admin Log Required //
			if (!localStorage.admintoken) { router.push({ name: 'a-login' }) }

			await this.getData()

			this.log()
		},

		methods: {
			switchTab(tabClicked) { this.activeTab = tabClicked },
			
			async getData() {
				try {
					this.returned = await PageService.s_admin_function(
						this.sort,
						this.limit,
						this.page
					)
				}
				catch (err) { this.error = err }

				if (this.returned.status) { this.posts = this.returned.posts }
				else { this.error = this.returned.message }
			},

			log() {
				console.log('%%% [PAGE] /admin/function/posts %%%')
				console.log('returned:', this.returned)
			},
		}
	}
</script>