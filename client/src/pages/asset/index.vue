<template>
	<BContainer class="my-5">
		<!-- Set Page Title -->
		<VueHeadful
			:title="`
				${this.assetData.graph.closes[this.assetData.graph.closes.length - 1]}
				-
				${$route.params.product_id}
			`"
		/>

		<!-- Asset Details -->
		<BCard bg-variant="dark" text-variant="light">
			<BRow>
				<!-- Exchange & Product ID -->
				<BCol cols="12" md="8">
					<h5 class="text-secondary">
						<span>
							<!-- Asset Logo Img -->
							<img
								:src="assetData.assetLogoImg"
								class="w-100"
								style="max-width: 20px;"
							>
						</span>
						{{ $route.params.exchange }}: {{ $route.params.product_id }}
					</h5>
					<!-- Last -->
					<h1 class="text-light">
						Last:
						{{ this.assetData.graph.closes[this.assetData.graph.closes.length - 1] }}
					</h1>
				</BCol>

				<!-- Time Frame Selector -->
				<BCol cols="12" md="4">
					<h6 class="float-right">
						Total Candles: {{ assetData.candleCount }}
					</h6>
				</BCol>

				<!-- Current Candle Stats -->
				<BCol cols="12">
					<BRow>
						<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
							<h5 class="text-center text-secondary">
								Open:
								{{ this.assetData.graph.opens[this.assetData.graph.opens.length - 1] }}
							</h5>
						</BCol>
						<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
							<h5 class="text-center text-success">
								High:
								{{ this.assetData.graph.highs[this.assetData.graph.highs.length - 1] }}
							</h5>
						</BCol>
						<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
							<h5 class="text-center text-danger">
								Low:
								{{ this.assetData.graph.lows[this.assetData.graph.lows.length - 1] }}
							</h5>
						</BCol>
						<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
							<h5 class="text-center text-light">
								Close:
								{{ this.assetData.graph.closes[this.assetData.graph.closes.length - 1] }}
							</h5>
						</BCol>
					</BRow>
				</BCol>

				<BCol cols="12">
					<!-- CHART -->
					<AssetLineChart
						v-if="!loading"
						:key="chartKey"
						:labels="this.assetData.graph.labels"
						:opens="this.assetData.graph.opens"
						:highs="this.assetData.graph.highs"
						:lows="this.assetData.graph.lows"
						:closes="this.assetData.graph.closes"
						class="w-100 bg-dark"
						style="height: 450px;"
					/>
				</BCol>
			</BRow>

			<!-- [ERROR] -->
			<BRow>
				<BCol cols="12">
					<h6 class="text-danger">{{ error }}</h6>
				</BCol>
			</BRow>

			<!-- [ADMIN] Socket Data -->
			<BRow
				v-if="$store.state.node_env == 'development'"
				class="mt-3 border border-warning"
			>
				<BCol cols="12">
					<h3 class="text-primary">Socket Date:</h3>
					<h6>{{ sockData }}</h6>
				</BCol>

				<BCol :key="key" cols="12">
					<h6 class="text-primary">labels</h6>
					<h6>
						Latest:
						{{ this.assetData.graph.labels[this.assetData.graph.labels.length - 1] }}
						<br>
						Array:{{ this.assetData.graph.labels }}
						<br>
						Length: {{ this.assetData.graph.labels.length }}
					</h6>

					<h6 class="text-primary">times</h6>
					<h6>
						Latest:
						{{ this.assetData.graph.times[this.assetData.graph.times.length - 1] }}
						<br>
						Array: {{ this.assetData.graph.times }}
						<br>
						Length: {{ this.assetData.graph.times.length }}
					</h6>
					
					<h6 class="text-primary">opens</h6>
					<h6>
						Latest:
						{{ this.assetData.graph.opens[this.assetData.graph.opens.length - 1] }}
						<br>
						Array: {{ this.assetData.graph.opens }}
						<br>
						Length: {{ this.assetData.graph.opens.length }}
					</h6>

					<h6 class="text-primary">closes</h6>
					<h6>
						Latest:
						{{ this.assetData.graph.closes[this.assetData.graph.closes.length - 1] }}
						<br>
						Array: {{ this.assetData.graph.closes }}
						<br>
						Length: {{ this.assetData.graph.closes.length }}
					</h6>

					<h6 class="text-primary">highs</h6>
					<h6>
						Latest:
						{{ this.assetData.graph.highs[this.assetData.graph.highs.length - 1] }}
						<br>
						Array: {{ this.assetData.graph.highs }}
						<br>
						Length: {{ this.assetData.graph.highs.length }}
					</h6>

					<h6 class="text-primary">lows</h6>
					<h6>
						Latest:
						{{ this.assetData.graph.lows[this.assetData.graph.lows.length - 1] }}
						<br>
						Array: {{ this.assetData.graph.lows }}
						<br>
						Length: {{ this.assetData.graph.lows.length }}
					</h6>

					<h6 class="text-primary">volumes</h6>
					<h6>
						Latest:
						{{ this.assetData.graph.volumes[this.assetData.graph.volumes.length - 1] }}
						<br>
						Array: {{ this.assetData.graph.volumes }}
						<br>
						Length: {{ this.assetData.graph.volumes.length }}
					</h6>
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import crypto from '@/api/crypto'
	import cryptoUtil from '@/api/crypto/Util'
	import AssetLineChart from '@/components/chartjs/AssetLineChart'
	import PageService from '@/services/PageService'

	export default {
		data() {
			return {
				key: 0,
				chartKey: 0,

				assetData: {
					assetLogoImg: '',
					candleCount: 300,
					graph: {
						labels: [],
						times: [],
						opens: [],
						closes: [],
						highs: [],
						lows: [],
						volumes: [],
					},
				},

				loading: true,
				error: '',

				reqData: {},
				sockData: {},
			}
		},

		components: {
			AssetLineChart,
		},

		methods: {
			async unsubscribe() {
				this.$store.state.socket.emit('asset-unsubscribe')
			},


			async subscribe() {
				this.$store.state.socket.emit(
					'asset-subscribe',
					this.$route.params.exchange,
					this.$route.params.product_id,
					this.$route.params.timeframe,
				)
			},


			async addNewCandle() {
				const generatedTimeStamp = new Date(
					this.assetData.graph.times[this.assetData.graph.times.length - 1].getTime() +
					crypto.getGranularity({
						exchange: this.$route.params.exchange,
						timeFrame: this.$route.params.timeframe
					}) * 1000
				)

				const generatedLabel = cryptoUtil.labelGenerator(
					this.$route.params.timeframe,
					generatedTimeStamp
				)

				// Add current candle to beginning //
				this.assetData.graph.labels.push(generatedLabel)
				this.assetData.graph.times.push(generatedTimeStamp)
				this.assetData.graph.opens.push(this.assetData.graph.closes[this.assetData.graph.closes.length - 1])
				this.assetData.graph.closes.push(this.assetData.graph.closes[this.assetData.graph.closes.length - 1])
				this.assetData.graph.highs.push(this.assetData.graph.closes[this.assetData.graph.closes.length - 1])
				this.assetData.graph.lows.push(this.assetData.graph.closes[this.assetData.graph.closes.length - 1])
				this.assetData.graph.volumes.push(0)

				// Remove last candle from end //
				this.assetData.graph.labels.shift()
				this.assetData.graph.times.shift()
				this.assetData.graph.opens.shift()
				this.assetData.graph.closes.shift()
				this.assetData.graph.highs.shift()
				this.assetData.graph.lows.shift()
				this.assetData.graph.volumes.shift()
			},


			async getPageDataLocally() {
				this.loading = true

				this.reqData = await PageService.s_asset({
					exchange: this.$route.params.exchange,
					product_id: this.$route.params.product_id,
					timeFrame: this.$route.params.timeframe,
					candleCount: this.assetData.candleCount,
				})

				if (this.reqData.status) {
					this.assetData.graph.labels = this.reqData.graph.labels
					this.assetData.graph.times = this.reqData.graph.times
					this.assetData.graph.opens = this.reqData.graph.opens
					this.assetData.graph.closes = this.reqData.graph.closes
					this.assetData.graph.highs = this.reqData.graph.highs
					this.assetData.graph.lows = this.reqData.graph.lows
					this.assetData.graph.volumes = this.reqData.graph.volumes

					this.addNewCandle()
				}
				else { this.error = this.reqData.message }

				this.loading = false
			},
		},

		async created() {
			if (this.$store.state.node_env == 'development') {
				this.assetData.candleCount = 30
			}

			await this.getPageDataLocally()

			await this.subscribe()

			// [SOCKET][ON] NEW CANDLE exchange-timeframe //
			this.$store.state.socket.on(
				`${this.$route.params.exchange}-${this.$route.params.timeframe}`,
				() => {
					// [ADD] //
					this.addNewCandle()

					this.chartKey++
				}
			)

			// [SOCKET][ON] update-candle //
			this.$store.state.socket.on('update-candle', (data) => {
				if (data.product_id == this.$route.params.product_id) {
					this.sockData = data
					
					const candle = this.sockData.updatedCandle[
						`candle_${this.$route.params.timeframe}`
					]

					// [UPDATE] latest candle in data //
					this.assetData.graph.lows[this.assetData.graph.lows.length - 1] = candle.low
					this.assetData.graph.opens[this.assetData.graph.opens.length - 1] = candle.open
					this.assetData.graph.closes[this.assetData.graph.closes.length - 1] = candle.close
					this.assetData.graph.highs[this.assetData.graph.highs.length - 1] = candle.high
					//this.assetData.graph.volumes[this.assetData.graph.volumes - 1] = candle.volume

					this.chartKey++
					this.key++
				}
			})
		},

		async destroyed() {
			await this.unsubscribe()
		},
	}
</script>