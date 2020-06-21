<template>
	<article class="mx-5">
		<!-- Button Tabs -->
		<button-tabs :tabs="tabs" :emitName="'tab-clicked'" class="my-3" />

		<blocks-table v-if="activeTab == 'blocks'" />

		<div v-if="error != ''" class="my-3 alert alert-danger">
			{{ error }}
		</div>
	</article>
</template>

<script>
	// [IMPORT] //
	import BlocksTable from '@components/pages/admin/index/BlocksTable'
	import ButtonTabs from '@components/controls/ButtonTabs'
	import { EventBus } from '@main'
	import router from '@router'
	//import AdministrationServices from '@services/AdministrationServices'

	// [EXPORT] //
	export default {
		components: {
			BlocksTable,
			ButtonTabs,
		},

		data: function() {
			return {
				tabs: [
					{ name: 'blocks' },
					{ name: 'comments' },
				],
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

		methods: {
			// [DELETE] Delete Events, Post, & Tasks //
		},
	}
</script>