<template>
	<div id="app">
		<nav-bar />
		<topics />
	</div>
</template>

<script>
	import NavBar from './components/NavBar'
	import Topics from './components/Topics'

	export default {
		name: 'App',
		components: {
			NavBar,
			Topics
		}
	}
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
	}
	.bg-info {
		background-color: #3d157d !important;
	}
	.text-info {
		color: #3d157d !important;
	}
</style>
