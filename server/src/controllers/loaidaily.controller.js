const { LoaiDaiLy, DaiLy } = require('../models');

/**
 * GET /api/loai-dai-ly
 */
const getAll = async (req, res) => {
  try {
    const loais = await LoaiDaiLy.findAll({ order: [['MaLoaiDaiLy', 'ASC']] });
    res.json({ status: 'success', data: loais });
  } catch (error) {
    console.error('LoaiDaiLy getAll error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * GET /api/loai-dai-ly/:id
 */
const getById = async (req, res) => {
  try {
    const item = await LoaiDaiLy.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy loại đại lý.' });
    res.json({ status: 'success', data: item });
  } catch (error) {
    console.error('LoaiDaiLy getById error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * POST /api/loai-dai-ly
 */
const create = async (req, res) => {
  try {
    const item = await LoaiDaiLy.create(req.body);
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    console.error('LoaiDaiLy create error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * PUT /api/loai-dai-ly/:id
 */
const update = async (req, res) => {
  try {
    const item = await LoaiDaiLy.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy loại đại lý.' });
    await item.update(req.body);
    res.json({ status: 'success', data: item });
  } catch (error) {
    console.error('LoaiDaiLy update error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

/**
 * DELETE /api/loai-dai-ly/:id
 */
const remove = async (req, res) => {
  try {
    const item = await LoaiDaiLy.findByPk(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Không tìm thấy loại đại lý.' });

    // Check association
    const agentCount = await DaiLy.count({ where: { MaLoaiDaiLy: req.params.id } });
    if (agentCount > 0) {
      return res.status(400).json({ status: 'error', message: 'Không thể xóa: còn đại lý thuộc loại này.' });
    }

    await item.destroy();
    res.json({ status: 'success', message: 'Xóa loại đại lý thành công.' });
  } catch (error) {
    console.error('LoaiDaiLy delete error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
