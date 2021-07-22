<template>
	<div class="w-100 my-3 bg-dark">
		<div style="overflow-x: auto;">
			<table class="w-100 mb-3 table-sm table-dark">
				<tbody>
					<tr>
						<th class="w-100 text-dark badge badge-success">Technicals</th>
					</tr>
					<tr>
						<td class="text-success">Last</td><td>{{ last }}</td>
						<td class="text-success">Change</td><td>{{ change }}</td>
						<td class="text-success">Change %</td><td>{{ changePercent }}%</td>
						<td class="text-success">Volume</td><td>{{ volume }}</td>
					</tr>
					<tr>
						<td class="text-success">Market Cap.</td><td>{{ marketCap }}</td>
						<td class="text-success">Shrs. Outstanding</td><td>{{ sharesOutstanding }}</td>
						<td class="text-success">P/E</td><td>{{ peRatio }}</td>
						<td class="text-success">Average Volume</td><td>{{ avgTotalVolume }}</td>
					</tr>
					<tr>
						<td class="text-success">Dividend</td><td>{{ ttmDividendRate }}</td>
						<td class="text-success">Dividend %</td><td>{{ dividendYield }}%</td>
						<td class="text-success">Ex Div Date</td><td>{{ exDividendDate }}</td>
						<td class="text-success">Div Payment Date</td><td>{{ paymentDate }}</td>
					</tr>
				</tbody>
			</table>
			<table class="w-100 mb-3 table-sm table-dark">
				<tbody>
					<tr>
						<th class="w-100 text-dark badge badge-success">Ratios</th>
					</tr>
					<tr>
						<td class="text-success">EPS (TTM)</td><td>{{ ttmEPS }}</td>
						<td class="text-success">52 WH</td><td>{{ week52high }}</td>
						<td class="text-success">52 WL</td><td>{{ week52low }}</td>
						<td class="text-success">Float</td><td>{{ float }}</td>
					</tr>
					<tr>
						<td class="text-success">50 MA</td><td>{{ day50MovingAvg }}</td>
						<td class="text-success">200 MA</td><td>{{ day200MovingAvg }}</td>
						<td class="text-success">P/E</td><td>{{ peRatio }}</td>
						<td class="text-success">Average Volume</td><td>{{ avgTotalVolume }}</td>
					</tr>
				</tbody>
			</table>
			<table class="w-100 mb-3 table-sm table-dark">
				<tbody>
					<tr>
						<th class="w-100 text-dark badge badge-success">Other Info</th>
					</tr>
					<tr>
						<td class="text-success">CEO</td><td>{{ CEO }}</td>
						<td class="text-success">Next Earnings</td><td>{{ nextEarningsDate }}</td>
						<td class="text-success"></td><td></td>
						<td class="text-success"></td><td></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			assetData: {
				type: Object,
				required: true
			}
		},

		data: function() {
			return {
				avgTotalVolume: '',
				CEO: '',
				change: '',
				changePercent: '',
				day50MovingAvg: '',
				day200MovingAvg: '',
				dividendYield: '0',
				exDividendDate: 'yyyy-mm-dd',
				float: '',
				last: '',
				marketCap: '',
				nextEarningsDate: 'yyyy-mm-dd',
				paymentDate: 'yyyy-mm-dd',
				peRatio: '',
				sharesOutstanding: '',
				ttmDividendRate: '0.00',
				ttmEPS: '',
				volume: '',
				week52high: '',
				week52low: '' ,
			}
		},

		created: function() {
			// COMPANY //
			this.CEO = this.assetData.company.CEO
			
			// DIVIDENDS // // EARNINGS // // NEWS //
			// QUOTE //
			this.avgTotalVolume = this.formatNumber(this.assetData.quote.avgTotalVolume)
			this.change = this.assetData.quote.change
			this.changePercent = this.assetData.quote.changePercent
			this.marketCap = this.formatNumber(this.assetData.quote.marketCap)
			this.last = this.assetData.quote.latestPrice
			this.peRatio = this.assetData.quote.peRatio
			this.volume = this.formatNumber(this.assetData.quote.volume)
			
			this.sharesOutstanding = this.formatNumber(this.assetData.stats.sharesOutstanding)
			
			// STATS //
			this.day200MovingAvg = this.assetData.stats.day200MovingAvg
			this.day50MovingAvg = this.assetData.stats.day50MovingAvg
			// If there is a dividend..
			if (this.assetData.stats.ttmDividendRate) {
				this.ttmDividendRate = (this.assetData.stats.ttmDividendRate).toFixed(2)
				this.dividendYield = (this.assetData.stats.dividendYield * 100).toFixed(3)
				this.exDividendDate = this.assetData.stats.exDividendDate
				this.paymentDate = this.assetData.dividends[0].paymentDate
			}
			this.nextEarningsDate = this.assetData.stats.nextEarningsDate
			this.float = this.formatNumber(this.assetData.stats.float)
			this.ttmEPS = this.assetData.stats.ttmEPS
			this.week52high = this.assetData.stats.week52high
			this.week52low = this.assetData.stats.week52low
		},

		methods: {
			formatNumber(number) {
				let value, suffix

				if (number === null) { return null; }
				if (number >= 1e12) {
					value = number / 1e12
					suffix = 'T'
				}
				else if (number >= 1e9) {
					value = number / 1e9
					suffix = 'B'
				}
				else {
					value = number / 1e6
					suffix = 'M'
				}
				let digits = value < 10 ? 3 : 0

				return value.toFixed(digits) + suffix
			}
		}
	}
</script>

<style scoped>
	td {
		width: 12.5%;
		font-size: 1em;
		background-color: #3e444a;
	}
</style>