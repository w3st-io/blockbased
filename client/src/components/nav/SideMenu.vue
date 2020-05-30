<template>
	<div
		class="bg-dark shadow opacity-90 nav-drawer-menu"
		style="z-index: 1040;"
		:class="{ isOpen: sideMenuOpen }"
	>
		<button
			class="w-100 m-0 p-2 btn btn-dark bg-dark text-center text-success"
			@click="closeMenu"
		>
			<span aria-hidden="true" style="font-size: 2em;">&times;</span>
		</button>

		<form class="form-inline">
				<input
					placeholder="Ticker"
					class="w-100 form-control border-secondary bg-dark text-white"
					style="font-size: 2em;"
					v-model="query"
				>
				<button
					type="submit"
					class="w-100 btn btn-success my-1"
					style="font-size: 2em;"
					v-on:click="redirectToQuote(query)"
				><span class="glyphicon glyphicon-search">search</span></button>
			</form>

		<button
			class="w-100 btn btn-success"
			v-on:click="homeBtn();"
		>Home</button>
	</div>
</template>
<script>
	/*** [IMPORT] ***/
	import { EventBus } from '../../main'
	import router from '../../router'

	/*** [EXPORT] ***/
	export default {
		data: function() {
			return {
				sideMenuOpen: false,
				query: ''
			}
		},

		created: function() {
			EventBus.$on('navBarSideMenuBtnClicked', () => {
				this.sideMenuOpen = !this.sideMenuOpen
			})
		},

		methods: {
			redirectToQuote(query) {
				this.sideMenuOpen = !this.sideMenuOpen
				
				// [REDIRECT] // [EMIT OUT] --> // Clear Field //
				router.push({ path: `/quote/${query}` })
				this.$emit('query')
				this.query = ''
			},

			closeMenu() {
				this.sideMenuOpen = !this.sideMenuOpen
			},

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