<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Report Type</th>
					<th>Reporter</th>
					<th>Date Created</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="report in commentReports"
					:key="report._id"
				>
					<td>{{ report.reportType }}</td>
					<td>{{ report.user.username }}</td>
					<td>{{ new Date(report.created_at).toLocaleString() }}</td>
					<td class="text-center">
						<BButton
							variant="danger"
							@click="handleReport(report._id)"
						>Handle</BButton>
					</td>
				</tr>
			</tbody>
		</table>
		
		<!-- [ALERTS] -->
		<div v-if="error" class="m-0 mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import AReportService from '@services/administration/CommentReportService'

	export default {
		props: {
			commentReports: { type: Array, required: true, },
		},

		data: function() {
			return {
				error: '',
			}
		},

		created: async function() {
			// [LOG] //
			//this.log()
		},

		methods: {
			async handleReport(report_id) {
				// Handle Report //
				try { await AReportService.s_markHandled(report_id) }
				catch (err) { this.error = err }
				
				this.$emit('refreshData')
			},

			log() {
				console.log('%%% [COMPONENT] Admin ReportsTable %%%')
				console.log('commentReports:', this.commentReports)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>