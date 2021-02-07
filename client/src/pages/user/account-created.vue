<template>
	<BContainer>
		<BRow>
			<BCol class="text-center text-light">
				<BCard bg-variant="dark" class="mx-auto my-3" style="max-width: 500px;">
					<h2 class="mb-4 text-success">Account Created!</h2>
					<h5>Please check your email so you can verify your account</h5>
						
					<MailIcon size="8x" class="text-success" />
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] //
	import { MailIcon } from 'vue-feather-icons'

	export default {
		components: {
			MailIcon,
		}
	}
</script>