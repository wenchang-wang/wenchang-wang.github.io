# 博客使用说明

所有文章共用网站根目录的 `../site.css` 和 `../site.js`，自动带有导航栏、中英文切换、深色模式和音符动画。不需要在文章里写样式。

## 添加新文章

1. 复制模板：
   ```bash
   cp article-template.html my-new-article.html
   ```
   文件名用英文和连字符，例如 `my-new-article.html`。

2. 修改 `<head>`：
   - `<title>`、`title-en`、`title-zh`、`og:title`：文章标题
   - `description` 和 `og:description`：一两句话的摘要
   - `canonical` 和 `og:url`：改成 `https://wenchang-wang.github.io/blog1/my-new-article.html`
   - 把 `<meta name="robots" content="noindex">` 改成 `index, follow`（模板默认不被搜索引擎收录）

3. 修改文章头部 `<div class="head">`：
   - `.kicker`：日期和分类，例如 `2026.11.09 · 研究方法`
   - `<h1>`：标题；`.sub`：副标题（可选）
   - `.tags`：标签

4. 在 `<div class="prose">` 里写正文。

5. 在 `../blog.html` 的 `<div class="pubs">` 里加一张 `<a class="post">` 卡片（照抄已有的那张），并把文章加入 `../sitemap.xml`。

## 正文格式

- 章节标题用 `<h2>`，小节用 `<h3>`（`<h1>` 已用于文章标题）
- 段落 `<p>`，列表 `<ul>` / `<ol>`，引用 `<blockquote>`，代码 `<code>` / `<pre>`
- 图片放在 `../images/`，用 `<img src="../images/xxx.png" alt="说明">`

## 可选组件

```html
<div class="callout"><h4>小标题</h4><p>重点内容</p></div>

<div class="stats">
  <div class="stat"><b>99,046</b><span>Images</span></div>
</div>

<div class="table"><table>...</table></div>

<div class="sec"><h2>卡片式章节</h2><div class="body"><p>...</p></div></div>
```

`ic2s2-online-poster.html` 是使用这些组件的完整例子。
