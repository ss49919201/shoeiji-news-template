import * as fs from 'node:fs';

function formatHTML(templateHTML, content1, content2, content3) {
  return templateHTML.
    replace('${content1}', content1).
    replace('${content2}', content2).
    replace('${content3}', content3);
}

function validate(s) {
  return s.length < 300
}

function validateContents(content1, content2, content3) {
  [content1, content2, content3].forEach((v) => {
    if (!validate(v)) {
      throw new Error("文字列が不正です")
    };
  });
}

function formatDate(date) {
  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  }).format(date).replace(/[\/: ]/g, '');
}

const contents = ["", "", ""];
const templateHTML = fs.readFileSync('./template.html', {encoding: 'utf8'});
validateContents(...contents);
const date = new Date();
const formattedDate = formatDate(date)
const formattedHTML = formatHTML(templateHTML, ...contents);
fs.mkdirSync(`./${formattedDate}`);
fs.writeFileSync(`./${formattedDate}/index.html`, formattedHTML);
