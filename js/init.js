// 判断是否为低版本浏览器
if (!window.applicationCache) {
	$('body').html('<div style="position: fixed;top: 0;right: 0;bottom: 0;left: 0;width: 100%;height: 100%;background: url(/images/browserLow.png) #000 center no-repeat;"></div>');
}

// 初始化用户信息
CONFIG.USER.UESR_CODE = ArtJS.cookie.get('User_code') || '';
CONFIG.USER.UESR_ID   = ArtJS.cookie.get('User_id') || '';
CONFIG.USER.TOKEN     = ArtJS.cookie.get('toKen') || '';
CONFIG.USER.ICON_URL  = ArtJS.cookie.getFilter('iconUrl') || '';
CONFIG.USER.ACCOUNT   = ArtJS.cookie.getFilter('loginAccount') || '';
CONFIG.USER.NAME      = ArtJS.cookie.getFilter('nickName') || '';
CONFIG.USER.REGIONAL  = ArtJS.cookie.getFilter('regional') || '';

// google|百度统计 true: 执行 false: 取消
ArtJS.track.init({google: true, baidu: true});

// 初始化DOMAIN
ArtJS.page.setDomain();