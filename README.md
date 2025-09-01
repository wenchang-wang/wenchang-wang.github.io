# Wenchang Wang - Academic Homepage

这是一个现代化的英文学术主页，具有响应式设计和多页面导航。

## 文件结构

```
wenchang-wang.github.io/
├── index.html          # 主页
├── cv.html             # CV页面
├── research.html       # 研究页面
├── blog.html           # 博客页面
├── images/             # 图片目录
│   ├── banner.jpg      # 顶部横幅图片
│   ├── profile.jpg     # 个人头像
│   ├── pku-logo.png    # 北京大学校徽
│   ├── uni-koeln-logo.png # 科隆大学校徽
│   └── suda-logo.png   # 苏州大学校徽
├── files/              # 文件目录
│   └── cv.pdf          # CV文件
└── README.md           # 说明文档
```

## 页面功能

### 1. 主页 (index.html)
- 顶部横幅展示
- 个人头像和联系方式
- 英文自我介绍
- 教育经历展示
- 获奖情况

### 2. CV页面 (cv.html)
- CV文件下载功能
- 文件上传区域（支持拖拽）
- 文件预览功能

### 3. 研究页面 (research.html)
- 最新研究论文
- 同行评议会议论文
- 进行中的研究项目

### 4. 博客页面 (blog.html)
- 预留的博客空间
- 即将推出提示

## 如何添加图片

### 1. 顶部横幅图片
- 将您的横幅图片命名为 `banner.jpg`
- 放置在 `images/` 目录中
- 建议尺寸：至少 1200x400 像素
- 格式：JPG, PNG, WebP

### 2. 个人头像
- 将您的头像命名为 `profile.jpg`
- 放置在 `images/` 目录中
- 建议尺寸：至少 400x400 像素（正方形）
- 格式：JPG, PNG, WebP

### 3. 学校校徽
- 北京大学：`pku-logo.png`
- 科隆大学：`uni-koeln-logo.png`
- 苏州大学：`suda-logo.png`
- 放置在 `images/` 目录中
- 建议尺寸：80x80 像素（圆形显示）

## 如何添加CV文件

将您的CV文件命名为 `cv.pdf` 并放置在 `files/` 目录中。

## 自定义内容

### 修改个人信息
在各个HTML文件中，您可以修改以下内容：

1. **联系方式**：
   ```html
   <a href="mailto:your.email@example.com">your.email@example.com</a>
   <a href="https://x.com/yourusername">@yourusername</a>
   ```

2. **社交媒体链接**：
   ```html
   <a href="https://x.com/yourusername" class="social-link">X</a>
   <a href="https://github.com/yourusername" class="social-link">G</a>
   <a href="https://linkedin.com/in/yourusername" class="social-link">L</a>
   ```

### 修改研究内容
在 `research.html` 中，您可以：
- 添加新的研究论文
- 更新会议信息
- 修改进行中的项目

## 部署

这个网站可以直接部署到 GitHub Pages：

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源
4. 访问 `https://wenchang-wang.github.io` 查看网站

## 特性

- ✅ 多页面导航
- ✅ 响应式设计，支持移动设备
- ✅ 现代化UI设计
- ✅ 优雅的动画效果
- ✅ 文件上传和下载功能
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
- 文件上传API
