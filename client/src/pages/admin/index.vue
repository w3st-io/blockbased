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
							<!--
							<BBadge variant="dark" class="w-100 p-1 border border-secondary rounded">
								<h6 class="m-0">Admins Online</h6>
								<h5 class="m-0">{{ '--' }}</h5>
							</BBadge>
							-->
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
						<BCol lg="6">
							<h3>Functions</h3>
							<BButton
								variant="primary"
								class="w-100"
								@click="redirectAdminFunction()"
							>Actions</BButton>
						</BCol>

						<BCol lg="6">
							<h3>
								<span class="h2 text-success">&#9679;</span>
								Users Online
							</h3>
							<table class="table table-sm table-dark table-bordered w-100">
								<tr>
									<th>username</th>
									<th>email</th>
									<th>Profile</th>
									<th>Activity</th>
								</tr>
								<tr v-for="user in users" :key="user._id">
									<td>{{ user.username }}</td>
									<td>{{ user.email }}</td>
									<td>
										<BButton
											variant="outline-primary"
											size="sm"
											class="w-100"
											@click="redirectProfilePage(user._id)"
										>Profile</BButton>
									</td>
									<td>
										<BButton
											variant="outline-primary"
											size="sm"
											class="w-100"
											@click="redirectActivityPage(user._id)"
										>Activity</BButton>
									</td>
								</tr>
							</table>
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

			redirectActivityPage(user_id) {
				router.push({
					name: 'user_activity_lookup',
					params: {
						user_id: user_id,
						sort: 1,
						limit: 5,
						page: 1,
					}
				})
			},

			redirectProfilePage(user_id) {
				router.push({
					name: 'user_profile_lookup',
					params: { user_id: user_id, }
				})
			},
		}
	}
</script>