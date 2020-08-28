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
			<users v-show="activeTab == 'users'" />
			
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
	// [IMPORT] //
	import Posts from '@components/admin/index/Posts'
	import Comments from '@components/admin/index/Comments'
	import Reports from '@components/admin/index/Reports'
	import Users from '@components/admin/index/Users'
	import ButtonTabs from '@components/controls/ButtonTabs'
	import router from '@router'

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
			}
		},

		created: async function() {
			// [REDIRECT] Not Admin Log Required //
			if (!localStorage.admintoken) { router.push({ name: 'AdminLogin' }) }
		},

		methods: { switchTab(tabClicked) { this.activeTab = tabClicked }, }
	}
</script>