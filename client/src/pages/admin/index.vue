<template>
	<BContainer class="mt-3 text-light">
		<BRow>
			<BCol cols="12">
				<BCard bg-variant="dark">
					{{ returned }}
				</BCard>
			</BCol>

			<BCol cols="12">
				<BCard bg-variant="dark" class="mt-3">
					<BButton @click="redirectAdminFunction()">Function</BButton>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
		},

		data: function() {
			return {
				returned: {},
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Admin Log Required //
			if (!localStorage.admintoken) { router.push({ name: 'a-login' }) }

			await this.getData()
		},

		methods: {
			switchTab(tabClicked) { this.activeTab = tabClicked },
			
			async getData() {
				try { this.returned = await PageService.s_admin() }
				catch (err) { this.error = err }

				if (this.returned.status) {
					this.users = this.returned.users
					this.posts = this.returned.posts
					this.comments = this.returned.comments
					this.commentReports = this.returned.commentReports
				}
				else { this.error = this.returned.message }
			},

			redirectAdminFunction() { router.push({ name: 'admin-function' }) },
		}
	}
</script>