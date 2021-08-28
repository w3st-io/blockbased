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
				<!-- Header Left Side -->
				<BCol cols="12" lg="8">
					<BRow>
						<!-- Exchange & Product ID -->
						<BCol cols="12">
							<h5 class="text-secondary">
								<span>
									<!-- Asset Logo Img -->
									<img
										:src="assetData.assetLogoImg"
										alt="image here"
										class="w-100"
										style="max-width: 20px;"
									>
								</span>
								{{ $route.params.exchange }}: {{ $route.params.product_id }}
							</h5>
							<!-- Last -->
							<h1 class="text-light">
								Last:
								{{
									this.assetData.graph.closes[
										this.assetData.graph.closes.length - 1
									]
								}}
							</h1>
						</BCol>

						<!-- Current Candle Stats -->
						<BCol cols="12">
							<BRow class="mb-3">
								<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
									<h5 class="text-center text-secondary">
										Open:
										{{
											this.assetData.graph.opens[
												this.assetData.graph.opens.length - 1
											]
										}}
									</h5>
								</BCol>
								<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
									<h5 class="text-center text-success">
										High:
										{{
											this.assetData.graph.highs[
												this.assetData.graph.highs.length - 1
											]
										}}
									</h5>
								</BCol>
								<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
									<h5 class="text-center text-danger">
										Low:
										{{
											this.assetData.graph.lows[
												this.assetData.graph.lows.length - 1
											]
										}}
									</h5>
								</BCol>
								<BCol cols="12" sm="6" md="3" class="d-none d-sm-block">
									<h5 class="text-center text-light">
										Close:
										{{
											this.assetData.graph.closes[
												this.assetData.graph.closes.length - 1
											]
										}}
									</h5>
								</BCol>
							</BRow>
						</BCol>
					</BRow>
				</BCol>

				<!-- Time Frame Selector -->
				<BCol cols="12" lg="4" class="">
					<BRow>
						<BCol cols="12" class="">
							<form
								@submit.prevent="
									timeFrameRedirect($route.params.timeframe)
								"
								class="ml-auto"
								style="max-width: 300px;"
							>
								<BInputGroup size="sm" class="mb-3">
									<BInputGroupPrepend class="ml-auto bg-dark">
										<BInputGroupText
											class="text-light border-light bg-dark"
										>Number of Candles:</BInputGroupText>
									</BInputGroupPrepend>
									
									<BFormInput
										v-model="$route.params.candlecount"
										type="text"
										variant="dark"
										placeholder="limit"
										border-variant="secondary"
										class="border-light text-center text-light bg-dark"
										style="max-width: 50px;"
									/>

									<BInputGroupAppend>
										<BButton
											variant="outline-light"
											class="bg-primary font-weight-bold"
											type="submit"
										>⟳</BButton>
									</BInputGroupAppend>
								</BInputGroup>
							</form>
						</BCol>

						<BCol cols="12" class="">
							<BButtonGroup size="sm" class="w-100">
								<BButton
									variant="outline-primary"
									:class="{
										'btn-primary text-dark': $route.params.timeframe == '1m'
									}"
									@click="timeFrameRedirect('1m')"
								>1m</BButton>

								<BButton
									variant="outline-primary"
									:class="{
										'btn-primary text-dark': $route.params.timeframe == '5m'
									}"
									@click="timeFrameRedirect('5m')"
								>5m</BButton>

								<BButton
									variant="outline-primary"
									:class="{
										'btn-primary text-dark': $route.params.timeframe == '15m'
									}"
									@click="timeFrameRedirect('15m')"
								>15m</BButton>

								<BButton
									variant="outline-primary"
									:class="{
										'btn-primary text-dark': $route.params.timeframe == '6h'
									}"
									@click="timeFrameRedirect('6h')"
								>6h</BButton>

								<BButton
									variant="outline-primary"
									:class="{
										'btn-primary text-dark': $route.params.timeframe == '1d'
									}"
									@click="timeFrameRedirect('1d')"
								>1d</BButton>
							</BButtonGroup>
						</BCol>
					</BRow>
				</BCol>

				<BCol cols="12"><hr class="bg-primary"></BCol>

				<BCol cols="12">
					<!-- [CHART] -->
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

				<BCol cols="12" class="py-4">
					<h5>Quote</h5>

					<BRow class="px-3">
						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>Name</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>{{ assetData.data.name }}</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>Circulating Supply</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>{{ assetData.data.circulating_supply }}</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>Total Supply</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>{{ assetData.data.total_supply }}</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>Market Cap</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>{{ assetData.data.market_cap }}</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>Total Volume</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>{{ assetData.data.total_volume }}</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>High 24h</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>{{ assetData.data.high_24h }}</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>Low 24h</BCol>

						<BCol
							cols="6" sm="3" md="2" lg="1"
							class="p-0 px-1 bg-data border border-dark"
						>{{ assetData.data.low_24h }}</BCol>
					</BRow>
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
						{{
							this.assetData.graph.times[
								this.assetData.graph.times.length - 1
							]
						}}
						<br>
						Array: {{ this.assetData.graph.times }}
						<br>
						Length: {{ this.assetData.graph.times.length }}
					</h6>
					
					<h6 class="text-primary">opens</h6>
					<h6>
						Latest:
						{{
							this.assetData.graph.opens[
								this.assetData.graph.opens.length - 1
							]
						}}
						<br>
						Array: {{ this.assetData.graph.opens }}
						<br>
						Length: {{ this.assetData.graph.opens.length }}
					</h6>

					<h6 class="text-primary">closes</h6>
					<h6>
						Latest:
						{{
							this.assetData.graph.closes[
								this.assetData.graph.closes.length - 1
							]
						}}
						<br>
						Array: {{ this.assetData.graph.closes }}
						<br>
						Length: {{ this.assetData.graph.closes.length }}
					</h6>

					<h6 class="text-primary">highs</h6>
					<h6>
						Latest:
						{{
							this.assetData.graph.highs[
								this.assetData.graph.highs.length - 1
							]
						}}
						<br>
						Array: {{ this.assetData.graph.highs }}
						<br>
						Length: {{ this.assetData.graph.highs.length }}
					</h6>

					<h6 class="text-primary">lows</h6>
					<h6>
						Latest:
						{{
							this.assetData.graph.lows[
								this.assetData.graph.lows.length - 1
							]
						}}
						<br>
						Array: {{ this.assetData.graph.lows }}
						<br>
						Length: {{ this.assetData.graph.lows.length }}
					</h6>

					<h6 class="text-primary">volumes</h6>
					<h6>
						Latest:
						{{
							this.assetData.graph.volumes[
								this.assetData.graph.volumes.length - 1
							]
						}}
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
	import router from '@/router'
	import PageService from '@/services/PageService'

	export default {
		data() {
			return {
				key: 0,
				chartKey: 0,

				assetData: {
					assetLogoImg: '',
					graph: {
						labels: [],
						times: [],
						opens: [],
						closes: [],
						highs: [],
						lows: [],
						volumes: [],
					},
					data: {},
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
					candleCount: this.$route.params.candlecount,
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

					this.assetData.assetLogoImg = this.reqData.apiData.cryptocurrencyData.image
					this.assetData.data = this.reqData.apiData.cryptocurrencyData
				}
				else { this.error = this.reqData.message }

				this.loading = false
			},

			async timeFrameRedirect(timeframe) {
				router.push({
					name: 'asset',
					params: {
						exchange: this.$route.params.exchange,
						product_id: this.$route.params.product_id,
						timeframe: timeframe,
					}
				})

				await this.getPageDataLocally()

				await this.unsubscribe()

				await this.subscribe()
			}
		},

		async created() {
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

<style lang="scss" scoped>
	.bg-data {
		background-color: rgba(255, 255, 255, 0.15) !important;
	}
</style>