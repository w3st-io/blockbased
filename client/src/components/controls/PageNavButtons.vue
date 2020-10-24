<template>
	<ul class="pagination w-100 m-0">
		<li class="page-item text-center" style="width: 15%;">
			<a @click="start()" class="p-1 page-link text-light bg-dark">&lt;&lt;</a>
		</li>

		<!-- Left -->
		<li class="page-item text-center" style="width: 25%;">
			<a @click="prev()" class="p-1 page-link text-light bg-dark">⟵</a>
		</li>

		<!-- Page Number -->
		<li class="page-item text-center" style="width: 20%;">
			<a class="p-1 page-link text-light bg-dark">
				{{ badgeValue }}
			</a>
		</li>

		<!-- Right -->
		<li class="page-item text-center" style="width: 25%;">
			<a @click="next()" class="p-1 page-link text-light bg-dark">⟶</a>
		</li>

		<li class="page-item text-center" style="width: 15%;">
			<a @click="end()" class="p-1 page-link text-light bg-dark">&gt;&gt;</a>
		</li>
	</ul>
</template>

<script>
	// [IMPORT] //

	// [EXPORT] //
	export default {
		props: {
			badgeValue: { type: Number, required: true, },
		},

		created: async function() {
			// [LOG] //
			//this.log()
		},

		methods: {
			start() { this.$emit('start-btn') },
			
			prev() { this.$emit('prev-btn') },

			next() { this.$emit('next-btn') },

			end() { this.$emit('end-btn') },

			log() {
				console.log('%%% [COMPONENT] PageNavButtons %%%')
				console.log('leftBtnEmitName:', this.leftBtnEmitName)
				console.log('rightBtnEmitName:', this.rightBtnEmitName)
				console.log('badgeValue:', this.badgeValue)
			},
		},
	}
</script>