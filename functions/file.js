module.exports.getExtension = function getExtension({ originalname }) {
  let fileNameArray = originalname.split(".");
  if (fileNameArray.length > 1) {
    return fileNameArray[fileNameArray.length - 1];
  } else {
    throw Error("No se pudo definir la extension del archivo");
  }
};
