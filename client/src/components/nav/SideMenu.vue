<template>
	<nav
		class="bg-dark shadow opacity-90 nav-drawer-menu"
		:class="{ isOpen: sideMenuOpen }"
		style="z-index: 1040;"
	>
		<BButton
			variant="dark"
			class="w-100 m-0 p-2 bg-secondary text-center text-primary"
			@click="closeMenu"
		>
			<span aria-hidden="true" style="font-size: 2em;">&times;</span>
		</BButton>

		<BButton variant="primary" class="w-100" @click="homeBtn()">
			Forum
		</BButton>
	</nav>
</template>
<script>
	// [IMPORT] //
	import router from '@router'

	// [EXPORT] //
	export default {
		props: {
			sideMenuOpen: {
				type: Boolean,
				required: true,
			}
		},

		data() {
			return {
				query: ''
			}
		},

		methods: {
			closeMenu() {
				this.sideMenuOpen = !this.sideMenuOpen
				this.$emit('closeMenu')
			},

			homeBtn() {
				this.sideMenuOpen = !this.sideMenuOpen
				router.push({ name: '/' })
			},
		}
	}
</script>

<style lang="scss" scoped>
	.nav-drawer-menu {
		position: fixed;
		top: 0;
		right: 0;

		height: 100%;
		width: 0;

		overflow-x: hidden;
		transition: 0.5s;
	}

	.nav-drawer-menu button {
		transition: 0.3s;
		font-size: 2em;

		&:hover { background: #212529; }
	}
	
	.isOpen { width: 75%; }
</style>