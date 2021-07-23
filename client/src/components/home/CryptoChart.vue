<template>
	<BRow  class="">
		<BCol cols="12" sm="4" class="">
			<!-- Bitcoin Hour Chart -->
			<BCard bg-variant="dark" text-variant="light" no-body class="mb-3 p-2">
				<h6 class="text-light">
					BTC-USD
					<span
						class="m-0 my-1"
						:class="[
							math.percentChange(
								btcHistoricRate.closes[0],
								btcHistoricRate.closes[11]
							) >= 0 ? 'text-success' : 'text-danger'
						]"
					>
						{{ btcHistoricRate.closes[11] }}
						({{
							math.percentChange(
								btcHistoricRate.closes[0],
								btcHistoricRate.closes[11]
							) >= 0 ? '+' : ''
						}}{{
							math.percentChange(
								btcHistoricRate.closes[0],
								btcHistoricRate.closes[11]
							).toFixed(2)
						}}%)
					</span>
				</h6>

				<AssetLineChart
					:labels="btcHistoricRate.labels"
					:opens="btcHistoricRate.opens"
					:highs="btcHistoricRate.highs"
					:lows="btcHistoricRate.lows"
					:closes="btcHistoricRate.closes"
					class="w-100 bg-dark"
					style="height: 200px;"
				/>
			</BCard>
		</BCol>

		<BCol cols="12" sm="4" class="">
			<!-- Ethereum Hour Chart -->
			<BCard bg-variant="dark" text-variant="light" no-body class="mb-3 p-2">
				<h6 class="text-light">
					ETH-USD
					<span
						class="m-0 my-1"
						:class="[
							math.percentChange(
								ethHistoricRate.closes[0],
								ethHistoricRate.closes[11]
							) >= 0 ? 'text-success' : 'text-danger'
						]"
					>
						{{ ethHistoricRate.closes[11] }}
						({{
							math.percentChange(
								ethHistoricRate.closes[0],
								ethHistoricRate.closes[11]
							) >= 0 ? '+' : ''
						}}{{
							math.percentChange(
								ethHistoricRate.closes[0],
								ethHistoricRate.closes[11]
							).toFixed(2)
						}}%)
					</span>
				</h6>

				<AssetLineChart
					:labels="ethHistoricRate.labels"
					:opens="ethHistoricRate.opens"
					:highs="ethHistoricRate.highs"
					:lows="ethHistoricRate.lows"
					:closes="ethHistoricRate.closes"
					class="w-100 bg-dark"
					style="height: 200px;"
				/>
			</BCard>
		</BCol>

		<BCol cols="12" sm="4" class="">
			<!-- Doge Hour Chart -->
			<BCard bg-variant="dark" text-variant="light" no-body class="mb-3 p-2">
				<h6 class="text-light">
					DOGE-USD
					<span
						class="m-0 my-1"
						:class="[
							math.percentChange(
								dogeHistoricRate.closes[0],
								dogeHistoricRate.closes[11]
							) >= 0 ? 'text-success' : 'text-danger'
						]"
					>
						{{ dogeHistoricRate.closes[11] }}
						({{
							math.percentChange(
								dogeHistoricRate.closes[0],
								dogeHistoricRate.closes[11]
							) >= 0 ? '+' : ''
						}}{{
							math.percentChange(
								dogeHistoricRate.closes[0],
								dogeHistoricRate.closes[11]
							).toFixed(2)
						}}%)
					</span>
				</h6>
				
				<AssetLineChart
					:labels="dogeHistoricRate.labels"
					:opens="dogeHistoricRate.opens"
					:highs="dogeHistoricRate.highs"
					:lows="dogeHistoricRate.lows"
					:closes="dogeHistoricRate.closes"
					class="w-100 bg-dark"
					style="height: 200px;"
				/>
			</BCard>
		</BCol>
	</BRow>
</template>

<script>
	import AssetLineChart from '@/components/chartjs/AssetLineChart'
	import math from '@/util/math'

	export default {
		props: {
			btcHistoricRate: {
				type: Object,
				required: true
			},

			dogeHistoricRate: {
				type: Object,
				required: true
			},

			ethHistoricRate: {
				type: Object,
				required: true
			},
		},

		data() {
			return {
				math: math,
			}
		},

		components: {
			AssetLineChart,
		},
	}
</script>