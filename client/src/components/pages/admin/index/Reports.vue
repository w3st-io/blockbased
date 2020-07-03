<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>comment_id</th>
					<th>Report Type</th>
					<th>email</th>
					<th>username</th>
					<th>Date Created</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="report in reports"
					:key="report._id"
				>
					<td>{{ report.comment_id }}</td>
					<td>{{ report.email }}</td>
					<td>{{ report.type }}</td>
					<td>{{ report.username }}</td>
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
		
		<!-- [ERROR] -->
		<div v-if="error" class="alert alert-danger">{{ error }}</div>
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
			this.log()
		},

		methods: {
			async getReports() {
				// Get Reports //
				try {
					this.reports = await AReportService.getAllReports()
				}
				catch(e) { this.error = e }

				console.log('REPORTS:', this.reports)
			},

			async deleteReport(report_id) {
				// Delete Report //
				try { await AReportService.deleteReport(report_id) }
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