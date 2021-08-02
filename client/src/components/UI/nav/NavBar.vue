<template>
	<div>
		<!-- Top Bar -->
		<div class="bg-dark bg-secondary border-bottom border-primary">
			<BContainer>
				<nav class="px-0 navbar navbar-expand-lg navbar-dark">
					<!-- Logo -->
					<RouterLink to="/" class="navbar-brand">
						<mark class="h4 bg-primary text-light">
							{{ defaultData.companyName }}
						</mark>
					</RouterLink>

					<!-- Hidden Menu Button -->
					<button class="navbar-toggler" @click="toggle()">
						<span class="navbar-toggler-icon"></span>
					</button>

					<!-- Top Menu -->
					<div class="collapse navbar-collapse">
						<div class="navbar-nav mr-auto"></div>

						<SearchForm />
					</div>
				</nav>
			</BContainer>
		</div>
		
		<!-- Bottom Bar -->
		<div class="p-0 bg-dark border-bottom border-dark shadow-sm">
			<BContainer>
				<BNavbar class="px-0 py-1">
					<div class="mr-auto d-none d-sm-block">
						<RouterLink
							v-for="(button, i) in buttons"
							:key="i"
							:to="button.path"
						>
							<BButton variant="outline-light" size="sm" class="ml-2">
								<span v-if="button.text">{{ button.text }}</span>
								<span v-else v-html="button.navIcon"></span>
							</BButton>
						</RouterLink>
					</div>

					<div>
						<!-- Logged In -->
						<NotificationMenu v-if="$store.state.userLogged" />

						<BButton
							v-if="$store.state.userLogged"
							variant="outline-primary"
							size="sm"
							class="ml-2"
							@click="profileRedirect()"
						>{{ $store.state.user_decoded.username }}</BButton>

						<!-- NOT Logged In -->
						<BButton
							v-if="!$store.state.userLogged"
							variant="outline-secondary"
							size="sm"
							@click="loginRedirect()"
						>Login</BButton>
						
						<BButton
							v-if="!$store.state.userLogged"
							variant="outline-primary"
							size="sm"
							class="ml-2"
							@click="registerRedirect()"
						>Register</BButton>
					</div>
				</BNavbar>
			</BContainer>
		</div>

		<!-- Hidden Side Menu -->
		<SideMenu />
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import NotificationMenu from '@/components/notifications/NotificationMenu'
	import SearchForm from '@/components/search/SearchForm'
	import SideMenu from '@/components/UI/nav/SideMenu'
	import defaultData from '@/defaults/companyInfo'
	import buttons from '@/defaults/pageLinks'
	import router from '@/router'

	export default {
		components: {
			NotificationMenu,
			SearchForm,
			SideMenu,
		},

		data() {
			return {
				defaultData: defaultData,
				query: '',
				notifications: '',
				totalNotifications: 0,
				buttons: buttons,
			}
		},

		methods: {
			loginRedirect() { router.push({ name: 'user_login' }) },

			registerRedirect() { router.push({ name: 'register' }) },

			profileRedirect() { router.push({ name: 'user_profile' }) },

			toggle() { this.$store.state.showMenu = !this.$store.state.showMenu },
		},
	}
</script>