# 剪切板（mixcore-clipboard）

剪切板历史记录与收藏（内置应用迁移）

## 功能特性

- 剪切板历史记录
- 收藏常用内容
- 宿主共享剪贴板历史（复制 / 删除 / 收藏 / 清空）

## 安装

1. 打开 MixCore **插件中心 → 插件商店**，搜索「剪切板」并点击安装；或
2. 下载 `mixcore-clipboard-1.0.0.mixplugin` 后，在 **插件中心 → 已安装插件** 点击「导入插件」选择该安装包。

## 权限说明

| 权限 | 用途 |
| ---- | ---- |
| clipboard | 剪贴板读写与宿主共享历史 |
| events | 跨插件 / 主应用事件通信 |
| store | 插件级配置读写（config.json） |
| db | 插件数据存储（LMDB） |
| window | 窗口控制 |

## 数据

- 插件数据独立存放在 `<数据目录>/plugin-data/mixcore-clipboard/`（LMDB + config.json），自包含；
- 卸载插件时数据目录一并删除，如需保留请先备份。

## 源码

源码位于 MixCore 主仓库 `plugins/mixcore-clipboard/` 目录，商店分发使用构建产物。
