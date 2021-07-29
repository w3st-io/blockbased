<template>
	<BContainer class="my-3">
		<BRow class="">
			<BCol cols="12">
				<!-- Adsense -->
				<Adsense class="mb-3 bg-dark" />
			</BCol>
		</BRow>

		<!-- Crypto Market -->
		<CryptoChart
			v-if="!loading"
			:btcHistoricRate="btcHistoricRate"
			:dogeHistoricRate="dogeHistoricRate"
			:ethHistoricRate="ethHistoricRate"
		/>

		<BRow v-if="!loading && newsObj.length > 0">
			<BCol cols="12" lg="8" xl="9">
				<!-- [FINNHUB] News -->
				<BCard
					no-body
					bg-variant="dark"
					text-variant="light"
					class="mb-3 px-3 py-2 pb-4"
				>
					<h6 class="text-center text-light">
						<span class="bg-primary px-1">Latest News</span>
					</h6>
					<MainArticle :news="newsObj[0]" class="d-none d-sm-block mb-4" />
					<ArticleConveyor :slides="newsObj.slice(0, 15)" />
				</BCard>
			</BCol>

			<!-- Side Content -->
			<BCol cols="12" lg="4" xl="3">
				<BCard
					v-if="cryptoPrices.length > 0"
					bg-variant="dark"
					no-body
					class="mb-3 p-2 text-light"
				>
					<!-- Crypto Prices -->
					<CryptoPrices :cryptoPrices="cryptoPrices"/>
				</BCard>

				<!-- Google Adsense -->
				<BCard
					bg-variant="dark"
					class="mb-3 p-1 text-light"
					no-body
				>
					<h6 class="text-center text-secondary">Sponsor</h6>

					<!-- Adsense -->
					<AdsenseTall />
				</BCard>
			</BCol>
		</BRow>

		<!-- Main Content -->
		<BRow v-if="!loading" class="mb-3">
			<BCol cols="lg-9" class="mb-3 p-0">
				<BCard bg-variant="dark" text-variant="light">
					<CatList
						:categories="categories"
						groupName="General"
						class="mb-3"
					/>
				</BCard>				
			</BCol>

			<!-- Side Content -->
			<BCol cols="12" lg="3">
				<TopPosts :topPosts="topPosts" />
			</BCol>
		</BRow>

		<!-- [LOADING] -->
		<BRow v-if="loading" class="mt-3 row">
			<BCol cols="12">
				<Alert variant="dark" />
			</BCol>
		</BRow>

		<!-- [ERROR] -->
		<BRow v-if="error" class="mt-3 row">
			<BCol cols="12">
				<Alert variant="danger" :message="error" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import Adsense from '@/components/adsense'
	import AdsenseTall from '@/components/adsense/Tall'
	import CatList from '@/components/cat/List'
	import Alert from '@/components/inform/Alert'
	import ArticleConveyor from '@/components/home/ArticleConveyor'
	import CryptoChart from '@/components/home/CryptoChart'
	import CryptoPrices from '@/components/home/CryptoPrices'
	import MainArticle from '@/components/home/MainArticle'
	import TopPosts from '@/components/home/TopPosts'
	import router from '@/router'
	import PageService from '@/services/PageService'

	export default {
		data() {
			return {
				loading: true,
				error: '',
				btcHistoricRate: [],
				ethHistoricRate: [],
				dogeHistoricRate: [],
				cryptoPrices: [],

				reqData: [],
				categories: [],
				topPosts: [],
				newsObj: {},
			}
		},

		components: {
			ArticleConveyor,
			Adsense,
			AdsenseTall,
			CatList,
			Alert,
			CryptoChart,
			CryptoPrices,
			MainArticle,
			TopPosts,
		},

		methods: {
			async getPageData() {
				try {
					this.reqData = await PageService.s_home()
					
					// [REDIRECT] Custom Home Page Available //
					if (this.reqData.customHome == true) {
						router.push({ name: 'home' })
					}

					if (this.reqData.status) {
						this.btcHistoricRate = this.reqData.btcHistoricRate

						this.ethHistoricRate = this.reqData.ethHistoricRate

						this.dogeHistoricRate = this.reqData.dogeHistoricRate
						
						this.cryptoPrices = this.reqData.cryptoQuoteObj.returnVal

						this.newsObj = this.reqData.newsObj
						this.newsObj = this.reqData.news

						this.categories = this.reqData.categories

						this.topPosts = this.reqData.topPosts
					}
					else { this.error = this.reqData.message }
				}
				catch (err) { this.error = err }
			},

			log() {
				console.log('%%% [/] %%%')
				console.log('reqData:', this.reqData)
			}
		},

		async created() {
			await this.getPageData()

			this.loading = false

			this.log()
		},
	}
</script>