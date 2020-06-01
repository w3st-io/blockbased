<template>
	<div class="container">
		<div class="m-3 row">
			<!-- Main Content -->
			<section class="col-12 col-md-9">
				<cat-list :cats="cats1" class="mt-0" />
				<cat-list :cats="cats2" class="mt-3" />
				<cat-list :cats="cats3" class="mt-3" />
			</section>

			<!-- Side Content -->
			<section class="col-12 col-md-3">
				<div class="card card-body bg-dark border-secondary">
					<h6 class="text-light">this is a card</h6>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	import CatList from '../components/home/CatList'
	import { cats } from '../../defaults/cats'

	export default {
		components: {
			CatList
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