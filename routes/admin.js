const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()
const item = require('../controllers/admin/item')
const {admin} = require('../utils/authorization')
const order = require('../controllers/admin/order')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/assets/img/item'))
    },
    filename: (req, file, cb) => {
        const dateIsoString = new Date(Date.now()).toISOString().split('T')
        const date = dateIsoString[0];
        const time = dateIsoString[1].split('.')[0].split(':').join('')
        cb(null, date + time + file.originalname)
    }
})
const upload = multer({storage})

router.get('/item',admin, item.getAllItems)
router.post('/item', admin, upload.single('image'), item.addItem)
router.put('/item/:id', admin, upload.single('image'), item.updateItem)
router.delete('/item/:id', admin, item.deleteItem)

router.get('/order', admin, order.getOrders)
router.get('/order/:id', admin, order.getDetailOrder)
router.get('/order/:id/send', admin, order.sendOrder)

module.exports = router