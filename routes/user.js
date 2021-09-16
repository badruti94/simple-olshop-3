const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()
const item = require('../controllers/user/item')
const order = require('../controllers/user/order')
const {user} = require('../utils/authorization')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/assets/img/transfer-proof'))
    },
    filename: (req, file, cb) => {
        const dateIsoString = new Date(Date.now()).toISOString().split('T')
        const date = dateIsoString[0]
        const time = dateIsoString[1].split('.')[0].split(':').join('')
        cb(null, date+time+file.originalname)
    }
})
const upload = multer({storage})

router.get('/item', item.getItem)
router.get('/item/:id', item.getItemById)

router.post('/order', user, upload.single('transfer_proof'), order.order)
router.get('/order',user,order.getOrders)
router.get('/order/:id/receive', user, order.receiveOrder)

module.exports = router