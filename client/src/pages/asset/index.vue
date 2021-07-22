<template>
	<BContainer class="my-5">
		<!-- Set Page Title-->
		<VueHeadful
			:title="`
				${graph.closes[graph.closes.length - 1]}
				-
				${$route.params.product_id}
			`"
		/>

		<BCard bg-variant="dark" text-variant="light">
			<BRow>
				<!-- Exchange & Product ID -->
				<BCol cols="12" md="8">
					<h5 class="text-secondary">
						{{ $route.params.exchange }}: {{ $route.params.product_id }}
					</h5>
					<!-- Last -->
					<h1 class="text-light">
						Last: {{ graph.closes[graph.closes.length - 1] }}
					</h1>
				</BCol>

				<BCol cols="12" md="4">
					<h6 class="float-right">Total Candles: {{ candleCount }}</h6>
				</BCol>

				<!-- Current Candle Stats -->
				<BCol cols="12">
					<BRow>
						<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
							<h5 class="text-center text-secondary">
								Open: {{ graph.opens[graph.opens.length - 1] }}
							</h5>
						</BCol>
						<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
							<h5 class="text-center text-success">
								High: {{ graph.highs[graph.highs.length - 1] }}
							</h5>
						</BCol>
						<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
							<h5 class="text-center text-danger">
								Low: {{ graph.lows[graph.lows.length - 1] }}
							</h5>
						</BCol>
						<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
							<h5 class="text-center text-light">
								Close: {{ graph.closes[graph.closes.length - 1] }}
							</h5>
						</BCol>
					</BRow>
				</BCol>

				<BCol cols="12">
					<!-- CHART -->
					<AssetLineChart
						v-if="!loading"
						:key="chartKey"
						:labels="graph.labels"
						:opens="graph.opens"
						:highs="graph.highs"
						:lows="graph.lows"
						:closes="graph.closes"
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
						Latest: {{ graph.labels[graph.labels.length - 1] }}
						<br>
						Array: {{ graph.labels }}
						<br>
						Length: {{ graph.labels.length }}
					</h6>

					<h6 class="text-primary">times</h6>
					<h6>
						Latest: {{ graph.times[graph.times.length - 1] }}
						<br>
						Array: {{ graph.times }}
						<br>
						Length: {{ graph.times.length }}
					</h6>
					
					<h6 class="text-primary">opens</h6>
					<h6>
						Latest: {{ graph.opens[graph.opens.length - 1] }}
						<br>
						Array: {{ graph.opens }}
						<br>
						Length: {{ graph.opens.length }}
					</h6>

					<h6 class="text-primary">closes</h6>
					<h6>
						Latest: {{ graph.closes[graph.closes.length - 1] }}
						<br>
						Array: {{ graph.closes }}
						<br>
						Length: {{ graph.closes.length }}
					</h6>

					<h6 class="text-primary">highs</h6>
					<h6>
						Latest: {{ graph.highs[graph.highs.length - 1] }}
						<br>
						Array: {{ graph.highs }}
						<br>
						Length: {{ graph.highs.length }}
					</h6>

					<h6 class="text-primary">lows</h6>
					<h6>
						Latest: {{ graph.lows[graph.lows.length - 1] }}
						<br>
						Array: {{ graph.lows }}
						<br>
						Length: {{ graph.lows.length }}
					</h6>

					<h6 class="text-primary">volumes</h6>
					<h6>
						Latest: {{ graph.volumes[graph.volumes.length - 1] }}
						<br>
						Array: {{ graph.volumes }}
						<br>
						Length: {{ graph.volumes.length }}
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
				chartKey: 0,
				key: 0,
				candleCount: 300,
				loading: true,
				error: '',

				reqData: {},
				sockData: {},
				graphData: [],

				graph: {
					labels: [],
					times: [],
					opens: [],
					closes: [],
					highs: [],
					lows: [],
					volumes: [],
				},
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
					this.graph.times[this.graph.times.length - 1].getTime() +
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
				this.graph.labels.push(generatedLabel)
				this.graph.times.push(generatedTimeStamp)
				this.graph.opens.push(this.graph.closes[this.graph.closes.length - 1])
				this.graph.closes.push(this.graph.closes[this.graph.closes.length - 1])
				this.graph.highs.push(this.graph.closes[this.graph.closes.length - 1])
				this.graph.lows.push(this.graph.closes[this.graph.closes.length - 1])
				this.graph.volumes.push(0)

				// Remove last candle from end //
				this.graph.labels.shift()
				this.graph.times.shift()
				this.graph.opens.shift()
				this.graph.closes.shift()
				this.graph.highs.shift()
				this.graph.lows.shift()
				this.graph.volumes.shift()
			},


			async getPageDataLocally() {
				this.loading = true

				this.reqData = await PageService.s_asset({
					exchange: this.$route.params.exchange,
					product_id: this.$route.params.product_id,
					timeFrame: this.$route.params.timeframe,
					candleCount: this.candleCount,
				})

				console.log('sdf', this.reqData.graph)

				if (this.reqData.status) {
					this.graph.labels = this.reqData.graph.labels
					this.graph.times = this.reqData.graph.times
					this.graph.opens = this.reqData.graph.opens
					this.graph.closes = this.reqData.graph.closes
					this.graph.highs = this.reqData.graph.highs
					this.graph.lows = this.reqData.graph.lows
					this.graph.volumes = this.reqData.graph.volumes

					this.addNewCandle()
				}
				else { this.error = this.reqData.message }

				this.loading = false
			},
		},

		async created() {
			if (this.$store.state.node_env == 'development') {
				this.candleCount = 30
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
					this.graph.lows[this.graph.lows.length - 1] = candle.low
					this.graph.opens[this.graph.opens.length - 1] = candle.open
					this.graph.closes[this.graph.closes.length - 1] = candle.close
					this.graph.highs[this.graph.highs.length - 1] = candle.high
					//this.graph.volumes[this.graph.volumes - 1] = candle.volume

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