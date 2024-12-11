const sellerController = require('../../controllers/dashboard/sellerController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router=require('express').Router();

router.post('/seller-active-deactive', authMiddleware, sellerController.seller_active_deactive)
router.get('/get-seller-request', authMiddleware, sellerController.get_seller_request)

module.exports = router 