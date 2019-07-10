const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Document = require("../models/document"),
  { sendMail } = require("../functions/mail"),
  { find, send, check } = require("../functions/web3"),
  { getExtension } = require("../functions/file"),
  { create, uploadToS3 } = require("../functions/hash"),
  { asyncMiddleware } = require("../middleware/index"),
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
    let fileHash = await create(req.file.buffer);
    let result = await find(fileHash);

    if (result) {
      res.json({ message: { bloqueExistente: result } });
    } else {
      await uploadToS3(
        req.file.buffer,
        `${fileHash}.${getExtension(req.file)}`
      );

      let tx = await send(fileHash);

      await Document.create({
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

router.post(
  "/check",
  upload.single("file"),
  asyncMiddleware(async (req, res, next) => {
    let fileHash = await create(req.file.buffer);

    let resultObj = await find(fileHash);
    let result = await check(resultObj, fileHash);
    res.json(result);
  })
);

module.exports = router;
