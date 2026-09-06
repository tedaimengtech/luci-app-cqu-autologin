include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for CQU campus network auto login
LUCI_DEPENDS:=+curl +iputils-ping +jsonfilter +rpcd +ucode
LUCI_PKGARCH:=all

PKG_MAINTAINER:=Local Build
PKG_LICENSE:=MIT

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
