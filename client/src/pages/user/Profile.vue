<template>
	<div class="container">
		<div class="row">
			<!-- Side Content -->
			<section class="col-12 col-md-3 mt-4 hidden-768">
				<div class="card card-body bg-dark">
					<img
						src="../../assets/images/placeholder.jpg"
						alt="Profile Image Here"
						class="w-100"
					>
				</div>
			</section>

			<!-- Main Content -->
			<section class="col-12 col-md-9 mt-4">
				<div class="card card-body bg-dark">
					<h4 class="text-light mb-2">Your Profile</h4>

					<table class="w-100 table-sm table-dark">
						<tr>
							<td class="w-25">Name</td>
							<td>{{ first_name }} {{ last_name }}</td>
						</tr>
						<tr>
							<td>Username</td>
							<td>{{ username }}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{{ email }}</td>
						</tr>
					</table>
				</div>
			</section>
		</div>

		<button class="mt-3 btn btn-secondary">Edit Your Profile</button>
	</div>
</template>

<script>
	// [IMPORT] //
	import jwtDecode from 'jwt-decode'
	import router from '@router'

	// [EXPORT] //
	export default {
		data: function() {
			// [INIT]
			const decoded = jwtDecode(localStorage.usertoken)

			// [RETURN]
			return {
				first_name: decoded.first_name,
				last_name: decoded.last_name,
				username: decoded.username,
				email: decoded.email
			}
		},

		created: function() {
			// [REDIRECT] Not Log Required //
			if (!localStorage.usertoken) {
				router.push({ name: 'Dashboard' })
			}
		},
	}
</script>

<style scoped>
	td { color: white; }

	@media screen and (max-width: 768px) {
		.hidden-768 {
			display: none !important;
		}
	}
</style>