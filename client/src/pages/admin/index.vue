<template>
	<article>
		<!-- Button Tabs -->
		<button-tabs :tabs="tabs" :emitName="'tab-clicked'" class="mt-3" />

		<div v-if="error != ''" class="my-3 alert alert-danger">
			{{ error }}
		</div>
	</article>
</template>

<script>
	/*** [IMPORT] ***/
	import ButtonTabs from '../../components/controls/ButtonTabs'
	import { EventBus } from '../../main'
	import router from '../../router'
	//import AdminService from '../../services/AdminService'

	/*** [EXPORT] ***/
	export default {
		components: {
			ButtonTabs
		},

		data: function() {
			return {
				tabs: [
					{ name: 'tab1' },
					{ name: 'tab2' },
					{ name: 'tab3' }
				],
				activeTab: '',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] //
			if (!localStorage.admintoken) {
				router.push({ name: 'AdminLogin' })
			}

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