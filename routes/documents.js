const express = require("express"),
  router = express.Router({ mergeParams: true }),
  documentModel = require("../models/document"),
  { sendMail } = require("../functions/mail"),
  { find, send } = require("../functions/web3"),
  { getExtension } = require("../functions/file"),
  { create, uploadToS3 } = require("../functions/hash"),
  { asyncMiddleware } = require("../middleware/index"),
  DocumentClass = require("../classes/Document"),
  storage = require("multer").memoryStorage(),
  upload = require("multer")({ storage: storage });

router.get("/upload", (req, res) => {
  res.json({ message: "Upload Form" });
});

router.get("/verify", (req, res) => {
  res.json({ message: "Verify Form" });
});

router.get("/list/", (req, res) => {
  res.json({ message: "Show items" });
});

router.post(
  "/hash",
  upload.single("file"),
  asyncMiddleware(async (req, res, next) => {
    let hash = new DocumentClass(req.file);

    res.send(hash.hash().getHash);
    let result = await find(fileHash);

    if (result) {
      res.json({ message: { bloqueExistente: result } });
    } else {
      await uploadToS3(
        req.file.buffer,
        `${fileHash}.${getExtension(req.file)}`
      );

      let tx = await send(fileHash);

      await documentModel.create({
        hash: fileHash,
        tx: tx,
        filename: `${fileHash}.${getExtension(req.file)}`,
        mined: false,
        visible: true
      });

      res.json({ message: { archivoGuardado: tx } });
    }
  })
);

module.exports = router;
