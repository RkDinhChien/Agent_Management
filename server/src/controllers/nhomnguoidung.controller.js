const { NhomNguoiDung, PhanQuyen, ChucNang, NguoiDung } = require('../models');

const getAll = async (req, res) => {
  try {
    const items = await NhomNguoiDung.findAll({ order: [['MaNhom', 'ASC']] });
    res.json({ status: 'success', data: items });
  } catch (error) {
    console.error('NhomNguoiDung getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const getById = async (req, res) => {
  try {
    const item = await NhomNguoiDung.findByPk(req.params.id, { include: [{ model: ChucNang, as: 'chucNangs' }] });
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhóm.' });
    res.json({ status: 'success', data: item });
  } catch (error) {
    console.error('NhomNguoiDung getById error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const create = async (req, res) => {
  try {
    const item = await NhomNguoiDung.create(req.body);
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    console.error('NhomNguoiDung create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const update = async (req, res) => {
  try {
    const item = await NhomNguoiDung.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhóm.' });
    await item.update(req.body);
    res.json({ status: 'success', data: item });
  } catch (error) {
    console.error('NhomNguoiDung update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const remove = async (req, res) => {
  try {
    const item = await NhomNguoiDung.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy nhóm.' });
    const userCount = await NguoiDung.count({ where: { MaNhom: req.params.id } });
    if (userCount > 0) {
      return res.status(400).json({ status: 'error', message: 'Không thể xóa nhóm: tồn tại người dùng thuộc nhóm.' });
    }

    const permCount = await PhanQuyen.count({ where: { MaNhom: req.params.id } });
    if (permCount > 0) {
      return res.status(400).json({ status: 'error', message: 'Không thể xóa nhóm: tồn tại phân quyền liên quan.' });
    }

    await item.destroy();
    res.json({ status: 'success', message: 'Xóa nhóm thành công.' });
  } catch (error) {
    console.error('NhomNguoiDung delete error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
