const { PhanQuyen, ChucNang, NhomNguoiDung, sequelize } = require('../models');

const getByGroup = async (req, res) => {
  try {
    const maNhom = req.params.maNhom;
    const perms = await PhanQuyen.findAll({ where: { MaNhom: maNhom } });
    res.json({ status: 'success', data: perms });
  } catch (error) {
    console.error('PhanQuyen getByGroup error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};


const replaceForGroup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { MaNhom, permissions } = req.body; // phân quyền: [{ MaChucNang, Xem, Them, Xoa, Sua }]
    if (!MaNhom) return res.status(400).json({ status: 'error', message: 'MaNhom required.' });

    // remove existing
    await PhanQuyen.destroy({ where: { MaNhom }, transaction: t });

    if (Array.isArray(permissions) && permissions.length > 0) {
      const payload = permissions.map((p) => ({ MaNhom, MaChucNang: p.MaChucNang, Xem: !!p.Xem, Them: !!p.Them, Xoa: !!p.Xoa, Sua: !!p.Sua }));
      await PhanQuyen.bulkCreate(payload, { transaction: t });
    }

    await t.commit();
    res.json({ status: 'success', message: 'Cập nhật phân quyền thành công.' });
  } catch (error) {
    await t.rollback();
    console.error('PhanQuyen replaceForGroup error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

module.exports = { getByGroup, replaceForGroup };
