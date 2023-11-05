function format(content1, content2, content3) {
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>正栄寺新聞</title>
	<link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="container header">
      title
    </div>
    <div class="container content">
      ${content1}
    </div>
    <div class="container content">
      ${content2}
    </div>
    <div class="container content">
      ${content3}
    </div>
  </body>
</html>`
}

function validate(s) {
  return s.length < 1
}

const contents = ["", "", ""];

contents.forEach((v) => {
  console.log(v);
  if (!validate(v)) {
    throw new Error("文字列が不正です")
  };
});

console.log(format(...contents));
