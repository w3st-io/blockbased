<template>
	<BContainer class="my-5">
		<BRow>
			<BCol cols="12">
				<BJumbotron bg-variant="dark" class="w-100 shadow">
					<h1 class="w-100 mb-3 text-center text-light">404 Not Found</h1>

					<div class="w-100 m-auto text-center">
						<RouterLink to="/">
							<BButton variant="primary" class="m-auto">
								Go Home
							</BButton>
						</RouterLink>
					</div>
				</BJumbotron>
			</BCol>
		</BRow>
	</BContainer>
</template>