const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { sequelize, Sequelize } = require('../../models');
const Item = require('../../models/items')(sequelize, Sequelize.DataTypes);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/assets/img/item'));
  },
  filename: (req, file, cb) => {
    const dateIsoTring = new Date(Date.now()).toISOString().split('T');
    const date = dateIsoTring[0];
    const time = dateIsoTring[1].split('.')[0].split(':').join('');
    cb(null, date + time + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png'
        || file.mimetype === 'image/jpeg'
        || file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('type file tidak sesuai'));
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
}).single('image');

exports.getAllItems = async (req, res) => {
  const items = await Item.findAll();

  res.status(200).json({
    status: 'success',
    data: {
      items,
    },
  });
};

exports.addItem = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({
        status: 'fail',
        message: err.message,
      });
    }
    if (err) {
      return res.status(500).json({
        status: 'fail',
        message: err.message,
      });
    }
    const item = await Item.create({
      ...req.body,
      image: req.file.filename,
    });
    res.status(201).json({
      status: 'success',
      message: 'Item berhasil ditambahkan',
      data: {
        item,
      },
    });
  });
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.update({
      ...req.body,
      image: req.file.filename,
    }, {
      where: {
        id,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Item berhasil diupdate',
      data: {
        item,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  const itemForDelete = await Item.findByPk(id);
  const { image } = itemForDelete;

  fs.unlink(path.join(__dirname, `../../public/assets/img/item/${image}`), (err) => {
    if (err) {
      return res.status(500).json({
        status: 'fail',
        message: err.message,
      });
    }
  });

  const item = await Item.destroy({
    where: {
      id,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Item berhasil dihapus',
    data: {
      item,
    },
  });
};
