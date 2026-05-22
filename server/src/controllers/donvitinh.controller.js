const { DonViTinh, MatHang } = require('../models');

const getAll = async (req, res) => {
  try {
    const items = await DonViTinh.findAll({ order: [['MaDVT', 'ASC']] });
    res.json({ status: 'success', data: items });
  } catch (error) {
    console.error('DonViTinh getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const getById = async (req, res) => {
  try {
    const item = await DonViTinh.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy đơn vị tính.' });
    res.json({ status: 'success', data: item });
  } catch (error) {
    console.error('DonViTinh getById error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const create = async (req, res) => {
  try {
    const item = await DonViTinh.create(req.body);
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    console.error('DonViTinh create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const update = async (req, res) => {
  try {
    const item = await DonViTinh.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy đơn vị tính.' });
    await item.update(req.body);
    res.json({ status: 'success', data: item });
  } catch (error) {
    console.error('DonViTinh update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const remove = async (req, res) => {
  try {
    const item = await DonViTinh.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy đơn vị tính.' });

    const used = await MatHang.count({ where: { MaDVT: req.params.id } });
    if (used > 0) {
      return res.status(400).json({ status: 'error', message: 'Không thể xóa đơn vị tính: đang được sử dụng trong mặt hàng.' });
    }

    await item.destroy();
    res.json({ status: 'success', message: 'Xóa đơn vị tính thành công.' });
  } catch (error) {
    console.error('DonViTinh delete error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
