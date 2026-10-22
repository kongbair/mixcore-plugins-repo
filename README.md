# MixCore 发布插件商店

MixCore 插件商店的公开发布仓库。客户端从本仓库根目录 `plugins.json` 读取插件列表并下载安装包。

## 仓库结构

每个插件一个目录，目录内包含：

| 文件 | 说明 |
| ---- | ---- |
| `plugin.json` | 插件清单（名称 / 版本 / 入口 / 窗口 / 权限） |
| `icon.svg` | 商店展示图标 |
| `<name>-<version>.mixplugin` | 插件安装包（构建产物） |
| `README.md` | 插件说明 |

仓库根目录的 `plugins.json` 为商店索引，由 `scripts/build-plugin-store.cjs` 自动生成。

 ```bash
 node scripts/build-plugin-store.cjs . --index-only
 ```

提交并推送 `main` 分支，GitHub Actions 会自动重新生成索引。

