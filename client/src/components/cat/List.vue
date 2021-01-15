<template>
	<BCard no-body bg-variant="dark">
		<!-- Card Header -->
		<BCardHeader class="p-1">
			<h6 v-if="groupName" class="m-0 p-0">{{ groupName }}</h6>
		</BCardHeader>

		<!-- Card Body -->
		<BCardBody class="p-0">
			<BListGroup class="w-100 m-0 px-0">
				<BListGroupItem
					v-for="(cat, index) in cats" :key="index"
					class="p-0 bg-dark border-secondary"
				>
					<BRow class="m-0">
						<!-- Image Section -->
						<BCol
							cols="2" sm="2" md="2" lg="2" xl="1"
							class="p-3 align-self-center"
							@click="redirectToCatPosts(cat.cat_id)"
						>
							<div class="w-100 overflow-auto rounded-circle">
								<img
									:src="images[cat.index]"
									class="w-100 img-padding bg-primary"
								>
							</div>
						</BCol>

						<!-- Title -->
						<BCol
							cols="10" sm="10" md="10" lg="6" xl="6"
							class="py-3"
							@click="redirectToCatPosts(cat.cat_id)"
						>
							<h4 class="text-light">{{ cat.title }}</h4>
							<p class="m-0 text-light">{{ cat.description }}</p>
						</BCol>

						<!-- Count -->
						<BCol
							cols="2" sm="2" md="2" lg="1" xl="1"
							class="p-3 text-right d-none d-md-block"
							@click="redirectToCatPosts(cat.cat_id)"
						>
							<a href="#" class="text-secondary">
								<BBadge variant="unset" class="p-0 align-self-center">
									<h5 class="m-0">{{ cat.totalPosts }}</h5>
									<span class="small"><h6 class="m-0">Posts</h6></span>
								</BBadge>
							</a>
						</BCol>

						<!-- Recent Posts -->
						<BCol
							v-if="cat.recentPost"
							cols="12" sm="12" md="10" lg="3" xl="4"
							class="rounded"
						>
							<BRow>
								<BCol cols="12">
									<h1 class="m-0 mt-1 text-center small text-secondary">
										Recent Post
									</h1>
								</BCol>

								<!-- Post -->
								<BCol cols="9">
									<a
										href="#"
										class="small"
										@click="redirectToRecentPost(cat.recentPost._id)"
									>
										{{ cat.recentPost.title.replace(/(.{60})..+/, '$1…') }}
									</a>
									<p class="mb-1 small text-light">
										{{ new Date(cat.recentPost.created_at).toLocaleString() }}
									</p>
								</BCol>

								<!-- Profile -->
								<BCol cols="3" class="p-1 text-center">
									<img
										:src="cat.recentPost.user.profile_img"
										alt="x" 
										class="w-100 border border-primary rounded"
										style="max-width:50px;"
									>
									<p class="m-0 small">
										{{ cat.recentPost.user.username }} 
									</p>
								</BCol>
							</BRow>
						</BCol>
					</BRow>
				</BListGroupItem>
			</BListGroup>
		</BCardBody>
	</BCard>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'

	export default {
		props: {
			cats: { type: Array, required: true, },
			groupName: { type: String, required: false, },
		},

		data() {
			return {
				images: [
					require('../../assets/images/caticons/message-square.svg'),
					require('../../assets/images/caticons/globe.svg'),
					require('../../assets/images/caticons/globe.svg'),
					require('../../assets/images/caticons/dollar-sign.svg'),
					require('../../assets/images/caticons/zap.svg'),
					require('../../assets/images/caticons/codesandbox.svg'),
					require('../../assets/images/caticons/trending-up.svg'),
					require('../../assets/images/caticons/flag.svg'),
					require('../../assets/images/caticons/book-open.svg'),
					require('../../assets/images/caticons/archive.svg'),
				],
			}
		},

		created: async function() {
			// [LOG] //
			//this.log()
		},

		methods: {
			redirectToCatPosts(cat_id) {
				router.push({
					name: 'cat',
					params: {
						cat_id: cat_id,
						sort: 0,
						limit: 5,
						page: 1,
					}
				})
			},

			redirectToRecentPost(post_id) {
				// [REDIRECT] //
				router.push({
					name: 'post',
					params: {
						post_id: post_id,
						limit: 20,
						page: 1,
					}
				})
			},

			log() {
				console.log('%%% [COMPONENT] Cat List %%%')
				console.log('cats:', this.cats)
				console.log('totalPosts:', this.totalPosts)
			},
		}
	}
</script>

<style lang="scss" scoped>
	// [IMPORT] Personal //
	@import 'src/assets/styles/bootstrap-override.scss';

	.list-group-item {
		@extend .bg-dark;
		&:hover { @extend .bg-secondary; }
	}
	.list-group-item:nth-child(even) {
		background: $backgroundGrey !important;
		&:hover { @extend .bg-secondary; }
	}

	.img-padding { padding: 20%; }
</style>