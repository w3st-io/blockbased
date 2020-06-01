<template>
	<div class="container">
		<div class="m-3 row">
			<!-- Main Content -->
			<section class="col-12 col-md-9">
				<cat-list :cats="cats" />
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
				cats: cats,
				
			}
		},
	}
</script>