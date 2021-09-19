const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = require('../models/users')(db.sequelize, db.Sequelize.DataTypes);

exports.register = async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password, role: 'user' });

  res.status(201).json({
    status: 'success',
    message: 'User berhasil register',
    data: {
      user,
    },
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(403).json({
      status: 'fail',
      message: 'Username tidak ditemukan',
    });
  }

  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    return res.status(403).json({
      status: 'fail',
      message: 'Password salah',
    });
  }

  const token = jwt.sign({ role: user.role }, 'secret');

  return res.status(200).json({
    status: 'success',
    message: 'User berhasil login',
    data: {
      user,
      token,
    },
  });
};
