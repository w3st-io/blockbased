<template>
	<transition-group
		name="fade"
		tag="div"
		class="d-flex flex-wrap fixed-bottom my-3 mr-4 ml-auto"
	>
		<div
			v-for="(notification, index) in notifications"
			:key="index"
			class="
				card
				card-sm
				flex-card
				w-100
				mb-3
				text-light
				bg-primary
				border-primary
				shadow
				fade-in
			"
		>
			<div class="card-header">
				{{ notification }}
				<button type="button" class="ml-2 mb-1 close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="card-body">
				<p class="card-text">
					Some quick content.
				</p>
			</div>
		</div>
	</transition-group>
</template>

<script>
	export default {
		data: function() {
			return {
				notifications: ['notification', 'notification']
			}
		},

		created: async function() {
			this.activate()
		},

		methods: {
			activate() {
				setTimeout(() => this.notifications.push('new notification'), 5000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fade-in {
		opacity: 1;
		animation-name: fadeInOpacity;
		animation-iteration-count: 1;
		animation-timing-function: ease-in;
		animation-duration: 1s;
	}

	@keyframes fadeInOpacity {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}
</style>