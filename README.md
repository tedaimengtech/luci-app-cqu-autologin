# luci-app-cqu-autologin

重庆大学校园网自动登录 OpenWrt LuCI 插件。

## 功能

- 在 LuCI 中配置账号、密码、User-Agent 和电脑/手机终端类型
- 自动从指定 OpenWrt 逻辑网络（默认 `wan`）获取设备、IPv4 和 MAC
- 分别检测 IPv4、IPv6 连通性，各自累计连续失败次数
- IPv4 连续失败后重新登录；IPv4 正常而 IPv6 连续失败时仅重启 IPv6 接口
- 使用 procd 守护进程，配置保存后可重载
- 日志写入系统日志，标签为 `cqu-autologin`

## 使用

从 [Releases](https://github.com/tedaimengtech/luci-app-cqu-autologin/releases) 下载并安装软件包，然后在 LuCI 的“服务 → 校园网自动登录”中配置。保存并应用后，建议执行一次：

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

## IPv4 / IPv6 检测

IPv4 检测目标沿用原配置 `check_host`，强制使用 IPv4。IPv6 默认启用，目标为 `2400:3200::1`，可在 LuCI 中关闭或修改。

IPv6 检测达到“连续失败次数”且本轮 IPv4 公网可达时，通过 netifd 停止、启动指定的 IPv6 逻辑接口，默认 `wan6`。如果实际使用动态接口 `wan_6`，请相应修改。IPv6 接口必须独立于 IPv4 接口；程序拒绝重启同名接口。重启后等待配置的等待时间，再继续检测。

程序以 IPv4 公网可达作为账号仍在线的依据，尚未直接查询认证服务器的会话状态。IPv4 也不可达时优先按原逻辑重新登录，不重启 IPv6。没有 IPv6 接入的网络请关闭 IPv6 检测。两个检测目标均需允许对应协议的 ping。

开发时可运行 `sh tests/connectivity.sh`，验证检测分支和接口重启行为；实际 IPv6 恢复效果需在路由器上验证。

## 版本发布

推送 `main` / `master` 或手动运行 workflow 后，自动构建并发布新的 Release，无需手动创建标签。

版本格式为 `v年.月.日.时分秒.运行编号.重跑次数`，时间使用北京时间（Asia/Shanghai），例如 `v2026.10.23.233000.123456789.1`。运行编号和重跑次数用于区分同时构建及重新运行的任务。

每次发布自动创建独立标签，指向本次构建的提交。安装包内部版本同步使用相同版本号（去掉 `v`），保留历史 Release，不再移动固定的 `latest` 标签或覆盖旧附件。

### 构建缓存

workflow 缓存已解压的 OpenWrt SDK 、已准备好的 LuCI feed 和打包所需的宿主工具。首次运行需要下载、更新并安装 feed，以及构建 Lua、LuCI 的宿主工具；后续命中缓存时跳过这些步骤，直接复制本次源码并打包。插件使用 `NO_DEPS=1` 构建，不再连带编译 curl、rpcd、ucode 等运行依赖；安装时仍由 opkg 根据依赖声明安装。

缓存按运行平台、SDK 版本、目标平台和 `SDK_CACHE_VERSION` 隔离。需要刷新 feed 时，增加 `.github/workflows/build.yml` 中的 `SDK_CACHE_VERSION`；更换 SDK 版本或目标平台也会自动重新准备。缓存丢失或被清理后会自动重建。宿主机依赖仍在每次运行时安装。

缓存保存发生在复制项目源码之前，避免把旧项目代码、旧安装包带入下一次发布；插件配置会在每次打包前重新生成。
