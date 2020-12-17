<template>
	<BContainer class="mt-3 text-light">
		<BRow>
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
								:labels="['sd', 'sdf', 'sdf', '23']"
								:data="[1,3,4,7]"
								:height="350"
							/>
						</BCol>
					</BRow>

					<BRow class="mt-3">
						<BCol cols="12">
							<BButton variant="primary" @click="redirectAdminFunction()">
								Function
							</BButton>
						</BCol>
					</BRow>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import WrappedLineChart from '@components/chartjs/WrappedLineChart'
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			WrappedLineChart,
		},

		data: function() {
			return {
				returned: {},
				usersOnline: 0,
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
					this.usersOnline = this.returned.users.length
				}
				else { this.error = this.returned.message }
			},

			redirectAdminFunction() { router.push({ name: 'admin-function' }) },
		}
	}
</script>