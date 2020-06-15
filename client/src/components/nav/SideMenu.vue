<template>
	<nav
		class="bg-dark shadow opacity-90 nav-drawer-menu"
		:class="{ isOpen: sideMenuOpen }"
		style="z-index: 1040;"
	>
		<button
			class="w-100 m-0 p-2 btn btn-dark bg-secondary text-center text-info"
			@click="closeMenu"
		>
			<span aria-hidden="true" style="font-size: 2em;">&times;</span>
		</button>

		<button
			class="w-100 btn btn-info"
			v-on:click="homeBtn()"
		>Forum</button>
	</nav>
</template>
<script>
	// [IMPORT] //
	import { EventBus } from '@main'
	import router from '@router'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				sideMenuOpen: false,
				query: ''
			}
		},

		created: function() {
			// [--> EMITT] //
			EventBus.$on('navBarSideMenuBtnClicked', () => {
				this.sideMenuOpen = !this.sideMenuOpen
			})
		},

		methods: {
			closeMenu() { this.sideMenuOpen = !this.sideMenuOpen },

			homeBtn() {
				this.sideMenuOpen = !this.sideMenuOpen
				router.push({ path: '/' })
			},
		}
	}
</script>

<style scoped>
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
	}
	.nav-drawer-menu button:hover { background: #212529; }
	
	.isOpen { width: 75%; }
</style>