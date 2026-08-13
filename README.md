# MixCore 插件商店

MixCore 插件商店的公开插件仓库。商店客户端从本仓库根目录 `plugins.json` 读取插件列表并下载安装包。

## 仓库结构

每个插件一个目录，目录内包含：

| 文件 | 说明 |
| ---- | ---- |
| `plugin.json` | 插件清单（名称 / 版本 / 入口 / 窗口 / 权限） |
| `icon.svg` | 商店展示图标 |
| `<name>-<version>.mixplugin` | 插件安装包（构建产物） |
| `README.md` | 插件说明 |

仓库根目录的 `plugins.json` 为商店索引，由 `scripts/build-plugin-store.cjs` 自动生成。

## 添加 / 更新插件

1. 在 MixCore 主仓库 `plugins/<name>/` 中开发并构建；
2. 将 `plugin.json`、`icon.svg`、`<name>-<version>.mixplugin` 复制到本仓库对应目录；
3. 本地重新生成索引：

   ```bash
   node scripts/build-plugin-store.cjs . --index-only
   ```

4. 提交并推送 `main` 分支，GitHub Actions 会自动重新生成索引（日常无需手动执行第 3 步）。

## 权限说明

| 权限 | 用途 |
| ---- | ---- |
| db | 插件数据存储（LMDB） |
| store | 插件级配置读写（config.json） |
| clipboard | 剪贴板读写与宿主共享历史 |
| notify | 系统通知 |
| window | 窗口控制 |
| shell | 打开外部链接 / 本地路径 |
| network | 安全网络请求 |
| file | 用户文件读写（授权路径内） |
| git | 只读当前项目 Git 分支与配置 |
| shortcut | 全局快捷键 |
| events | 跨插件 / 主应用事件通信 |
| schedule | 定时任务 |
| app | 与主应用界面双向通信 |
