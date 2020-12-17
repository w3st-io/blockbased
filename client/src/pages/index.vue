<template>
	<BContainer>
		<BRow v-if="!loading" class="mt-3">
			<!-- Main Content -->
			<BCol cols="md-9" class="mb-3 p-0">
				<BCard bg-variant="dark">
					<CatList :cats="cats1" :totalPosts="totalPosts1" class="mb-3" />
					<CatList :cats="cats2" :totalPosts="totalPosts2" class="mb-3" />
					<CatList :cats="cats3" :totalPosts="totalPosts3" class="mb-3" />
				</BCard>
			</BCol>

			<!-- Side Content -->
			<BCol cols="md-3"><Adsense /></BCol>
		</BRow>

		<!-- [ALERTS] -->
		<BRow v-if="error" class="mt-3">
			<BCol cols="12">
				<div class="alert alert-danger">{{ error }}</div>
			</BCol>
		</BRow>

		<!-- [LOADING] -->
		<BRow v-show="loading" class="mt-3 row">
			<BCol cols="12">
				<Alert BSColor="dark" />
			</BCol>
		</BRow>

		<BRow>
			<div id="token-txs-10"></div>
		</Brow>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import Adsense from '@components/adsense'
	import CatList from '@components/cat/List'
	import Alert from '@components/misc/Alert'
	import PageService from '@services/PageService'
	import { cats } from '@defaults/cats'

	// [EXPORT] //
	export default {
		components: {
			Adsense,
			Alert,
			CatList,
		},

		data: function() {
			return {
				dbCats: [],
				cats1: cats.slice(0, 2),
				cats2: cats.slice(2, 5),
				cats3: cats.slice(5),
				totalPosts1: [],
				totalPosts2: [],
				totalPosts3: [],
				error: '',
				loading: true,
			}
		},

		created: async function() {
			try { this.dbCats = await PageService.s_home() }
			catch (err) { this.error = err }

			if (this.dbCats.status) {
				this.totalPosts1 = this.dbCats.cats.slice(0, 2)
				this.totalPosts2 = this.dbCats.cats.slice(2, 5)
				this.totalPosts3 = this.dbCats.cats.slice(5)

				this.loading = false
			}
			else { this.error = this.dbCats.message }

			
		},
	}
</script>