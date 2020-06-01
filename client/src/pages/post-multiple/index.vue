<template>
	<section class="container">
		<article class="row">
			<h1 class="mt-3 text-light">{{ cat_id }}</h1>

			<ul class="w-100 m-0 px-0 border border-secondary">
				<li
					
					class="m-0 bg-dark"
				>
					<article
						class="d-inline-block w-100"
					>
						<!-- Title -->
						<div class="w-100 p-2 float-right" >
							<h4 class="text-light">Title Here</h4>
							<p class="m-0 text-light">something else here</p>
						</div>
					</article>
				</li>
				<li
					
					class="m-0 bg-dark"
				>
					<article
						class="d-inline-block w-100"
					>
						<!-- Title -->
						<div class="w-100 p-2 float-right" >
							<h4 class="text-light">Title Here</h4>
							<p class="m-0 text-light">something else here</p>
						</div>
					</article>
				</li>
				<li
					
					class="m-0 bg-dark"
				>
					<article
						class="d-inline-block w-100"
					>
						<!-- Title -->
						<div class="w-100 p-2 float-right" >
							<h4 class="text-light">Title Here</h4>
							<p class="m-0 text-light">something else here</p>
						</div>
					</article>
				</li>
			</ul>
		</article>
	</section>
</template>

<script>
	/*** [EXPORT] ***/
	export default {
		data: function() {
			return{
				cat_id: this.$route.params.cat_id
			}
		}
	}
</script>

<style scoped>
	li { list-style: none; }
	li { background: #343a40 !important; }
	li:nth-child(even) { background: #42484e !important; }
</style>