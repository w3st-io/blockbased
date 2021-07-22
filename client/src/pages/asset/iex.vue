<template>
	<BContainer>
		<!-- Loading -->
		<div v-if="loading" class="w-100 alert alert-warning text-center">
			loading..
		</div>

		<BCard v-if="!loading" bg-variant="dark" class="my-3">
			<!-- TITLE HEADER -->
			<BRow class="mb-2">
				<!-- Left Side -->
				<BCol cols="12" md="6">
					<h2
						class="text-secondary"
						:class="{
							'text-success': assetData.quote.change > 0,
							'text-danger': assetData.quote.change < 0
						}"
					>
						<span
							class="badge"
						>{{ assetData.quote.symbol }}</span>
						{{ assetData.quote.latestPrice }}
						<span class="h6">({{ assetData.quote.change }})</span>
					</h2>

					<a :href="website">
						<h6 class="text-white">
							{{ assetData.quote.primaryExchange }} -
							{{ assetData.quote.companyName }}
						</h6>
					</a>
				</BCol>

				<!-- Right Side -->
				<BCol cols="12" md="6" class="text-right">
					<h3 class="text-secondary">
						<span class="p-2 badge">
							{{ assetData.quote.changePercent }}%
						</span>

						<div class="w-100 my-1">
							<BButton
								variant="outline-secondary"
								@click="log()"
							>Create Analysis</BButton>
						</div>
					</h3>
				</BCol>

				<BCol cols="12">
					<!-- CHART -->
					<LineChart
						:change="assetData.quote.change"
						:x="x"
						:y="y"
						class="bg-dark"
						style="height: 450px;"
					/>
				</BCol>

				<BCol cols="12">
					<!-- EQUITY TABLE
					<EquityTable :assetData="assetData" />
					-->
				</BCol>

				<BCol cols="12">
					<!-- DESCRIPTION -->
					<h3 class="text-white">About</h3>
					<p class="text-white">{{ assetData }}</p>
				</BCol>
			</BRow>
		</BCard>

		<BRow v-if="error">
			<BCol cols="12">
				<BCard bg-variant="dark">
					<h6 class="m-0 text-danger">{{ error }}</h6>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import axios from 'axios'

	// [IMPORT] Personal //
	import LineChart from '@/components/chartjs/WrappedLineChart'
	//import EquityTable from '@/components/quote/EquityTable'

	export default {
		data() {
			const token = this.$store.state.iexKey

			return {
				baseURL: 'https://sandbox.iexapis.com',
				token: token,
				ticker: this.$route.params.query || 'unknown',
				assetData: {},
				chartData: [],
				x: [],
				y: [],
				reqURL: '',
				types: '',
				loading: false,
				error: '',
			}
		},

		methods: {
			async getPageData() {
				try {
					// Prevent Render // Set URL //
					this.loading = true

					this.types = 'chart,quote,news'
					this.reqURL = `${this.baseURL}/stable/stock/${this.ticker}/batch?types=${this.types}&token=${this.token}`

					// Request //
					let { data } = await axios.get(this.reqURL)

					// TITLE HEADER // EQUITY TABLE //
					this.assetData = data
					
					// CHART //
					this.assetData.chart.forEach(cd => {
						this.x.push(cd.label)
						this.y.push(cd.close)
					})

					this.loading = false
				}
				catch (err) {
					this.loading = false
					this.error = err
				}
			},

			log() {},
		},

		components: {
			LineChart,
			//EquityTable,
		},

		async created() {
			document.title = this.ticker

			await this.getPageData()
		},
	}
</script>