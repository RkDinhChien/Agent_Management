const express = require('express');
const router = express.Router();
const { mockDaiLys, mockQuans } = require('../mockData');

// Mock routes - Skip authentication for testing
router.get('/', (req, res) => {
  res.json({ status: 'success', data: mockDaiLys });
});

router.get('/check-quan/:maQuan', (req, res) => {
  const quan = mockQuans.find(q => q.MaQuan == req.params.maQuan);
  res.json({ status: 'success', data: quan });
});

router.get('/:id/lich-su', (req, res) => {
  const daiLy = mockDaiLys.find(d => d.MaDaiLy == req.params.id);
  if (!daiLy) {
    return res.status(404).json({ status: 'error', message: 'Not found' });
  }
  
  // Thêm quan & loaiDaiLy vào response
  const enrichedDaiLy = {
    ...daiLy,
    quan: mockQuans.find(q => q.MaQuan == daiLy.MaQuan),
    loaiDaiLy: { MaLoai: daiLy.MaLoai, TenLoai: daiLy.MaLoai === 1 ? 'Loại 1' : 'Loại 2' }
  };
  
  res.json({
    status: 'success',
    data: {
      daiLy: enrichedDaiLy,
      phieuXuats: [],
      phieuThus: [],
      thongKe: {
        tongPhieuXuat: 0,
        tongDoanhThu: 0,
        tongPhieuThu: 0,
        tongDaThu: 0,
        conNo: daiLy.TienNo
      }
    }
  });
});

router.get('/:id', (req, res) => {
  const daiLy = mockDaiLys.find(d => d.MaDaiLy == req.params.id);
  if (!daiLy) {
    return res.status(404).json({ status: 'error', message: 'Not found' });
  }
  
  // Thêm quan & loaiDaiLy vào response
  const enrichedDaiLy = {
    ...daiLy,
    quan: mockQuans.find(q => q.MaQuan == daiLy.MaQuan),
    loaiDaiLy: { MaLoai: daiLy.MaLoai, TenLoai: daiLy.MaLoai === 1 ? 'Loại 1' : 'Loại 2' }
  };
  
  res.json({ status: 'success', data: enrichedDaiLy });
});

router.post('/', (req, res) => {
  const newId = Math.max(...mockDaiLys.map(d => d.MaDaiLy)) + 1;
  const newDaiLy = { MaDaiLy: newId, ...req.body };
  mockDaiLys.push(newDaiLy);
  res.json({ status: 'success', data: newDaiLy });
});

router.put('/:id', (req, res) => {
  const idx = mockDaiLys.findIndex(d => d.MaDaiLy == req.params.id);
  if (idx === -1) {
    return res.status(404).json({ status: 'error', message: 'Not found' });
  }
  mockDaiLys[idx] = { ...mockDaiLys[idx], ...req.body };
  res.json({ status: 'success', data: mockDaiLys[idx] });
});

router.delete('/:id', (req, res) => {
  const idx = mockDaiLys.findIndex(d => d.MaDaiLy == req.params.id);
  if (idx === -1) {
    return res.status(404).json({ status: 'error', message: 'Not found' });
  }
  const deleted = mockDaiLys.splice(idx, 1);
  res.json({ status: 'success', data: deleted[0] });
});

module.exports = router;
