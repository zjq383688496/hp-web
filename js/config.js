;CONFIG = {
	HOST_URL: '//www.cmall.com/',					// 域
	IMG_URL:  'http://image.cmall.com/imgsrv/',	// 图片域
	// 用户信息
	USER: {
		UESR_CODE: '',
		UESR_ID: '',
		KEY: '',
		ICON_URL: '',
		ACCOUNT: '',
		NAME: ''
	},
	CODE_SUCCESS: '200',	// AJAX请求成功CODE
	METHOD: 'GET'			// AJAX请求类型
};

/* 搜索 */
CONFIG.IS_SEARCH = location.href.indexOf('search.html') > -1;
CONFIG.SEARCH = {
	url: CONFIG.HOST_URL + 'search.html',
	searchType: '02',	// 终端 02: PC
	sType: 'topic',		// 类别 String	灯丝圈
	Type: '4'			// 类别 Code
};
if (location.href.indexOf('theme.html') > -1) {			// 精品店
	CONFIG.SEARCH.sType = 'tag';
	CONFIG.SEARCH.Type = '3';
}

/* 接口 */
CONFIG.API = {
	// 搜索
	SEARCH: {
		TOPIC:   '/topicSocSite/topic/searchTopic',		// 灯丝圈
		GOODS:   '/goodsSite/goods/searchGoods',		// 礼品店
		ARTS:    '/goodsSite/arts/searchArts',			// 收藏品
		MEMBERS: '/memberSite/members/searchArtists'	// 艺术家
	},
	// 用户
	USER: {
		getMember: '/memberSite/members/getMember'		// 用户信息
	}
}

/* angular作用域集合 */
var scopeArr = {};