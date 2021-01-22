<template>
	<div class="">
		<div v-for="(block, index) in cleanJSON.blocks" :key="index">
			<!-- Headers -->
			<h1 v-if="block.type == 'header' && block.data.level == 1">
				{{ block }}
			</h1>

			<h2 v-if="block.type == 'header' && block.data.level == 2">
				{{ block }}
			</h2>

			<h3 v-if="block.type == 'header' && block.data.level == 3">
				{{ block }}
			</h3>

			<h4 v-if="block.type == 'header' && block.data.level == 4">
				{{ block }}
			</h4>

			<h5 v-if="block.type == 'header' && block.data.level == 5">
				{{ block }}
			</h5>

			<h6 v-if="block.type == 'header' && block.data.level == 6">
				{{ block }}
			</h6>

			<!-- Paragraph -->
			<p v-if="block.type == 'paragraph'">{{ block.data.text }}</p>

			<!-- Delimiter -->
			<h1 v-if="block.type == 'delimiter'" class="w-100 text-center">***</h1>

			<!-- Unordered List -->
			<ul v-if="block.type == 'list' && block.data.style == 'unordered'">
				<li v-for="(li, index) in block.data.items" :key="index">
					{{ li }}
				</li>
			</ul>

			<!-- Ordered List -->
			<ol v-if="block.type == 'list' && block.data.style == 'ordered'">
				<li v-for="(li, index) in block.data.items" :key="index">
					{{ li }}
				</li>
			</ol>

			<!-- Code -->
			<code v-if="block.type == 'code'">
				{{ block.data.code }}
			</code>

			<!-- Quote -->
			<figure v-if="block.type == 'quote'">
				<blockquote>
					<i>{{ block.data.text }}</i>
				</blockquote>
				<figcaption>{{ block.data.caption }}</figcaption>
			</figure>

			<!-- Table -->
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			cleanJSON: {
				type: Object,
				required: true,
			}
		},

		data() {

		},
	}
</script>