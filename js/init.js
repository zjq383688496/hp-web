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