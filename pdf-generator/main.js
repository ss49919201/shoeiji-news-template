import * as fs from 'node:fs/promises';
import * as puppeteer from 'puppeteer';

class PdfGenerator {
    #htmlFilePath;
    #cssFilePath;
    #pdfFilePath;

    constructor(htmlFilePath, cssFilePath, pdfFilePath) {
        this.#htmlFilePath = htmlFilePath;
        this.#cssFilePath = cssFilePath;
        this.#pdfFilePath = pdfFilePath;
    }

    async run() {
        const htmlBuf = await fs.readFile(this.#htmlFilePath).catch(
            e => { throw new Error(e); }
        );
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlBuf.toString());
        await page.addStyleTag({path: this.#cssFilePath});
        const pdfBuf = await page.pdf({
            path: this.#pdfFilePath,
            printBackground: true,
            format: 'A4',
            margin: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
        });
        browser.close();
        return pdfBuf.toString();
    }
}

class DateGenerator {
    static run() {
        const date = new Date();
        return new Intl.DateTimeFormat('ja-JP', {
            dateStyle: 'medium',
            timeStyle: 'medium'
          }).format(date).replace(/[\/: ]/g, '');        
    }
}


try {
    const date = DateGenerator.run();
    await fs.mkdir(`./generated/${date}`);
    const pdfGenerator = new PdfGenerator(
        '../html-generator/template.html',
        '../html-generator/styles.css',
        `./generated/${date}/index.pdf`
    );
    await pdfGenerator.run();
} catch (err) {
    throw err;
};
