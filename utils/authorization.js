const jwt = require('jsonwebtoken')

const authorization = (req, res, next, role) => {
    const {authorization}  = req.headers;

    if(authorization === undefined){
        return res.status(403).json({
            status: 'fail',
            message: 'Token tidak ditemukan'
        })
    }

    const token = authorization.split(' ')[1]

    try {
        const decoded = jwt.verify(token, 'secret')
        if(decoded.role !== role){
            return res.status(403).json({
                status: 'fail',
                message: `User bukan ${role}`
            })
        }
        next()
    } catch (err) {
        return res.status(403).json({
            status: 'fail',
            message: err.message
        })
    }
}

const admin = (req, res, next) => {
    authorization(req, res, next, 'admin');
}
const user = (req, res, next) => {
    authorization(req, res, next, 'user')
}

module.exports = {admin, user}