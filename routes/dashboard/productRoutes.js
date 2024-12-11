const router=require('express').Router()
const { authMiddleware } = require('../../middlewares/authMiddleware');
const productControlller = require('../../controllers/dashboard/productController');



router.post('/product-add',authMiddleware, productControlller.add_product)
router.get('/get-products',authMiddleware, productControlller.get_products)
router.get('/get-product/:productId', authMiddleware, productControlller.get_singleProduct)
router.post('/update-product', authMiddleware, productControlller.update_product)
router.post('/product-image-update', authMiddleware, productControlller.product_image_update)


module.exports = router  
 