<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Report Type</th>
					<th>comment</th>
					<th>Reporter</th>
					<th>Date Created</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="report in reports"
					:key="report._id"
				>
					<td>{{ report.reportType }}</td>
					<td>{{ report.comment.text }}</td>
					<td>{{ report.user.username }}</td>
					<td>{{ report.createdAt }}</td>
					<td class="text-center">
						<button
							@click="deleteReport(report._id)"
							class="btn btn-danger"
						>Delete</button>
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
	import AReportService from '@services/administration/ReportService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				reports: {},
				error: '',
			}
		},

		created: async function() {
			// Get Reports //
			await this.getReports()

			// [LOG] //
			//this.log()
		},

		methods: {
			async getReports() {
				// Get Reports //
				try {
					let returnedData = await AReportService.s_readAllAll()

					if (returnedData.status) this.reports = returnedData.reports
					else this.error = returnedData.message
				}
				catch(e) { this.error = e }
			},

			async deleteReport(report_id) {
				// Delete Report //
				try { await AReportService.s_delete(report_id) }
				catch(e) { this.error = e }
				
				// Refresh Table //
				this.getReports()
			},

			log() {
				console.log('%%% [COMPONENT] Admin ReportsTable %%%')
				console.log('reports:', this.reports)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>