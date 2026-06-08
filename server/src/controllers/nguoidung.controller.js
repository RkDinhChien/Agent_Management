const { NguoiDung, NhomNguoiDung } = require('../models');

const getAll = async (req, res) => {
  try {
    const users = await NguoiDung.findAll({ include: [{ model: NhomNguoiDung, as: 'nhomNguoiDung' }] });
    res.json({ status: 'success', data: users });
  } catch (error) {
    console.error('NguoiDung getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const getById = async (req, res) => {
  try {
    const user = await NguoiDung.findByPk(req.params.id, { include: [{ model: NhomNguoiDung, as: 'nhomNguoiDung' }] });
    if (!user) return res.status(404).json({ status: 'error', message: 'Không tìm thấy người dùng.' });
    res.json({ status: 'success', data: user });
  } catch (error) {
    console.error('NguoiDung getById error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const create = async (req, res) => {
  try {
    const user = await NguoiDung.create(req.body);
    res.status(201).json({ status: 'success', data: user });
  } catch (error) {
    console.error('NguoiDung create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const update = async (req, res) => {
  try {
    const user = await NguoiDung.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'Không tìm thấy người dùng.' });
    await user.update(req.body);
    res.json({ status: 'success', data: user });
  } catch (error) {
    console.error('NguoiDung update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const remove = async (req, res) => {
  try {
    const user = await NguoiDung.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'Không tìm thấy người dùng.' });
    await user.destroy();
    res.json({ status: 'success', message: 'Xóa người dùng thành công.' });
  } catch (error) {
    console.error('NguoiDung delete error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
