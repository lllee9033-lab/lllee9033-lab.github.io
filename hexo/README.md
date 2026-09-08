# Lllee 的个人网站

网站：<https://lllee9033-lab.github.io/>

使用 Hexo 8 和 [Theme Redefine 2.9.0](https://github.com/EvanNotFound/hexo-theme-redefine)。保留主题的 Hexo / Redefine 署名；主题及附带资源按其原许可使用。

## 更新内容

- 个人介绍：`source/about.md`
- 文章：`source/_posts/` 中的 Markdown 文件
- 网站标题与 URL：`_config.yml`
- 首页横幅、导航、配色等：`_config.redefine.yml`

修改后提交到 GitHub 的 `main` 分支，GitHub Actions 会自动构建并发布。

## 本地运行

需要 Node.js 24 和 pnpm 11.19.0。

```sh
pnpm install --frozen-lockfile
pnpm server
```

## 构建

```sh
pnpm build
```

输出位于 `public/`，由仓库的 `.github/workflows/pages.yml` 发布。
