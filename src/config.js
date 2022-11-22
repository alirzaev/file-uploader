const path = require('path');

const port = process.env.PORT ?? 8000;

const ip = process.env.IP ?? '0.0.0.0';

const fileStorage = path.resolve(__dirname, '../file-storage');

module.exports = {
  ip,
  port,
  fileStorage
};