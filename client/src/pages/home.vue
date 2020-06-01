<template>
	<div class="container">
		<div class="m-3 row">
			<!-- Main Content -->
			<section class="col-12 col-md-9">
				<div class="shadow-sm">
					<cat-list :cats="cats" />
				</div>
			</section>

			<!-- Side Content -->
			<section class="col-12 col-md-3">
				<div class="card card-body">this is a card</div>
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