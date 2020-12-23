<template>
	<BContainer>
		<BRow v-if="!loading" class="mt-3">
			<!-- Main Content -->
			<BCol cols="md-9" class="mb-3 p-0">
				<BCard bg-variant="dark" class="text-light">
					<CatList :cats="cats1" class="mb-3" />
					<CatList :cats="cats2" class="mb-3" />
					<CatList :cats="cats3" class="mb-3" />
				</BCard>
			</BCol>

			<!-- Side Content -->
			<BCol cols="md-3">
				<!-- Popular Posts -->
				<BCard bg-variant="dark" class="text-light">
					<h6>Popular Posts</h6>
				</BCard>

				<!-- Adsense -->
				<Adsense />
			</BCol>
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
		</Brow>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import Adsense from '@components/adsense'
	import CatList from '@components/cat/List'
	import Alert from '@components/misc/Alert'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Adsense,
			Alert,
			CatList,
		},

		data: function() {
			return {
				returned: [],
				cats1: [],
				cats2: [],
				cats3: [],
				error: '',
				loading: true,
			}
		},

		created: async function() {
			try { this.returned = await PageService.s_home() }
			catch (err) { this.error = err }

			if (this.returned.status) {
				this.cats1 = this.returned.cats.slice(0, 2)
				this.cats2 = this.returned.cats.slice(2, 5)
				this.cats3 = this.returned.cats.slice(5)

				this.loading = false
			}
			else { this.error = this.returned.message }

			
		},
	}
</script>