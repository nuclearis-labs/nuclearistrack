const Document = require('./classes/Document');
const fs = require('fs');
let file = { buffer: fs.readFileSync('test.pdf') };

const doc = new Document(file);

doc.save().then(result => {
  console.log(result);
  doc.get(result[0].hash).then(
    result => console.log(result)
    /* fs.writeFileSync('pdfbase64.js', result) */
  );
});
