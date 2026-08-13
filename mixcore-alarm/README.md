# 闹钟（mixcore-alarm）

闹钟提醒（内置应用迁移，数据自包含，到点系统通知）

## 功能特性

- 创建与管理多个闹钟
- 到点由宿主直接弹出系统通知，无需保持窗口打开
- 数据保存在插件自己的 LMDB 中，自包含

## 安装

1. 打开 MixCore **插件中心 → 插件商店**，搜索「闹钟」并点击安装；或
2. 下载 `mixcore-alarm-1.0.0.mixplugin` 后，在 **插件中心 → 已安装插件** 点击「导入插件」选择该安装包。

## 权限说明

| 权限 | 用途 |
| ---- | ---- |
| db | 插件数据存储（LMDB） |
| schedule | 定时任务 |
| events | 跨插件 / 主应用事件通信 |
| store | 插件级配置读写（config.json） |

## 数据

- 插件数据独立存放在 `<数据目录>/plugin-data/mixcore-alarm/`（LMDB + config.json），自包含；
- 卸载插件时数据目录一并删除，如需保留请先备份。

## 源码

源码位于 MixCore 主仓库 `plugins/mixcore-alarm/` 目录，商店分发使用构建产物。
