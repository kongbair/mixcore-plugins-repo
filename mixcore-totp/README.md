# 身份验证（mixcore-totp）

TOTP 身份验证码（内置应用迁移，数据自包含）

## 功能特性

- TOTP 验证码生成（HMAC-SHA1 / Base32）
- 纯前端实现，密钥不离开本地
- 验证码一键复制

## 安装

1. 打开 MixCore **插件中心 → 插件商店**，搜索「身份验证」并点击安装；或
2. 下载 `mixcore-totp-1.0.0.mixplugin` 后，在 **插件中心 → 已安装插件** 点击「导入插件」选择该安装包。

## 权限说明

| 权限 | 用途 |
| ---- | ---- |
| db | 插件数据存储（LMDB） |
| store | 插件级配置读写（config.json） |
| events | 跨插件 / 主应用事件通信 |
| clipboard | 剪贴板读写与宿主共享历史 |
| window | 窗口控制 |

## 数据

- 插件数据独立存放在 `<数据目录>/plugin-data/mixcore-totp/`（LMDB + config.json），自包含；
- 卸载插件时数据目录一并删除，如需保留请先备份。

## 源码

源码位于 MixCore 主仓库 `plugins/mixcore-totp/` 目录，商店分发使用构建产物。
