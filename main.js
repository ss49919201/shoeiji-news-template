import * as fs from 'node:fs/promises';

function formatHTML(templateHTML, content1, content2, content3) {
  return templateHTML.
    replace('${content1}', content1).
    replace('${content2}', content2).
    replace('${content3}', content3);
}

function isValid(s) {
  // 未実装
  return s.length === 0
}

function validateContents(content1, content2, content3) {
  const invalidContents = [content1, content2, content3].filter((v) => {
    return !isValid(v);
  });
  if (invalidContents.length > 0) {
    throw new Error(`${invalidContents.join(', ')} is/are invalid`);
  };
}

function formatDate(date) {
  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  }).format(date).replace(/[\/: ]/g, '');
}

async function generateHTML(formattedHTML, formattedDate) {
  try {
    await fs.mkdir(`./generated/${formattedDate}`);
    await fs.writeFile(`./generated/${formattedDate}/index.html`, formattedHTML);
  } catch (err) {
    throw err;
  }
}

async function generateRawContents(jsonFilePath) {
  try {
    const json = await fs.readFile(jsonFilePath);
    const contents = JSON.parse(json);

    const requiredKeys = ['content1', 'content2', 'content3']
    const insufficientKeys = requiredKeys.filter((k) => {return !contents.hasOwnProperty(k);});
    if (insufficientKeys.length > 0) {
      throw new Error(`${insufficientKeys.join(', ')} is/are required`);
    }

    return requiredKeys.map(k => contents[k]);
  } catch (err) {
    throw err;
  }
}

async function main() {
  const contents = await generateRawContents('./contents.json').
    catch(err => {
      console.error(err);
      process.exit(1);
    });
  const templateHTML = await fs.readFile('./template.html', {encoding: 'utf8'}).
    catch(err => {
      console.error(err);
      process.exit(1);
    });
  try {
    validateContents(...contents)
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
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
