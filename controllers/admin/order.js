const nodemailer = require('nodemailer')
require('dotenv').config()
const {sequelize,Sequelize} = require('../../models')
const Order = require('../../models/orders')(sequelize,Sequelize.DataTypes)
const OrderItem = require('../../models/order_items')(sequelize,Sequelize.DataTypes)
const User = require('../../models/users')(sequelize, Sequelize.DataTypes)

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
const sendEmail = async email => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth : {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const info = await transporter.sendMail({
        from : 'info@simple-olshop.com',
        to: email,
        subject: 'Informasi',
        text: 'Pesanan anda telah dikirim',
        html: '<b>Pesanan anda telah dikirim</b>'
    })

    console.log(`Message sent : ${info.messageId}`);
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

    const userOrder = await Order.findByPk(id)
    const {user_id} = userOrder
    const user = await User.findByPk(user_id)
    const {email} = user

    sendEmail(email)

    res.status(200).json({
        status: 'success',
        message: 'Pesanan dikirim',
        data: {
            order
        }
    })
}