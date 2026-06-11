const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tipo = req.uploadTipo

    if (tipo === "FEEDBACK") {
      cb(null, "uploads/feedbacks")
    } else {
      cb(null, "uploads/tccs")
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_")

    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()

  if (ext !== ".pdf") {
    return cb(new Error("Apenas arquivos PDF são permitidos"))
  }

  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
})

module.exports = upload