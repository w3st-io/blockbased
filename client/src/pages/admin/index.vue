<template>
	<BContainer class="mt-3 text-light">
		<BRow v-if="!loading">
			<BCol cols="12">
				<BCard bg-variant="dark">
					<BRow>
						<BCol sm="4">
							<BBadge variant="dark" class="w-100 p-1 border border-secondary rounded">
								<h6 class="m-0">Users Online</h6>
								<h5 class="m-0">{{ usersOnline }}</h5>
							</BBadge>
						</BCol>
						<BCol sm="4">
							<BBadge variant="dark" class="w-100 p-1 border border-secondary rounded">
								<h6 class="m-0">Admins Online</h6>
								<h5 class="m-0">{{ '--' }}</h5>
							</BBadge>
						</BCol>
					</BRow>

					<BRow class="mt-4">
						<BCol cols="12">
							<WrappedLineChart
								:title="'Activity'"
								:labels="activityLabels"
								:data="activityValues"
								:height="350"
							/>
						</BCol>
					</BRow>

					<BRow class="mt-3">
						<BCol cols="6">
							<h3>Functions</h3>
							<BButton
								variant="primary"
								class="w-100"
								@click="redirectAdminFunction()"
							>Actions</BButton>
						</BCol>
						
						<BCol cols="6">
							<h3>
								<span class="h2 text-success">&#9679;</span>
								Users Online
							</h3>
							<BTable small bordered dark :items="users"></BTable>
						</BCol>
					</BRow>
				</BCard>
			</BCol>
		</BRow>

		<!-- [LOADING] -->
		<BRow v-show="loading" class="mt-3 row">
			<BCol cols="12">
				<Alert BSColor="dark" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import WrappedLineChart from '@components/chartjs/WrappedLineChart'
	import Alert from '@components/misc/Alert'
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			WrappedLineChart,
			Alert,
		},

		data: function() {
			return {
				returned: {},
				usersOnline: 0,
				users: [],
				activityLabels: [],
				activityValues: [],
				loading: true,
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
					this.usersOnline = this.users.length

					// Map Data activityData //
					this.activityLabels = this.returned.activityData.map(d => d.time)
					this.activityValues = this.returned.activityData.map(d => d.count)
				}
				else { this.error = this.returned.message }

				this.loading = false
			},

			redirectAdminFunction() { router.push({ name: 'admin-function' }) },
		}
	}
</script>