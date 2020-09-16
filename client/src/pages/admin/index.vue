<template>
	<article class="mx-5 my-3 card card-body bg-dark">
		<!-- Button Tabs -->
		<div class="row">
			<div class="col-6 my-3">
				<button-tabs :tabs="tabs" @tabClicked="switchTab" />
			</div>

			<div class="col-6 text-right my-3"></div>
		</div>
		
		<div class="my-3">
			<!-- Users -->
			<users v-show="activeTab == 'users'" :users="users" />
			
			<!-- Posts -->
			<posts v-show="activeTab == 'posts'" />

			<!-- Comments -->
			<comments v-show="activeTab == 'comments'" />

			<!-- Reports -->
			<reports v-show="activeTab == 'reports'" />
		</div>

		<!-- [ALERTS] -->
		<div v-if="error != ''" class="my-3 alert alert-danger">{{ error }}</div>
	</article>
</template>

<script>
	// [IMPORT] Personal //
	import Posts from '@components/admin/index/Posts'
	import Comments from '@components/admin/index/Comments'
	import Reports from '@components/admin/index/Reports'
	import Users from '@components/admin/index/Users'
	import ButtonTabs from '@components/controls/ButtonTabs'
	import router from '@router'
	import AUserService from '@services/administration/UserService'

	// [EXPORT] //
	export default {
		components: {
			Posts,
			ButtonTabs,
			Comments,
			Reports,
			Users,
		},

		data: function() {
			return {
				tabs: ['users', 'posts', 'comments', 'reports'],
				activeTab: '',
				error: '',
				returned: {},
				users: {},
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
				// Get Users //
				try { this.returned = await AUserService.s_readAll() }
				catch (err) { this.error = err }

				if (this.returned.status) { this.users = this.returned.users }
				else { this.error = this.returned.message }

				console.log('sdfsd', this.returned)
			},

			async banUser(user_id) { await AUserService.s_banUser(user_id, 1) },
		}
	}
</script>