<template>
	<div>
		<BRow>
			<BCol cols="5">Asset</BCol>
			<BCol cols="7">Price</BCol>
		</BRow>

		<BRow
			v-for="(c, i) in cryptoPrices"
			:key="i"
			class="m-0 border border-custom"
			:class="{ 'isEven': isEven(i) }"
		>
			<BCol cols="5" class="p-0">
				<p class="m-0 my-1">{{ c.product_id }}</p>
			</BCol>

			<BCol cols="7" class="p-0">
				<p
					class="m-0 my-1"
					:class="[
						math.percentChange(c.open_24h, c.close) >= 0 ?
						'text-success' : 'text-danger'
					]"
				>
					{{ c.close.toFixed(2) }}
					<span class="float-right" style="font-size: 14px;">
						({{
							math.percentChange(c.open_24h, c.close) >= 0 ? '+' : ''
						}}{{
							math.percentChange(c.open_24h, c.close).toFixed(2)
						}}%)
					</span>
				</p>
			</BCol>
		</BRow>
	</div>
</template>

<script>
	import math from '@/util/math'

	export default {
		props: {
			cryptoPrices: {
				type: Array,
				required: true,
			},
		},

		data() {
			return {
				math: math,
			}
		},

		methods: {
			isEven(i) {
				if ( i % 2 == 0) return true
				else return false
			},
		},
	}
</script>

<style lang="scss" scoped>
	.isEven {
		background-color: rgba(201, 139, 58, 0.2) !important;
	}

	.border-custom {
		border-color: rgba(201, 139, 58, 0.2) !important;
	}
</style>