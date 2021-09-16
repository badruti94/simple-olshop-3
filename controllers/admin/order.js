const {sequelize,Sequelize} = require('../../models')
const Order = require('../../models/orders')(sequelize,Sequelize.DataTypes)
const OrderItem = require('../../models/order_items')(sequelize,Sequelize.DataTypes)

exports.getOrders = async (req, res) => {
    const orders = await Order.findAll()

    res.status(200).json({
        status: 'success',
        data: {
            orders
        }
    })
}

exports.getDetailOrder = async (req, res) => {
    const {id} = req.params

    const order = await Order.findByPk(id)
    const order_item = await OrderItem.findAll({
        where: {
            order_id : order.id
        }
    })

    res.status(200).json({
        status: 'success',
        data: {
            order,
            order_item
        }
    })
}
exports.sendOrder = async (req, res) => {
    const {id} = req.params

    const order = await Order.update({
        status:'dikirim'
    },{
        where: {
            id
        }
    })

    res.status(200).json({
        status: 'success',
        message: 'Pesanan dikirim',
        data: {
            order
        }
    })
}