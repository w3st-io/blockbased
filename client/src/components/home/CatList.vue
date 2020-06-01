<template>
	<ul class="w-100 m-0 px-0">		
		<li
			v-for="(cat, index) in cats"
			:key="index"
			class="m-0 py-2"
		>
			<a href="/">
				<article class="d-inline-block w-100">
					<!-- Image Section -->
					<div class="p-3 float-left"  style="width: 15%;">
						<img src="../../assets/images/placeholder.png" class="w-100 rounded-lg">
					</div>
					<!-- Title -->
					<div class="px-1 py-3 float-right" style="width: 85%;">
						<h4 class="text-info">{{ cat.title }}</h4>
						<p class="m-0 text-info">{{ cat.description }}</p>
					</div>
				</article>
			</a>
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		cats: {
			type: Array,
			required: true
		}
	}
}
</script>

<style scoped>
	li { list-style: none; }
	li { background: rgb(238, 238, 238); }
	li:nth-child(even) { background: white; }

</style>