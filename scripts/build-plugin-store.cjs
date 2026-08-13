/**
 * 构建插件商店索引（plugins.json）并打包各插件为 .mixplugin
 *
 * 用法：node scripts/build-plugin-store.cjs [<仓库根目录>] [-o <输出目录>] [--index-only]
 * - 默认仓库根目录 = 当前工作目录，输出目录 = 仓库根目录；
 * - 每个含 plugin.json 的子目录视为一个插件：
 *   - 校验清单（name/version/entry/window/permissions，禁止 shortcuts）；
 *   - 打包为 <name>-<version>.mixplugin（排除 node_modules/.git/*.mixplugin）；
 *   - 计算 md5 并生成商店索引条目；
 * - --index-only：不重新打包，直接使用目录内现成的 <name>-<version>.mixplugin
 *   计算 md5 生成索引（预构建包提交模式，CI 重建索引用）；
 * - 可选 <插件目录>/store.json 提供商店运营字段：category / tags / homepage。
 */
const AdmZip = require('adm-zip')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const NAME_RE = /^[a-zA-Z0-9_-]{1,64}$/
const ALLOWED_PERMISSIONS = [
  'db',
  'store',
  'clipboard',
  'notify',
  'window',
  'shell',
  'network',
  'file',
  'git',
  'shortcut',
  'events',
  'schedule',
  'app'
]

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex')
}

function collectFiles(dir, rel = '', out = []) {
  for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    const name = entry.name
    if (entry.isDirectory()) {
      if (name === '.git' || name === 'node_modules') continue
      collectFiles(dir, path.join(rel, name), out)
    } else if (entry.isFile()) {
      if (name.endsWith('.mixplugin') || name.toLowerCase() === 'store.json' || name.toLowerCase() === 'readme.md') continue
      out.push(path.join(rel, name))
    }
  }
  return out
}

function readManifest(pluginDir, dirName, skipEntryCheck = false) {
  const manifestPath = path.join(pluginDir, 'plugin.json')
  if (!fs.existsSync(manifestPath)) return null
  let manifest
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  } catch {
    console.warn(`[skip] ${dirName}: plugin.json 不是合法 JSON`)
    return null
  }
  if (!manifest.name || !NAME_RE.test(manifest.name)) {
    console.warn(`[skip] ${dirName}: name 非法（需为字母/数字/_-，1-64 位）`)
    return null
  }
  if (!manifest.version || !manifest.title || !manifest.entry) {
    console.warn(`[skip] ${dirName}: 缺少 version/title/entry`)
    return null
  }
  if (manifest.shortcuts) {
    console.warn(`[skip] ${dirName}: manifest 禁止声明 shortcuts`)
    return null
  }
  const w = manifest.window
  if (!w || !w.width || !w.height) {
    console.warn(`[skip] ${dirName}: 缺少 window.width/height`)
    return null
  }
  if (Array.isArray(manifest.permissions)) {
    for (const p of manifest.permissions) {
      if (!ALLOWED_PERMISSIONS.includes(p)) {
        console.warn(`[skip] ${dirName}: 权限非法: ${p}`)
        return null
      }
    }
  }
  if (!skipEntryCheck && !fs.existsSync(path.join(pluginDir, manifest.entry))) {
    console.warn(`[skip] ${dirName}: 入口文件不存在: ${manifest.entry}`)
    return null
  }
  return manifest
}

function readStoreMeta(pluginDir) {
  const file = path.join(pluginDir, 'store.json')
  if (!fs.existsSync(file)) return {}
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8')) || {}
    const meta = {}
    if (typeof raw.category === 'string' && raw.category) meta.category = raw.category
    if (Array.isArray(raw.tags)) {
      meta.tags = raw.tags.filter((t) => typeof t === 'string' && t).slice(0, 8)
    }
    if (typeof raw.homepage === 'string' && raw.homepage) meta.homepage = raw.homepage
    return meta
  } catch {
    console.warn(`[warn] ${pluginDir}/store.json 不是合法 JSON，已忽略`)
    return {}
  }
}

function main() {
  const args = process.argv.slice(2)
  const indexOnly = args.includes('--index-only')
  const rootArg = args.find((a) => !a.startsWith('-'))
  const root = path.resolve(rootArg || process.cwd())
  const outDir = args.includes('-o') ? path.resolve(args[args.indexOf('-o') + 1]) : root
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    console.error(`仓库根目录不存在: ${root}`)
    process.exit(1)
  }
  fs.mkdirSync(outDir, { recursive: true })

  const plugins = []
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue
    const pluginDir = path.join(root, entry.name)
    const manifest = readManifest(pluginDir, entry.name, indexOnly)
    if (!manifest) continue

    const zipFile = `${manifest.name}-${manifest.version}.mixplugin`
    let packageMd5 = ''
    let packageSize = 0
    if (indexOnly) {
      const zipPath = path.join(pluginDir, zipFile)
      if (!fs.existsSync(zipPath)) {
        console.warn(`[skip] ${entry.name}: 缺少 ${zipFile}（--index-only 模式不重新打包）`)
        continue
      }
      const buf = fs.readFileSync(zipPath)
      packageMd5 = md5(buf)
      packageSize = buf.length
    } else {
      const files = collectFiles(pluginDir)
      if (files.length === 0) {
        console.warn(`[skip] ${entry.name}: 目录内没有可打包文件`)
        continue
      }
      const zip = new AdmZip()
      for (const f of files) {
        const rel = path.dirname(f).split(path.sep).join('/')
        zip.addLocalFile(path.join(pluginDir, f), rel === '.' ? '' : rel)
      }
      const zipPath = path.join(pluginDir, zipFile)
      const tmpZip = `${zipPath}.tmp`
      zip.writeZip(tmpZip)
      const buf = fs.readFileSync(tmpZip)
      fs.renameSync(tmpZip, zipPath)
      packageMd5 = md5(buf)
      packageSize = buf.length
    }

    const meta = readStoreMeta(pluginDir)
    plugins.push({
      name: manifest.name,
      title: manifest.title,
      description: manifest.description || undefined,
      author: manifest.author || undefined,
      version: manifest.version,
      icon: manifest.icon || undefined,
      entry: manifest.entry,
      permissions: manifest.permissions || [],
      path: entry.name,
      package: zipFile,
      package_md5: packageMd5,
      ...meta
    })
    console.log(
      `[ok] ${manifest.name} v${manifest.version} -> ${zipFile} (${packageSize} bytes${indexOnly ? ', index-only' : ''})`
    )
  }

  plugins.sort((a, b) => a.name.localeCompare(b.name))
  const indexFile = path.join(outDir, 'plugins.json')
  fs.writeFileSync(indexFile, JSON.stringify(plugins, null, 2) + '\n', 'utf8')
  console.log(`已生成 ${indexFile}，共 ${plugins.length} 个插件`)
}

main()



