'use strict';
'require view';
'require form';
'require uci';

return view.extend({
	load: function() {
		return uci.load('cqu-autologin');
	},

	render: function() {
		var m = new form.Map('cqu-autologin', _('校园网自动登录'),
			_('分别检测 IPv4 和 IPv6；IPv4 连续失败时重新登录，IPv4 正常而 IPv6 连续失败时重启 IPv6 接口。'));
		var s = m.section(form.NamedSection, 'main', 'main', _('基本设置'));
		s.addremove = false;

		var o = s.option(form.Flag, 'enabled', _('启用'));
		o.rmempty = false;

		o = s.option(form.Value, 'username', _('账号'));
		o.rmempty = false;

		o = s.option(form.Value, 'password', _('密码'));
		o.password = true;
		o.rmempty = false;

		o = s.option(form.ListValue, 'device_type', _('终端类型'));
		o.value('pc', _('电脑'));
		o.value('phone', _('手机'));
		o.default = 'pc';

		o = s.option(form.Value, 'user_agent', _('User-Agent'));
		o.rmempty = false;
		o.description = _('填写原始 UA 文本，无需手动进行 URL 编码。');

		o = s.option(form.Value, 'network', _('OpenWrt 网络接口'));
		o.default = 'wan';
		o.rmempty = false;
		o.description = _('通常填写 wan；程序会自动获取它对应的设备、IPv4 地址和 MAC 地址。');

		o = s.option(form.Value, 'check_host', _('IPv4 Ping 检测目标'));
		o.default = '223.5.5.5';
		o.rmempty = false;
		o.description = _('可填写 IP、域名或网址；建议使用稳定且允许 ICMP 的公网 IP。');

		o = s.option(form.Flag, 'ipv6_enabled', _('启用 IPv6 检测'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Value, 'ipv6_network', _('IPv6 网络接口'));
		o.default = 'wan6';
		o.rmempty = false;
		o.depends('ipv6_enabled', '1');
		o.description = _('填写独立的 IPv6 逻辑接口，例如 wan6 或 wan_6；不能与上面的 IPv4 接口相同。');
		o.validate = function(section_id, value) {
			var ipv4 = this.map.lookupOption('network', section_id)[0];
			return value && value !== ipv4.formvalue(section_id)
				? true : _('请填写独立于 IPv4 的 IPv6 接口。');
		};

		o = s.option(form.Value, 'check_host6', _('IPv6 Ping 检测目标'));
		o.default = '2400:3200::1';
		o.datatype = 'host';
		o.rmempty = false;
		o.depends('ipv6_enabled', '1');
		o.description = _('填写允许 ICMPv6 的公网 IPv6 地址或域名，不支持网址。IPv4 公网可达视为账号仍在线。');

		o = s.option(form.Value, 'interval', _('检测间隔（秒）'));
		o.datatype = 'uinteger';
		o.default = '30';

		o = s.option(form.Value, 'failure_threshold', _('连续失败次数'));
		o.datatype = 'uinteger';
		o.default = '2';

		o = s.option(form.Value, 'retry_delay', _('登录或 IPv6 重启后等待（秒）'));
		o.datatype = 'uinteger';
		o.default = '10';

		return m.render();
	}
});

