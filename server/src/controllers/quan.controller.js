const { Quan, DaiLy } = require('../models');

/**
 * GET /api/quan
 */
const getAll = async (req, res) => {
  try {
    const quans = await Quan.findAll({ order: [['MaQuan', 'ASC']] });
    res.json({ status: 'success', data: quans });
  } catch (error) {
    console.error('Quan getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * GET /api/quan/:id
 */
const getById = async (req, res) => {
  try {
    const item = await Quan.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy quận.' });
    res.json({ status: 'success', data: item });
  } catch (error) {
    console.error('Quan getById error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * POST /api/quan
 */
const create = async (req, res) => {
  try {
    const item = await Quan.create(req.body);
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    console.error('Quan create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * PUT /api/quan/:id
 */
const update = async (req, res) => {
  try {
    const item = await Quan.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy quận.' });
    await item.update(req.body);
    res.json({ status: 'success', data: item });
  } catch (error) {
    console.error('Quan update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * DELETE /api/quan/:id
 */
const remove = async (req, res) => {
  try {
    const item = await Quan.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy quận.' });

    // Check association
    const agentCount = await DaiLy.count({ where: { MaQuan: req.params.id } });
    if (agentCount > 0) {
      return res.status(400).json({ status: 'error', message: 'Không thể xóa: còn đại lý thuộc quận này.' });
    }

    await item.destroy();
    res.json({ status: 'success', message: 'Xóa quận thành công.' });
  } catch (error) {
    console.error('Quan delete error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
