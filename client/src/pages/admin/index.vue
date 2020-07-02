<template>
	<article class="mx-5 my-3 card card-body bg-dark">
		<!-- Button Tabs -->
		<div class="row">
			<div class="col-6 my-3">
				<button-tabs :tabs="tabs" :emitName="'tab-clicked'" />
			</div>

			<div class="col-6 text-right my-3">
			</div>
		</div>
		
		<!-- Users Table -->
		<users-table v-show="activeTab == 'users'" class="my-3" />
		
		<!-- Blocks Table -->
		<blocks-table v-show="activeTab == 'blocks'" class="my-3" />

		<!-- Comments Table -->
		<comments-table v-show="activeTab == 'comments'" class="my-3" />

		<!-- [ERRORS] -->
		<div v-if="error != ''" class="my-3 alert alert-danger">
			{{ error }}
		</div>
	</article>
</template>

<script>
	// [IMPORT] //
	import BlocksTable from '@components/pages/admin/index/BlocksTable'
	import CommentsTable from '@components/pages/admin/index/CommentsTable'
	import UsersTable from '@components/pages/admin/index/UsersTable'
	import ButtonTabs from '@components/controls/ButtonTabs'
	import router from '@router'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		components: {
			BlocksTable,
			ButtonTabs,
			CommentsTable,
			UsersTable,
		},

		data: function() {
			return {
				tabs: ['users', 'blocks', 'comments'],
				activeTab: '',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Admin Log Required //
			if (!localStorage.admintoken) { router.push({ name: 'AdminLogin' }) }

			// Detect Tab Clicked //
			EventBus.$on('tab-clicked', (tabClicked) => {
				this.activeTab = tabClicked
			})
		},
	}
</script>