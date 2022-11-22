const path = require('path');
const uuid = require('uuid');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const morgan = require('morgan');

const config = require('./config');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.fileStorage);
  },
  filename: (_req, file, cb) => {
    // see https://github.com/expressjs/multer/issues/962
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
    cb(null, `${uuid.v4()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

app.options('*', cors());

app.get('/', (_req, res) => {
  res.sendFile(path.resolve(__dirname, 'static/index.html'));
});

app.post(
  '/upload',
  upload.single('pickedFile'),
  async (req, res) => {
    if (!req.file) {
      res.send({
        ok: false,
        message: 'NO_FILE'
      });
    } else {
      res.send({
        ok: true,
        data: {
          name: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size
        }
      });
    }
  }
);

app.listen(config.port, () => {
  console.log(`File uploader started at ${config.ip}:${config.port}`);
});