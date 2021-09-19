const nodemailer = require('nodemailer')
require('dotenv').config()
const {
    sequelize,
    Sequelize
} = require('../../models')
const Order = require('../../models/orders')(sequelize, Sequelize.DataTypes)
const OrderItem = require('../../models/order_items')(sequelize, Sequelize.DataTypes)
const User = require('../../models/users')(sequelize, Sequelize.DataTypes)
const Item = require('../../models/items')(sequelize, Sequelize.DataTypes)

exports.getOrders = async (req, res) => {
    Order.belongsTo(User, {
        foreignKey: 'user_id'
    })
    const orders = await Order.findAll({
        include: {
            model: User,
            required: true
        }
    })

    res.status(200).json({
        status: 'success',
        data: {
            orders: orders.map(order => ({
                name: order.user.name,
                id: order.id,
                address: order.address,
                phone_number: order.phone_number,
                delivery_service: order.delivery_service,
                payment_method: order.payment_method,
                transfer_proof: order.transfer_proof,
                total: order.total,
                status: order.status
            }))
        }
    })
}

exports.getDetailOrder = async (req, res) => {
    const {
        id
    } = req.params

    Order.belongsTo(User, {
        foreignKey: 'user_id'
    })
    const order = await Order.findByPk(id, {
        include: {
            model: User,
            required: true
        }
    })
    OrderItem.belongsTo(Item, {
        foreignKey: 'item_id'
    })
    const order_item = await OrderItem.findAll({
        include: {
            model: Item
        }
    }, {
        where: {
            order_id: order.id
        }
    })

    res.status(200).json({
        status: 'success',
        data: {
            order: {
                name: order.user.name,
                id: order.id,
                address: order.address,
                phone_number: order.phone_number,
                delivery_service: order.delivery_service,
                payment_method: order.payment_method,
                transfer_proof: order.transfer_proof,
                total: order.total,
                status: order.status
            },
            order_item: order_item.map(orderItem => ({
                name: orderItem.item.name,
                image: orderItem.item.image,
                qty: orderItem.qty
            }))
        }
    })
}
const sendEmail = async email => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const info = await transporter.sendMail({
        from: 'info@simple-olshop.com',
        to: email,
        subject: 'Informasi',
        text: 'Pesanan anda telah dikirim',
        html: '<b>Pesanan anda telah dikirim</b>'
    })

    console.log(`Message sent : ${info.messageId}`);
}
exports.sendOrder = async (req, res) => {
    const {
        id
    } = req.params

    const order = await Order.update({
        status: 'dikirim'
    }, {
        where: {
            id
        }
    })

    const userOrder = await Order.findByPk(id)
    const {
        user_id
    } = userOrder
    const user = await User.findByPk(user_id)
    const {
        email
    } = user

    sendEmail(email)

    res.status(200).json({
        status: 'success',
        message: 'Pesanan dikirim',
        data: {
            order
        }
    })
}