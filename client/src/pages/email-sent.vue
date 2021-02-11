<template>
	<div>
		<!-- Parallax Image Above -->
		<Parallax />

		<BContainer class="my-3">
			<BCard bg-variant="white" class="text-center">
				<h1 class="text-center text-primary">Email Sent!</h1>
				<p>We will get back to you as soon as possible!</p>

				<a href="/" class="m-auto text-center">
					<BButton variant="primary" class="m-auto text-center">
						Return Home
					</BButton>
				</a>
			</BCard>
		</BContainer>
	</div>
</template>

<script>
	import Parallax from '../components/display/Parallax'

	export default {
		components: {
			Parallax
		},
	}
</script>