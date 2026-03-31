# OpenSpec 变更提案 001: 部署 NewsNow 至 Cloudflare Pages 并绑定域名

- **状态**: 已完成
- **创建日期**: 2026-03-31
- **作者**: Claude (AI Assistant)

## 背景

NewsNow 是一个实时新闻聚合应用（React + Vite + Nitro），项目已内置 Cloudflare Pages 部署支持（`CF_PAGES` 环境变量触发 `cloudflare-pages` preset）。用户有一个已托管在 Cloudflare 的闲置域名 `labubupictures.com`，希望将此项目部署上去。

## 目标

1. 将 NewsNow 部署到 Cloudflare Pages
2. 将 `labubupictures.com` 域名绑定到该 Cloudflare Pages 项目
3. 确保基础功能可用（无需登录/缓存功能的基础部署）

## 现状分析

### 项目已具备的能力
- `nitro.config.ts` 已有 `CF_PAGES` 环境判断，自动切换到 `cloudflare-pages` preset
- `example.wrangler.toml` 已提供 Cloudflare Pages 配置模板（含 D1 数据库绑定）
- `package.json` 已有部署脚本：`pnpm run deploy`（使用 `wrangler pages deploy`）
- 构建输出目录：`dist/output/public`
- 已安装 `wrangler` 依赖（v4.14.1）

### 需要完成的事项
- 创建 Cloudflare Pages 项目
- 创建 `wrangler.toml` 配置文件（从 `example.wrangler.toml` 复制并配置）
- 创建 Cloudflare D1 数据库（用于缓存功能）
- 执行构建和部署
- 在 Cloudflare Pages 设置中绑定自定义域名 `labubupictures.com`
- 配置环境变量（至少 `INIT_TABLE=true`）

## 实施步骤

### 阶段 1：准备配置文件

1. **复制 `example.wrangler.toml` 为 `wrangler.toml`**
   - 项目名保持 `newsnow` 或改为合适名称
   - `pages_build_output_dir` 保持 `dist/output/public`

### 阶段 2：创建 Cloudflare 资源

2. **创建 D1 数据库**（可选，基础部署不需要）
   - 通过 Cloudflare Dashboard 或 `wrangler d1 create newsnow-db` 创建
   - 将 `database_id` 填入 `wrangler.toml`

3. **创建 Cloudflare Pages 项目**
   - 方式一：通过 Cloudflare Dashboard 直接导入 GitHub 仓库
   - 方式二：通过 `wrangler pages project create` CLI 创建
   - 构建命令：`pnpm run build`
   - 构建环境变量：`CF_PAGES=1`
   - Node.js 版本：≥ 20

### 阶段 3：首次部署

4. **本地构建并部署**
   ```bash
   cross-env CF_PAGES=1 pnpm run build
   wrangler pages deploy dist/output/public --project-name newsnow
   ```

5. **配置环境变量**（通过 Cloudflare Dashboard 或 wrangler）
   - `INIT_TABLE=true`（首次部署）
   - `ENABLE_CACHE=true`（可选）

### 阶段 4：绑定域名

6. **在 Cloudflare Pages 中添加自定义域名**
   - 进入 Pages 项目设置 → Custom domains
   - 添加 `labubupictures.com`
   - 由于域名已在 Cloudflare DNS 管理，DNS 记录会自动配置
   - SSL 证书自动签发

7. **验证部署**
   - 检查 `https://labubupictures.com` 是否正常访问
   - 验证新闻源加载是否正常

## 风险与注意事项

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 部分新闻源在 CF Workers 环境下可能受限 | 个别源无法获取 | 属于已知限制，不影响整体功能 |
| D1 数据库未配置时登录/缓存不可用 | 功能降级 | 基础部署无需此功能，后续可按需添加 |
| `wrangler.toml` 含敏感信息（database_id） | 安全风险 | 确认 `.gitignore` 已包含 `wrangler.toml` |

## 不在此次范围内

- GitHub OAuth 登录配置
- 生产级缓存策略优化
- CDN 缓存规则调整
- 域名 `www` 子域名重定向

## 验收标准

- [ ] `https://labubupictures.com` 可正常访问 NewsNow 首页
- [ ] 新闻内容正常加载显示
- [ ] HTTPS 证书正常
- [ ] 页面加载性能可接受（< 3s）
