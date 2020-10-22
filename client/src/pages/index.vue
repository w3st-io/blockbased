<template>
	<div class="container">
		<!-- [CONTENT] -->
		<div v-if="!loading" class="row mt-3">
			<!-- Main Content -->
			<section class="col-12 col-md-9 mb-3 p-0">
				<div class="card card-body bg-dark">
					<CatList :cats="cats1" :totalPosts="totalPosts1" class="mb-3" />
					<CatList :cats="cats2" :totalPosts="totalPosts2" class="mb-3" />
					<CatList :cats="cats3" :totalPosts="totalPosts3" class="mb-3" />
				</div>
			</section>

			<!-- Side Content -->
			<section class="col-12 col-md-3">
				<adsense
					ad-client="ca-pub-5696881492897672"
					ad-slot="XXXXXXXX"
					ad-style="display: block"
					ad-format="auto"
				></adsense>
			</section>
		</div>

		<!-- [ALERTS] -->
		<div v-if="error" class="row mt-3">
			<div class="col-12">
				<div class="alert alert-danger">{{ error }}</div>
			</div>
		</div>

		<!-- [LOADING] -->
		<section v-show="loading" class="row mt-3">
			<div class="col-12">
				<Alert />
			</div>
		</section>

		
	</div>
</template>

<script>
	// [IMPORT] //
	import CatList from '@components/cat/List'
	import Alert from '../components/misc/Alert'
	import PageService from '@services/PageService'
	import { cats } from '@defaults/cats'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			CatList,
		},

		data: function() {
			return {
				error: '',
				loading: true,
				dbCats: [],
				cats1: cats.slice(0, 2),
				cats2: cats.slice(2, 5),
				cats3: cats.slice(5),
				totalPosts1: [],
				totalPosts2: [],
				totalPosts3: [],
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