<template>
	<BContainer class="my-3">
		<BCard bg-variant="dark">
			<BRow>
				<BCol cols="12">
					<h1 class="text-center text-primary">Components Examples</h1>
				</BCol>

				<BCol cols="12" sm="4">
					<RouterLink to="/example/bcarousel">
						<BButton class="w-100 mb-3">BCarousel</BButton>
					</RouterLink>

					<RouterLink to="/example/conveyor">
						<BButton class="w-100 mb-3">Conveyor</BButton>
					</RouterLink>

					<RouterLink to="/example/get-quote">
						<BButton class="w-100 mb-3">Get Quote</BButton>
					</RouterLink>
					
					<RouterLink to="/example/parallax">
						<BButton class="w-100 mb-3">Parallax</BButton>
					</RouterLink>

					<RouterLink to="/example/hours-and-contact">
						<BButton class="w-100 mb-3">Hours and Contact</BButton>
					</RouterLink>
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>