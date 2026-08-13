# 工作项目（mixcore-git-project）

项目 Git 分支与 GitLab MR 概览（内置应用迁移）

## 功能特性

- 本地工作项目列表
- 当前项目 Git 分支概览
- GitLab MR 列表查看

## 安装

1. 打开 MixCore **插件中心 → 插件商店**，搜索「工作项目」并点击安装；或
2. 下载 `mixcore-git-project-1.0.0.mixplugin` 后，在 **插件中心 → 已安装插件** 点击「导入插件」选择该安装包。

## 权限说明

| 权限 | 用途 |
| ---- | ---- |
| db | 插件数据存储（LMDB） |
| store | 插件级配置读写（config.json） |
| file | 用户文件读写（授权路径内） |
| network | 安全网络请求 |
| git | 只读当前项目 Git 分支与配置 |
| shell | 打开外部链接 / 本地路径 |

## 数据

- 插件数据独立存放在 `<数据目录>/plugin-data/mixcore-git-project/`（LMDB + config.json），自包含；
- 卸载插件时数据目录一并删除，如需保留请先备份。

## 源码

源码位于 MixCore 主仓库 `plugins/mixcore-git-project/` 目录，商店分发使用构建产物。
