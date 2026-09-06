# luci-app-cqu-autologin

重庆大学校园网单账号自动登录 OpenWrt LuCI 插件。它不依赖 mwan3，也不包含多账号或多 VLAN 逻辑。

## 功能

- 在 LuCI 中配置账号、密码、User-Agent 和电脑/手机终端类型
- 自动从指定 OpenWrt 逻辑网络（默认 `wan`）获取设备、IPv4 和 MAC
- 定期 ping 指定 IP、域名或网址，连续失败后自动重新登录
- 使用 procd 守护进程，配置保存后可重载
- 日志写入系统日志，标签为 `cqu-autologin`

## 编译

### GitHub Actions（推荐）

仓库推送到 GitHub 的 `main` 或 `master` 分支后会自动编译，也可以在
“Actions → Build OpenWrt package → Run workflow”中手动触发。编译完成后，
在该次运行的 Artifacts 区域下载 `luci-app-cqu-autologin` 安装包。

工作流基于 OpenWrt 24.10 的 x86_64 配置构建；由于本插件架构为 `all`，生成的
安装包本身不绑定 x86_64 架构。

### 本地编译

将整个 `luci-app-cqu-autologin` 目录复制到 OpenWrt 源码的 `package/` 目录，然后运行：

```sh
make menuconfig
# LuCI -> Applications -> luci-app-cqu-autologin
make package/luci-app-cqu-autologin/compile V=s
```

生成的 ipk/apk 安装后，在 LuCI 的“服务 → 校园网自动登录”中配置。保存并应用后，建议执行一次：

```sh
/etc/init.d/cqu-autologin enable
/etc/init.d/cqu-autologin restart
```

查看日志：

```sh
logread -e cqu-autologin
```

## 注意

- “Ping 检测目标”必须允许 ICMP；若目标屏蔽 ping，会导致重复登录。
- UA 直接填写浏览器显示的原始字符串，不要手动 URL 编码。
- 登录接口沿用原脚本中的 `login.cqu.edu.cn:801` HTTP 协议和参数。
- 密码保存在 OpenWrt 的 UCI 配置中，请限制路由器管理权限并妥善保护备份。
