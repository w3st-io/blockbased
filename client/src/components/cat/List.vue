<template>
	<BListGroup class="w-100 m-0 px-0">
		<BListGroupItem
			v-for="(cat, index) in cats" :key="index"
			class="p-0 bg-dark border-secondary"
		>
			<BRow class="m-0">
				<!-- Image Section -->
				<BCol
					cols="3"
					sm="2"
					md="2"
					lg="1"
					class="p-3 align-self-center"
					@click="redirectToCatPosts(cat.cat_id)"
				>
					<div class="w-100 overflow-auto rounded-circle">
						<img :src="images[index]" class="w-100 bg-primary img-padding">
					</div>
				</BCol>

				<!-- Title -->
				<BCol
					cols="9"
					sm="10"
					md="5"
					lg="6"
					class="py-3"
					@click="redirectToCatPosts(cat.cat_id)"
				>
					<h4 class="text-light">{{ cat.title }}</h4>
					<p class="m-0 text-light hidden-768">{{ cat.description }}</p>
				</BCol>

				<!-- Count -->
				<BCol
					cols="2"
					lg="1"
					class="p-3 text-right hidden-768 hidden-1200"
					@click="redirectToCatPosts(cat.cat_id)"
				>
					<a href="">
						<BBadge variant="unset" class="align-self-center text-light">
							<span class="m-0">
								<h5 class="m-0">{{ cat.totalPosts }}</h5>
								<span class="small"><h6 class="m-0">Posts</h6></span>
							</span>
						</BBadge>
					</a>
				</BCol>

				<!-- Recent Posts -->
				<BCol
					v-if="cat.recentPost"
					cols="3"
					md="5"
					lg="4"
					class="hidden-768"
				>
					<BRow>
						<BCol cols="12">
							<h1 class="m-0 mt-1 text-center small">Recent Post</h1>
						</BCol>

						<BCol cols="3" class="p-1">
							<img
								:src="cat.recentPost.user.profileImg"
								alt="x" 
								class="w-100 border border-primary rounded"
							>
							<p class="text-center text-secondary">
								{{ cat.recentPost.user.username }}
							</p>
						</BCol>

						<BCol cols="9">
							<a
								href="#"
								class="small"
								@click="redirectToRecentPost(cat.recentPost._id)"
							>
								{{ cat.recentPost.title.replace(/(.{60})..+/, "$1…") }}
							</a><br>
							<p class="small">
								{{ new Date(cat.recentPost.created_at).toLocaleString() }}
							</p>
						</BCol>
					</BRow>
				</BCol>
			</BRow>
		</BListGroupItem>
	</BListGroup>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'

	export default {
		props: {
			cats: { type: Array, required: true, },
		},

		data() {
			return {
				images: [
					require('../../assets/images/caticons/message-square.svg'),
					require('../../assets/images/caticons/globe.svg'),
					require('../../assets/images/caticons/zap.svg'),
					require('../../assets/images/caticons/codesandbox.svg'),
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
						limit: 5,
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

	@media screen and (max-width: 768px) {
		.hidden-768 { display: none !important; }
	}

	@media screen and (max-width: 1200px) {
		.hidden-1200 { display: none !important; }
	}
</style>