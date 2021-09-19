const {sequelize, Sequelize} = require('../../models')
const Item = require('../../models/items')(sequelize, Sequelize.DataTypes)

exports.getItem = async (req, res) =>  {
    const items = await Item.findAll()

    res.status(200).json({
        status: 'success',
        data: {
            items
        }
    })
}

exports.getItemById = async (req, res) => {
    const {id} = req.params;

    const item = await Item.findByPk(id);

    if(!item){
        return res.status(404).json({
            status : 'fail',
            message: 'Item tidak ditemukan'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            item
        }
    })
}