<template>
	<BContainer>
		<BCard bg-variant="dark" class="my-3">
			<BRow class="mt-3">
				<BCol cols="12">
					<!-- Comment Reports -->
					<CommentReports
						:commentReports="commentReports"
						@refreshData="getData()"
					/>
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
	import CommentReports from '@components/admin/function/CommentReports'
	import Alert from '@components/misc/Alert'
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			CommentReports,
		},

		data: function() {
			return {
				returned: {},
				commentReports: [],
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

				if (this.returned.status) { this.commentReports = this.returned.commentReports }
				else { this.error = this.returned.message }
			},

			log() {
				console.log('%%% [PAGE] /admin/function/comment-reports %%%')
				console.log('returned:', this.returned)
			},
		}
	}
</script>