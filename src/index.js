const path = require('path')
const fs = require('fs/promises')
const uuid = require('uuid')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const morgan = require('morgan')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

const port = process.env.PORT ?? 8000
const fileStorage = path.resolve(__dirname, '../file-storage')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileStorage)
    },
    filename: (req, file, cb) => {
        // see https://github.com/expressjs/multer/issues/962
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8')
        cb(null, `${uuid.v4()}-${file.originalname}`)
    }
})
const upload = multer({ storage: storage })

app.options('*', cors())
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static/index.html'))
})

app.post(
    '/upload',
    upload.single('pickedFile'),
    async (req, res) => {
        if (!req.file) {
            res.send({
                ok: false,
                message: 'NO_FILE'
            })
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
)

app.listen(port, () => {
    console.log(`File uploader started at port ${port}`)
})