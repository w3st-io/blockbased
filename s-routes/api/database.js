// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const config = require('../../s-config')
const productAddition = require('../../s-defaults/productAdditions')
const productExtras = require('../../s-defaults/productExtras')
const productOptions = require('../../s-defaults/productOptions')
const productVariants = require('../../s-defaults/productVariants')
const products = require('../../s-defaults/products')

const ProductAdditionModel = require('../../s-models/ProductAdditionModel')
const ProductExtraModel = require('../../s-models/ProductExtraModel')
const ProductModel = require('../../s-models/ProductModel')
const ProductOptionModel = require('../../s-models/ProductOptionModel')
const ProductVariantModel = require('../../s-models/ProductVariantModel')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [MAIN-ROUTE] //
router.get(
	'/initialize',
	async (req, res) => {
		try {
			// Empty out database //
			await ProductAdditionModel.deleteMany()
			await ProductExtraModel.deleteMany()
			await ProductModel.deleteMany()
			await ProductOptionModel.deleteMany()
			await ProductVariantModel.deleteMany()

			// PRODUCT OPTIONS //
			for (let i = 0; i < productOptions.length; i++) {
				const p = productOptions[i]
				
				// [SAVE] //
				await new ProductOptionModel({
					_id: mongoose.Types.ObjectId(),
					cat: p.cat,
					type: p.type,
					name: p.name,
					description: p.description,
					image: p.image,
					cost: p.cost,
				}).save()
			}

			// PRODUCT EXTRA //
			for (let i = 0; i < productExtras.length; i++) {
				// [INIT] Const //
				const p = productExtras[i]


				// [INIT] //
				let option_ids = []


				// Product Options //
				const options = await ProductOptionModel.find({
					type: p.options
				})

				options.forEach(o => { option_ids.push(o._id) })
				

				// [SAVE] //
				await new ProductExtraModel({
					_id: mongoose.Types.ObjectId(),
					type: p.type,
					name: p.name,
					description: p.description,
					image: p.image,
					options: option_ids,
				}).save()
			}


			// PRODUCT VARIANT //
			for (let i = 0; i < productVariants.length; i++) {
				// [INIT] Const //
				const p = productVariants[i]


				// [INIT] //
				let option_ids = []


				// Product Options //
				const options = await ProductOptionModel.find({
					type: p.options
				})

				options.forEach(o => { option_ids.push(o._id) })
				
				// [SAVE] //
				await new ProductVariantModel({
					_id: mongoose.Types.ObjectId(),
					type: p.type,
					name: p.name,
					description: p.description,
					image: p.image,
					options: option_ids,
				}).save()
			}


			// PRODUCT ADDITIONS //
			for (let i = 0; i < productAddition.length; i++) {
				// [INIT] Const //
				const p = productAddition[i]


				// [INIT] //
				let productVariant_ids = []
				let productExtra_ids = []


				// Product Variants //
				if (p.productVariants.length > 0) {
					for (let i = 0; i < p.productVariants.length; i++) {
						const pv = p.productVariants[i]

						const productVariant = await ProductVariantModel.findOne({
							type: pv
						})

						productVariant_ids.push(productVariant._id)
					}
				}


				// Product extras //
				if (p.productExtras.length > 0) {
					for (let i = 0; i < p.productExtras.length; i++) {
						const pe = p.productExtras[i]

						const productExtra = await ProductExtraModel.findOne({
							type: pe
						})

						productExtra_ids.push(productExtra._id)
					}
				}
				

				// [SAVE] //
				await new ProductAdditionModel({
					_id: mongoose.Types.ObjectId(),
					cat: p.cat,
					subCat: p.subCat,
					name: p.name,
					description: p.description,
					image: p.image,
					cost: p.cost,
					productVariants: productVariant_ids,
					productExtras: productExtra_ids,
				}).save()
			}


			// PRODUCTS //
			for (let i = 0; i < products.length; i++) {
				// [INIT] Const //
				const p = products[i]


				// [INIT] //
				let productVariant_ids = []
				let productExtra_ids = []
				let productAddition_ids = []


				// Product Variants //
				if (p.productVariants.length > 0) {
					for (let i = 0; i < p.productVariants.length; i++) {
						const pv = p.productVariants[i]

						const productVariant = await ProductVariantModel.findOne({
							type: pv
						})

						productVariant_ids.push(productVariant._id)
					}
				}


				// Product extras //
				if (p.productExtras.length > 0) {
					for (let i = 0; i < p.productExtras.length; i++) {
						const pv = p.productExtras[i]

						const productExtra = await ProductExtraModel.findOne({
							type: pv
						})

						productExtra_ids.push(productExtra._id)
					}
				}


				// Product additions //
				if (p.productAdditions.length > 0) {
					for (let i = 0; i < p.productAdditions.length; i++) {
						const pa = p.productAdditions[i]

						const productExtra = await ProductAdditionModel.findOne({
							cat: pa.cat,
							subCat: pa.subCat
						})

						productAddition_ids.push(productExtra._id)
					}
				}

				
				// [SAVE] //
				await new ProductModel({
					_id: mongoose.Types.ObjectId(),
					cat: p.cat,
					subCat: p.subCat,
					name: p.name,
					description: p.description,
					link: p.link,
					image: p.image,
					cost: p.cost,
					productVariants: productVariant_ids,
					productExtras: productExtra_ids,
					totalProductAdditions: p.totalProductAdditions,
					productAdditions: productAddition_ids,
				}).save()
			}


			res.send({
				executed: true,
				status: true,
				location: '/api/database',
				message: 'created',
			})
		}
		catch (err) {
			res.send({
				executed: true,
				status: true,
				location: '/api/database',
				message: `Caught Err --> ${err}`,
			})
		}
	}
)


module.exports = router