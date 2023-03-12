const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

async function generateRecitative(page, variables = {}) {
  const templatePath = path.resolve(__dirname, 'template.html');
  const template = fs.readFileSync(templatePath, 'utf8');
  const generate = Handlebars.compile(template, { noEscape: true });

  const { livro, capitulo, versoInicial, versoFinal, dia, mes, ano } = variables;
  const fileName = `recitativo-${livro}-${capitulo}-${versoInicial}-${versoFinal}-${dia}-${mes}-${ano}`;

  const htmlContent = generate(variables);

  await page.setContent(`${htmlContent} \n ${htmlContent}`);
  const pdfFilePath = path.resolve(__dirname, 'assets', 'pdf', `${fileName}.pdf`);

  await page.pdf({
    path: pdfFilePath,
    // margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });

  // fs.unlinkSync(htmlFilePath);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // const result = await (await fetch('https://bible-api.com')).json();

  const variables = {
    nome: 'João',
    livro: 'Salmos',
    capitulo: '23',
    versoInicial: '1',
    versoFinal: '2',
    dia: '12',
    mes: '03',
    ano: '2023',
    auxiliar: 'Teste',
  };

  await generateRecitative(page, variables);
  await browser.close();
})();
