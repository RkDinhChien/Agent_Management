/**
 * Chuyển đổi lỗi từ API thành thông báo rõ ràng cho người dùng.
 */
export function parseError(err, context = '') {
  const status  = err?.response?.status;
  const apiMsg  = err?.response?.data?.message || '';
  const apiRule = err?.response?.data?.rule || '';

  // Ưu tiên message từ server nếu có ý nghĩa
  if (apiMsg && !apiMsg.toLowerCase().includes('lỗi server') && !apiMsg.toLowerCase().includes('server error')) {
    return apiMsg;
  }

  // Map theo rule (quy định nghiệp vụ)
  const ruleMap = {
    QD3: 'Đại lý đã vượt hạn mức nợ tối đa. Không thể lập thêm phiếu xuất.',
    QD4: 'Số tiền thu vượt quá công nợ hiện tại của đại lý.',
    QD5: 'Số lượng xuất vượt tồn kho hiện có.',
    QD6: 'Không đủ tồn kho để thực hiện phiếu xuất.',
  };
  if (ruleMap[apiRule]) return ruleMap[apiRule];

  // Map theo HTTP status
  if (status === 400) {
    if (context.includes('phiếu thu'))   return 'Dữ liệu phiếu thu không hợp lệ. Kiểm tra lại số tiền và ngày thu.';
    if (context.includes('phiếu xuất'))  return 'Dữ liệu phiếu xuất không hợp lệ. Kiểm tra đại lý, mặt hàng và số lượng.';
    if (context.includes('phiếu nhập'))  return 'Dữ liệu phiếu nhập không hợp lệ. Kiểm tra mặt hàng và giá nhập.';
    if (context.includes('đại lý'))      return 'Thông tin đại lý không hợp lệ hoặc vi phạm quy định.';
    if (context.includes('mặt hàng'))    return 'Thông tin mặt hàng không hợp lệ.';
    return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin đã nhập.';
  }
  if (status === 404) return 'Không tìm thấy dữ liệu. Có thể đã bị xóa trước đó.';
  if (status === 401) return 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
  if (status === 403) return 'Bạn không có quyền thực hiện thao tác này.';
  if (status === 409) return 'Dữ liệu bị trùng lặp. Vui lòng kiểm tra lại.';
  if (status >= 500)  {
    if (context.includes('xóa'))  return 'Không thể xóa vì dữ liệu đang được sử dụng ở nơi khác.';
    if (context.includes('lưu'))  return 'Không thể lưu dữ liệu. Vui lòng thử lại sau.';
    return 'Máy chủ gặp sự cố. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
  }

  // Fallback theo context
  if (context) return `Không thể ${context}. Vui lòng thử lại.`;
  return 'Đã xảy ra lỗi. Vui lòng thử lại.';
}
