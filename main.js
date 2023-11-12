import * as fs from 'node:fs/promises';

function formatHTML(templateHTML, content1, content2, content3) {
  return templateHTML.
    replace('${content1}', content1).
    replace('${content2}', content2).
    replace('${content3}', content3);
}

function validate(s) {
  // 未実装
  return s.length === 0
}

function validateContents(content1, content2, content3) {
  const invalidContents = [content1, content2, content3].flatMap((v) => {
    return validate(v) ? [] : v;
  });
  if (invalidContents.length > 0) {
    return {
      errorOccurred: true,
      errorString: 'Contains invalid contents',
      errorContents: invalidContents
    }
  };
  return {
    errorOccurred: false,
    errorString: '',
    errorContents: []
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  }).format(date).replace(/[\/: ]/g, '');
}

async function generateHTML(formattedHTML, formattedDate) {
  try {
    await fs.mkdir(`./${formattedDate}`);
    await fs.writeFile(`./${formattedDate}/index.html`, formattedHTML);
  } catch (err) {
    throw err;
  }
}

function main() {
  const contents = ["a", "b", "c"];
  const templateHTML = fs.readFile('./template.html', {encoding: 'utf8'}).
    catch(

  );
  const validateResult = validateContents(...contents);
  if (validateResult.errorOccurred) {
    console.error(validateResult.errorString);
    process.exit(1);
  };
  const date = new Date();
  const formattedDate = formatDate(date)
  const formattedHTML = formatHTML(templateHTML, ...contents);
  generateHTML(formattedHTML, formattedDate).
    catch(err => {
      console.error(err.message);
      process.exit(1);
    });
}

main();
