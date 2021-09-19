const {sequelize, Sequelize} = require('../../models')
const Item = require('../../models/items')(sequelize, Sequelize.DataTypes)

exports.getItem = async (req, res) =>  {
    const {page} = req.query

    const perPage = 10
    const activePage = page ? parseInt(page) : 1

    const totalData = await Item.count()
    const lastPage = Math.ceil(totalData / perPage)
    const index = (perPage * activePage) - perPage
    const items = await Item.findAll({
        offset: index,
        limit : perPage
    })

    res.status(200).json({
        status: 'success',
        data: {
            items,
            pagination: {
                firstPage : 1,
                lastPage,
                prev: activePage - 1,
                next : activePage + 1
            }
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