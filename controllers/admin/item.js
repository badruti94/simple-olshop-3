const {sequelize, Sequelize} = require('../../models')
const Item = require('../../models/items')(sequelize, Sequelize.DataTypes)

exports.getAllItems = async(req,res) => {
    const items = await Item.findAll()

    res.status(200).json({
        status: 'success',
        data: {
            items
        }
    })
}

exports.addItem = async (req, res) => {
    const item = await Item.create({
        ...req.body,
        image: req.file.filename
    })
    res.status(201).json({
        status: 'success',
        message: 'Item berhasil ditambahkan',
        data: {
            item
        }
    })
}

exports.updateItem = async (req,res) => {
    const {id} = req.params

    try {
        const item = await Item.update({
            ...req.body,
            image: req.file.filename
        },{
            where: {
                id
            }
        })
        
        res.status(200).json({
            status: 'success',
            message: 'Item berhasil diupdate',
            data: {
                item
            }
        })
        
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.deleteItem = async (req, res) => {
    const {id} = req.params

    const item = await Item.destroy({
        where: {
            id
        }
    })

    res.status(200).json({
        status: 'success',
        message:'Item berhasil dihapus',
        data: {
            item
        }
    })
}