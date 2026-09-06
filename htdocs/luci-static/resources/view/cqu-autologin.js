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
			_('定期检测指定主机；连续检测失败后，自动重新登录校园网。仅支持一个账号和一个网络接口。'));
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

		o = s.option(form.Value, 'check_host', _('Ping 检测目标'));
		o.default = '223.5.5.5';
		o.rmempty = false;
		o.description = _('可填写 IP、域名或网址；建议使用稳定且允许 ICMP 的公网 IP。');

		o = s.option(form.Value, 'interval', _('检测间隔（秒）'));
		o.datatype = 'uinteger';
		o.default = '30';

		o = s.option(form.Value, 'failure_threshold', _('连续失败次数'));
		o.datatype = 'uinteger';
		o.default = '2';

		o = s.option(form.Value, 'retry_delay', _('登录后等待（秒）'));
		o.datatype = 'uinteger';
		o.default = '10';

		return m.render();
	}
});

