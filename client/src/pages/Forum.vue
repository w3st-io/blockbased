<template>
	<div class="container">
		<div class="row">
			<!-- Main Content -->
			<section class="col-12 col-md-9 my-4 card card-body bg-dark">
				<cat-list :cats="cats1" class="" />
				<cat-list :cats="cats2" class="mt-3" />
				<cat-list :cats="cats3" class="mt-3" />
			</section>

			<!-- Side Content -->
			<section class="col-12 col-md-3 my-4">
				<side-card />
			</section>
		</div>
	</div>
</template>

<script>
	// [IMPORT] //
	import CatList from '@components/cat/List'
	import SideCard from '@components/pages/forum/SideCard'
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
				
			}
		},
	}
</script>