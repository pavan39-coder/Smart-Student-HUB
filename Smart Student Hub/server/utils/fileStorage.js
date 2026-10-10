const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');
const { del, put } = require('@vercel/blob');

const uploadDir = path.join(__dirname, '../uploads');

const uploadCertificate = async (file) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(
      `certificates/${randomUUID()}${extension}`,
      file.buffer,
      {
        access: 'public',
        contentType: file.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    return { fileName: blob.pathname, filePath: blob.url };
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('BLOB_READ_WRITE_TOKEN is required for certificate uploads in production');
  }

  await fs.promises.mkdir(uploadDir, { recursive: true });
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  await fs.promises.writeFile(path.join(uploadDir, fileName), file.buffer, { flag: 'wx' });

  return { fileName, filePath: `/uploads/${fileName}` };
};

const deleteCertificate = async (filePath) => {
  if (!filePath) return;

  if (/^https?:\/\//i.test(filePath)) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN is required to delete a stored certificate');
    }
    await del(filePath, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return;
  }

  const fileName = path.basename(filePath);
  try {
    await fs.promises.unlink(path.join(uploadDir, fileName));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
};

module.exports = { uploadCertificate, deleteCertificate };
