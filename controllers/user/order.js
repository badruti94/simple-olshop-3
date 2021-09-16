const {sequelize,Sequelize} = require('../../models')
const Order = require('../../models/orders')(sequelize,Sequelize.DataTypes)
const OrderItem = require('../../models/order_items')(sequelize,Sequelize.DataTypes)

exports.order = async (req, res) => {
    const order = await Order.create({
        ...req.body,
        transfer_proof:req.file.filename
    })

    const {items : items_json} = req.body

    const items = JSON.parse(items_json).map(item => ({
        ...item,
        order_id: order.id
    }))

    await OrderItem.bulkCreate(items)

    res.status(200).json({
        status: 'success',
        message: 'Pesanan diproses'
    })
}

exports.getOrders = async (req, res) => {
    const {user_id} = req.body

    const orders = await Order.findAll({
        where: {
            user_id
        }
    })

    res.status(200).json({
        status: 'success',
        data: {
            orders
        }
    })
}

exports.receiveOrder = async (req, res) => {
    const {id} = req.params

    const order = await Order.update({
        status: 'diterima'
    },{
        where: {
            id
        }
    })

    res.status(200).json({
        status: 'success',
        message: 'Pesanan diterima'
    })
}