// 调整index.html中文件加载顺序
const fs = require('fs');
const path = require('path');

// 读取 HTML 文件内容
const htmlFilePath = path.resolve(__dirname, 'dist/index.html'); // 你的 HTML 文件路径
let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

// 找到要移动的 JavaScript 和 CSS 文件的引用
const jsScriptTagsRegex = /<script[^>]+defer="defer"[^>]+src=["'](.*?)["'][^>]*><\/script>/gi;
const cssLinkTagsRegex = /<link[^>]+href=["'](.*?)["'][^>]+rel=["']stylesheet["'][^>]*>/gi;
const jsScriptTags = htmlContent.match(jsScriptTagsRegex) || [];
const cssLinkTags = htmlContent.match(cssLinkTagsRegex) || [];

console.log('--------匹配到----------')
console.log(jsScriptTags)
console.log(cssLinkTags)

// 移除 HTML 文件中的 JavaScript 和 CSS 文件的引用
htmlContent = htmlContent.replace(jsScriptTagsRegex, '');
htmlContent = htmlContent.replace(cssLinkTagsRegex, '');

// 将 JavaScript 和 CSS 文件的引用添加到 HTML 文件末尾
htmlContent = htmlContent.replace('</body>', jsScriptTags.join('') + cssLinkTags.join('') + '<script>console.error("' + new Date() + '")</script></body>');

// 将更新后的 HTML 文件内容写回到文件中
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');

console.log('Assets moved successfully!');