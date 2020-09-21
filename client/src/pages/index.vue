<template>
	<div class="container">
		<div class="mt-4 row">
			<!-- [ALERTS] -->
			<div v-if="error" class="w-100 alert alert-danger">{{ error }}</div>
		</div>

		<div class="row mt-4">
			<!-- Main Content -->
			<section class="col-12 col-md-9 mb-3 p-0">
				<div class="card card-body bg-dark">
					<cat-list :cats="cats1" :postTotals="postTotals1" class="mb-3" />
					<cat-list :cats="cats2" :postTotals="postTotals2" class="mb-3" />
					<cat-list :cats="cats3" :postTotals="postTotals3" class="mb-3" />
				</div>
			</section>

			<!-- Side Content -->
			<section class="col-12 col-md-3">
				<side-card />
			</section>
		</div>
	</div>
</template>

<script>
	// [IMPORT] //
	import CatList from '@components/cat/List'
	import SideCard from '@components/forum/SideCard'
	import PageService from '../services/PageService'
	import { cats } from '@defaults/cats'

	// [EXPORT] //
	export default {
		components: {
			CatList,
			SideCard
		},

		data: function() {
			return {
				cats1: cats.slice(0, 2),
				cats2: cats.slice(2, 5),
				cats3: cats.slice(5),
				dbCats: [],
				postTotals1: [],
				postTotals2: [],
				postTotals3: [],
				error: '',
			}
		},

		created: async function() {
			try { this.dbCats = await PageService.s_home() }
			catch (err) { this.error = err }

			if (this.dbCats.status) {
				this.postTotals1 = this.dbCats.cats.slice(0, 2)
				this.postTotals2 = this.dbCats.cats.slice(2, 5)
				this.postTotals3 = this.dbCats.cats.slice(5)
			}
			else { this.error = this.dbCats.message }
			
		},
	}
</script>