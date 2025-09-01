# Wenchang Wang - Academic Homepage

这是一个现代化的英文学术主页，具有响应式设计。

## 文件结构

```
wenchang-wang.github.io/
├── index.html          # 主页面
├── images/             # 图片目录
│   ├── banner.jpg      # 顶部横幅图片
│   └── profile.jpg     # 个人头像
└── README.md           # 说明文档
```

## 如何添加图片

### 1. 顶部横幅图片
- 将您的横幅图片命名为 `banner.jpg`
- 放置在 `images/` 目录中
- 建议尺寸：至少 1200x300 像素
- 格式：JPG, PNG, WebP

### 2. 个人头像
- 将您的头像命名为 `profile.jpg`
- 放置在 `images/` 目录中
- 建议尺寸：至少 400x400 像素（正方形）
- 格式：JPG, PNG, WebP

## 自定义内容

### 修改个人信息
在 `index.html` 文件中，您可以修改以下内容：

1. **姓名和职位**：
   ```html
   <h2>Wenchang Wang</h2>
   <p class="title">Assistant Professor / Research Scientist</p>
   ```

2. **自我介绍**：
   ```html
   <div class="bio">
       <p>您的自我介绍内容...</p>
   </div>
   ```

3. **研究兴趣**：
   ```html
   <ul>
       <li>您的研究领域1</li>
       <li>您的研究领域2</li>
   </ul>
   ```

4. **联系方式**：
   ```html
   <a href="mailto:your.email@example.com">your.email@example.com</a>
   <a href="https://x.com/yourusername">@yourusername</a>
   ```

### 修改社交媒体链接
在页面底部的社交媒体链接部分，您可以更新链接：

```html
<div class="social-links">
    <a href="https://x.com/yourusername" class="social-link">X</a>
    <a href="https://github.com/yourusername" class="social-link">G</a>
    <a href="https://linkedin.com/in/yourusername" class="social-link">L</a>
</div>
```

## 部署

这个网站可以直接部署到 GitHub Pages：

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源
4. 访问 `https://yourusername.github.io/repository-name` 查看网站

## 特性

- ✅ 响应式设计，支持移动设备
- ✅ 现代化UI设计
- ✅ 优雅的动画效果
- ✅ 易于自定义
- ✅ 快速加载
- ✅ SEO友好

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 技术栈

- HTML5
- CSS3 (Grid, Flexbox)
- 原生JavaScript
- 响应式设计
