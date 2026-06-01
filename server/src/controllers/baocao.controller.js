const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  BaoCaoDoanhSo,
  ChiTiet_BaoCaoDoanhSo,
  BaoCaoCongNo,
  DaiLy,
  PhieuXuatHang,
  ChiTiet_PhieuXuat,
  PhieuThuTien,
  LoaiDaiLy,
  Quan,
} = require('../models');

const formatDateOnly = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const parseDateOnly = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
};

const parseReportPeriod = ({ thang, nam, tuNgay, denNgay }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (tuNgay || denNgay) {
    const startDate = parseDateOnly(tuNgay);
    const endDate = parseDateOnly(denNgay);

    if (!startDate || !endDate || startDate > endDate || endDate > today) return null;

    return {
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear(),
      startDate,
      endDate,
      startISO: formatDateOnly(startDate),
      endISO: formatDateOnly(endDate),
    };
  }

  const month = parseInt(thang, 10);
  const year = parseInt(nam, 10);

  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 2000 || year > 2100) {
    return null;
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const cappedEndDate = endDate > today ? today : endDate;

  return {
    month,
    year,
    startDate,
    endDate: cappedEndDate,
    startISO: formatDateOnly(startDate),
    endISO: formatDateOnly(cappedEndDate),
  };
};

const toNumber = (value) => Number.parseFloat(value) || 0;

const mapByAgentId = (rows, mapper) => {
  const map = new Map();
  rows.forEach((row) => map.set(Number(row.MaDaiLy), mapper(row)));
  return map;
};

/**
 * GET /api/bao-cao/doanh-so?tuNgay=YYYY-MM-DD&denNgay=YYYY-MM-DD
 * Backward compatible: ?thang=X&nam=Y
 * Báo cáo doanh số tháng (BM6.1)
 */
const getDoanhSo = async (req, res) => {
  try {
    const { thang, nam, tuNgay, denNgay } = req.query;

    if ((!thang || !nam) && (!tuNgay || !denNgay)) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng chọn khoảng ngày hoặc tháng/năm.',
      });
    }

    const period = parseReportPeriod({ thang, nam, tuNgay, denNgay });
    if (!period) {
      return res.status(400).json({
        status: 'error',
        message: 'Khoảng thời gian không hợp lệ.',
      });
    }

    const daiLys = await DaiLy.findAll({
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
        {
          model: PhieuXuatHang,
          as: 'phieuXuats',
          where: {
            NgayLapPhieu: { [Op.between]: [period.startISO, period.endISO] },
          },
          required: false,
        },
      ],
    });

    let tongDoanhSo = 0;
    const baoCaoData = daiLys.map((dl) => {
      const soPhieuXuat = dl.phieuXuats ? dl.phieuXuats.length : 0;
      const tongTriGia = dl.phieuXuats
        ? dl.phieuXuats.reduce((sum, px) => sum + parseFloat(px.TongTien || 0), 0)
        : 0;
      tongDoanhSo += tongTriGia;

      return {
        MaDaiLy: dl.MaDaiLy,
        TenDaiLy: dl.TenDaiLy,
        LoaiDaiLy: dl.loaiDaiLy?.TenLoai,
        Quan: dl.quan?.TenQuan,
        SoLuongPhieuXuat: soPhieuXuat,
        TongTriGia: Math.round(tongTriGia),
        TiLe: 0,
      };
    });

    baoCaoData.forEach((item) => {
      item.TiLe = tongDoanhSo > 0 ? Math.round((item.TongTriGia / tongDoanhSo) * 10000) / 100 : 0;
    });

    // Trả về toàn bộ danh sách, không lọc để giao diện không bị trống
    const resultData = baoCaoData;

    return res.json({
      status: 'success',
      data: {
        Thang: period.month,
        Nam: period.year,
        TuNgay: period.startISO,
        DenNgay: period.endISO,
        TongDoanhSo: Math.round(tongDoanhSo),
        chiTiet: resultData,
      },
    });
  } catch (error) {
    console.error('BaoCao doanhSo error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};

const getCongNo = async (req, res) => {
  try {
    const { thang, nam, tuNgay, denNgay } = req.query;

    if ((!thang || !nam) && (!tuNgay || !denNgay)) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng chọn khoảng ngày hoặc tháng/năm.',
      });
    }

    const period = parseReportPeriod({ thang, nam, tuNgay, denNgay });
    if (!period) {
      return res.status(400).json({ status: 'error', message: 'Khoảng thời gian không hợp lệ.' });
    }

    const daiLys = await DaiLy.findAll({
      include: [
        { model: LoaiDaiLy, as: 'loaiDaiLy' },
        { model: Quan, as: 'quan' },
      ],
      order: [['MaDaiLy', 'ASC']],
    });

    const debtExpr = 'GREATEST(COALESCE(TongTien, 0) - COALESCE(TienTra, 0), 0)';
    const [phatSinhRows, daThuRows, xuatToEndRows, thuToEndRows] = await Promise.all([
      sequelize.query(
        `SELECT MaDaiLy, COALESCE(SUM(${debtExpr}), 0) AS PhatSinh
         FROM PHIEUXUATHANG
         WHERE NgayLapPhieu BETWEEN ? AND ?
         GROUP BY MaDaiLy`,
        { replacements: [period.startISO, period.endISO], type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT MaDaiLy, COALESCE(SUM(SoTienThu), 0) AS DaThu
         FROM PHIEUTHUTIEN
         WHERE NgayThuTien BETWEEN ? AND ?
         GROUP BY MaDaiLy`,
        { replacements: [period.startISO, period.endISO], type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT MaDaiLy, COALESCE(SUM(${debtExpr}), 0) AS XuatToEnd
         FROM PHIEUXUATHANG
         WHERE NgayLapPhieu <= ?
         GROUP BY MaDaiLy`,
        { replacements: [period.endISO], type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT MaDaiLy, COALESCE(SUM(SoTienThu), 0) AS ThuToEnd
         FROM PHIEUTHUTIEN
         WHERE NgayThuTien <= ?
         GROUP BY MaDaiLy`,
        { replacements: [period.endISO], type: QueryTypes.SELECT }
      ),
    ]);

    const phatSinhByAgent = mapByAgentId(phatSinhRows, (row) => toNumber(row.PhatSinh));
    const daThuByAgent = mapByAgentId(daThuRows, (row) => toNumber(row.DaThu));
    const xuatToEndByAgent = mapByAgentId(xuatToEndRows, (row) => toNumber(row.XuatToEnd));
    const thuToEndByAgent = mapByAgentId(thuToEndRows, (row) => toNumber(row.ThuToEnd));

    let tongNoDau = 0;
    let tongPhatSinh = 0;
    let tongDaThu = 0;
    let tongNoCuoi = 0;

    const baoCaoData = daiLys.map((dl) => {
      const id = Number(dl.MaDaiLy);
      const phatSinh = phatSinhByAgent.get(id) || 0;
      const daThu = daThuByAgent.get(id) || 0;
      const xuatToEnd = xuatToEndByAgent.get(id) || 0;
      const thuToEnd = thuToEndByAgent.get(id) || 0;
      const noCuoi = Math.max(0, xuatToEnd - thuToEnd);
      const noDau = Math.max(0, noCuoi - phatSinh + daThu);

      tongNoDau += noDau;
      tongPhatSinh += phatSinh;
      tongDaThu += daThu;
      tongNoCuoi += noCuoi;

      return {
        MaDaiLy: dl.MaDaiLy,
        TenDaiLy: dl.TenDaiLy,
        LoaiDaiLy: dl.loaiDaiLy?.TenLoai,
        Quan: dl.quan?.TenQuan,
        NoDau: Math.round(noDau),
        PhatSinh: Math.round(phatSinh),
        DaThu: Math.round(daThu),
        NoCuoi: Math.round(noCuoi),
        HanMuc: parseFloat(dl.loaiDaiLy?.TienNoToiDa) || 0,
      };
    });

    res.json({
      status: 'success',
      data: {
        Thang: period.month,
        Nam: period.year,
        TuNgay: period.startISO,
        DenNgay: period.endISO,
        TongNoDau: Math.round(tongNoDau),
        TongPhatSinh: Math.round(tongPhatSinh),
        TongDaThu: Math.round(tongDaThu),
        TongNoCuoi: Math.round(tongNoCuoi),
        chiTiet: baoCaoData,
      },
    });
  } catch (error) {
    console.error('BaoCao congNo error:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server.' });
  }
};


module.exports = { getDoanhSo, getCongNo };
