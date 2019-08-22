let express = require("express"),
  router = express.Router({ mergeParams: true }),
  { sendMail } = require("../functions/mail"),
  { asyncMiddleware } = require("../middleware/index"),
  Documento = require("../classes/Documento"),
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
  "/upload",
  upload.single("file"),
  asyncMiddleware(async (req, res) => {
    let file = new Documento()
    let { foundBlock } = await file.createHash(req.file).findBlock()

    if (foundBlock.blockNumber === '0') {
      await file.addDocHash()
      await file.sendTx()

      res.json({ message: "Transaction successful", data: file });
    } else {
      res.json({ message: "Duplicate", data: file });
    }
  })
);

router.post(
  "/verify",
  upload.single("file"),
  asyncMiddleware(async (req, res) => {
    let file = await new Documento(req.file).createHash().findBlock();

    if (file.foundBlock.blockNumber === "0") {
      res.json({ message: "Not found", data: file });
    } else {
      res.json({ message: "Hash found", data: file });
    }
  })
);

module.exports = router;
