"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hummus_recipe_1 = __importDefault(require("hummus-recipe"));
function addDocNumber({ buffer, docNumber }) {
    return new Promise(resolve => {
        const pdfDoc = new hummus_recipe_1.default(buffer);
        for (let i = 1; i <= pdfDoc.metadata.pages; i += 1) {
            pdfDoc.editPage(i).text(docNumber, pdfDoc.metadata[i].width - 20, 20, {
                size: 10,
                color: '#000000',
                align: 'right center'
            });
            pdfDoc.endPage();
        }
        pdfDoc.endPDF(output => {
            resolve(output);
        });
    });
}
exports.addDocNumber = addDocNumber;
//# sourceMappingURL=pdf.js.map