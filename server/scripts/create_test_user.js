const path = require('path');
const db = require(path.join(__dirname, '..', 'src', 'models'));

async function main() {
  try {
    await db.sequelize.authenticate();
    console.log('DB connection OK');
  } catch (err) {
    console.error('DB connection failed:', err.message || err);
    process.exit(1);
  }

  const Nhom = db.NhomNguoiDung;
  const User = db.NguoiDung;

  const username = process.env.TEST_USERNAME || 'testuser';
  const password = process.env.TEST_PASSWORD || 'P@ssw0rd';
  const groupName = process.env.TEST_GROUP || 'ADMIN';

  try {
    // Ensure a group exists (find or create)
    const [group] = await Nhom.findOrCreate({ where: { TenNhom: groupName }, defaults: { TenNhom: groupName } });

    const existing = await User.findByPk(username);
    if (existing) {
      console.log('User already exists:', existing.TenNguoiDung);
      process.exit(0);
    }

    const created = await User.create({ TenNguoiDung: username, MatKhau: password, MaNhom: group.MaNhom });
    console.log('Created user:', created.TenNguoiDung, 'with MaNhom=', created.MaNhom);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create user:', err.message || err);
    process.exit(1);
  }
}

main();
