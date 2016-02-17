if (!window.applicationCache) {
	$('body').html('<div style="position: fixed;top: 0;right: 0;bottom: 0;left: 0;width: 100%;height: 100%;background: url(/drift/images/browserLow.png) #000 center no-repeat;"></div>');
}

var parentId = '';
var lpName = '';
var rootPath = ArtJS.server.art;//pips数据请求;
var LANGUAGE_CONFIG = {
	'CN': {
		login: {	// 7
			login:    '登录',
			register: '注册',
			user:     '账号',
			email:    '邮箱',
			password: '密码',
			remember: '记住密码',
			forgot:   '忘记密码',
			msg:      '密码 6-16 字符'
		},
		nav: {		// 11
			home:     '首　　页',
			order:    '我的订单',
			cart:     '购物车',
			address:  '收货地址',
			subject:  '发布博客',
			withdraw: '提　　现',
			about:    '关于我们',
			contact:  '联系我们',
			protocol: '用户条款',
			privacy:  '隐私政策',
			editor:   '编辑页面',
			logout:   '退　　出'
		},
		type: {		// 5
			works:    '商城',
			special:  '圈子',
			goods:    '商品',
			artwork:  '艺术原作',
			artist:   '艺术家',
			diy:      'DIY'
		},
		search: {	// 1
			placeholder: '搜索艺术品、艺术家或文章'
		},
		goods: {	// 18
			sellout:    '非卖品',
			relatedPr:  '相 关 商 品',
			front:      '正面',
			back:       '反面',
			follow:     '关注',
			following:  '已关注',
			author:     '作者',
			collectors: '收藏者',
			share:      '分 享',
			relatedSp:  '相关博客',
			shareFr:    '和朋友分享这个商品',
			cart:       '加入购物车',
			cartSus:    '加入购物车成功',
			cartErr:    '加入购物车失败',
			size:       '尺码',
			width:      '衣宽',
			length:     '衣长',
			selloutMsg: 'sorry！当前商品暂时不能购买',
			buyAdvice:  '购买咨询',
			publish:    '发布作品',
			publicSale: '公开出售',
			inquiryForSale:'询价出售',
		},
		title: {	// 13
			cart:     '购物车',
			checkout: '结算',
			pay:      '支付',
			goods:    '商品',
			details:  '明细',
			count:    '数量',
			price:    '单价',
			totalSub: '总计',
			total:    '总价',
			shipment: '运费',
			shopping: '继续购物',
			save:     '保存',
			enter:    '确定',
			cancel:   '取消',
			or:       '或',
			width:    '宽',
			height:   '高',
			clear:    '清空选择',
			keyword:  '输入关键词搜索作品',
			status:   '状态',
			orderNo:  '订单编号',
			orderIn:  '订单详细',
			orderAll: '全部订单',
			orderPr:  '正在生产',
			orderDe:  '正在配送',
			orderFi:  '订单完成',
			charity:  '爱心公益',
			events:   '活动赛事',
			copySuccess:'复制成功',
			copyLink:  '复制链接',
			downloadCode:'下载二维码',
			format:    '格式',
			top:       '置顶'
		},
		withdraw: {
			cash:        '申请提现',
			hold:        '冻结金额',
			available:   '可提现金额',
			accumulated: '累计收入',
			msg:         '您产生的分成需要经过14天退换货期之后才能转为可提现金额',
			summary:     '对账单',
			date:        '日期',
			download:    '下载详细账单',
			every:       '信息截止昨天晚上(字改成“信息每24小时更新一次”）',
			searchTime:  '查询时间',
			search:      '查询',
			income:      '收入',
			withdraw:    '提现',
			balance:     '账户余额',
			text:        '请输入正文',
			origional:   '请提供能证明您是原作者的信息',
			info:        '证明信息',
			image:       '证明图片',
			Suggestions: '提示',
			uploadSuccess:'上传成功',
			failed:      '上传失败',
			success:     '发布成功',
			failedPublish:'发布失败',
			saveDrafts:  '保存草稿成功',
			Save:        '修改成功',
			LimitSize:   '视频体积小于100 MB，mp4格式',
			UploadAddressNull:"上传地址不能为空！",
			FiletypeNull:'文件类型不合法,只支持',
			Uploadvideo: '上传视频',
			Reupload:    '重新上传',
			upload:      '上传中'
		},
		activity: {
			to:        '至',
			profit:    '修改您的收入比例',
			supply:    '供货价',
			income:    '您的收入',
			sale:      '售价',
			edit:      '点击编辑',
			blog:      '博客',
			events:    '活动',
			publish:   '发布活动',
			main:      '一级分类',
			secondary: '二级分类',
			third:     '三级分类(商品颜色或尺寸)',
			stocks:    '库存',
			image:     '图片',
			thirdAdd:  '添加一个三级分类',
			check:     '我们正在核实是否有类似作品',
			update:    '您版权正在申请中',
			protect:   '此图片已受版权保护'
		},
		cart: {		   // 3
			del:       '删除',
			all:       '全部',
			delSel:    '删除所选',
			empty:     '您的购物车里空空的，去看看心仪的商品吧',
			browse:    '随便逛逛',
			recommend: '推荐'
		},
		pay: {		// 4
			payment:  '需付款',
			payType:  '支付方式',
			item:     '件',
			orderSus: '创建订单成功'
		},
		address: {	// 14
			address:   '收货地址',
			add:       '添加地址',
			addMsg:    '添加一个新的收货地址',
			name:      '真实姓名',
			nameMsg:   '2-30个字符',
			regional:  '地区',
			street:    '街道名称',
			streetMsg: '请填写省（州）/城市/地区/街道地址',
			contact:   '联系电话',
			zipCode:   '邮编',
			edit:      '编辑',
			del:       '删除',
			setDef:    '设为默认',
			addDef:    '默认地址',
			addMan:    '地址管理'
		},
		special: {	// 22
			click:       '点击',
			like:        '喜欢',
			comment:     '评论',
			Preview:     '预览',
			release:     '发布',
			draft:       '保存为草稿',
			imageAdd:    '添加图片',
			imageChange: '更换图片',
			goodsAdd:    '添加商品',
			videoAdd:    '添加视频',
			relatedG:    '相关衍生品',
			relatedGAdd: '添加相关衍生品',
			select:      '选择',
			tag:         '标签',
			titleEnter:  '请输入标题',
			evaluation:  '您对这篇文章的评价',
			bulbScore:   '点击灯泡评分',
			relatedTAdd: '添加相关标签，用逗号或回车分隔',
			recently:    '最近使用',
			only:        '只差一步',
			style:       '确认您文章的呈现样式',
			cover:       '封面图宽度不能小于540像素  格式:jpg,png',
			CommentNull: '评论内容不能为空'
		},
		user: {		// 23
			edit:        '编辑资料',
			like:        '喜欢',
			fans:        '粉丝',
			follow:      '关注',
			shop:        '专卖店',
			artworkFrom: '的艺术品',
			update:      '上传作品',
			release:     '发布商品',
			copyright:   '版权保护',
			type:        '您的作品是什么类型',
			title:       '标题',
			description: '描述',
			summary:     '吸引人的简介能让更多人发现您的作品',
			original:    '原作',
			art:         '艺术原作',
			prompt:      '作品含有限制级内容 如：裸露或色情，攻击或歧视，暴力画面',
			size:        '原作尺寸',
			price:       '原作价格',
			blogs:       '文章',
			events:      '活动',
			imageDetail: '细节图',
			releaseSp:   '发布博客',
			check:       '我们正在核实是否有类似作品',
			exitMsg:     '离开此页面，您填写的信息不会保存 确定离开吗？',
			editMsg:     '销售衍生品',
			explanation0:'艺术品销售佣金10%（市场最低）',
			explanation1:'衍生品收入归原作购买者',
			explanation2:'艺术灯买家遍布全球37个国家，跨国销售成本会自动加到作品价格中由买家承担',
			explanation3:'卖家只需负责把作品运到您当地艺术灯仓库，其余物流由艺术灯提供',
			explanation4:'更多信息，请阅读',
			explanation5:'原作销售须知'
		},
		edit: {		// 13
			email:    '电子邮箱',
			name:     '昵称',
			summary:  '我的简介',
			country:  '国家',
			sex:      '性别',
			male:     '男',
			female:   '女',
			secrecy:  '保密',
			language: '语言',
			pdEdit:   '修改密码',
			pdOld:    '旧密码',
			pdNew:    '新密码',
			pdCon:    '确认密码'
		},
		check: {
			nameEmpty:    '姓名不能为空!',
			nameErr:      '请填写正确的姓名!',
			phoneEmpty:   '手机不能为空!',
			phoneErr:     '请填写正确的手机号!',
			addressEmpty: '地址不能为空!',
			addressErr:   '请填写正确的地址!',
			titleEmpty:   '标题不能为空!',
			contentEmpty: '内容不能为空!',
			coverEmpty:   '封面图不能为空!'
		},
		alert: {
			del: '确定要删除吗?',
			orderSus: '订单创建成功!',
			orderFai: '订单创建失败!'
		},
		shear:{
			come:"来自CREATIVE MALL的分享",
			shop:"给您分享了一件商品",
			blog:"给您分享了一篇博客",
			events:'给您分享了一个活动',
			arts:"给您分享了"
		},
		new001: {
			t0001: '我也要参加',
			t0002: '人参加',
			t0003: '全部商品',
			t0004: '排行榜',
			t0005: '活动详情',
			t0006: '至',
			t0007: '当前活动已过期',
			t0008: '当前活动未开始',
			t0009: '置顶成功',
			t0010: '置顶失败',
			t0011: '置顶',
			t0012: '添加参赛商品成功',
			t0013: '您已参加过此次活动',
			t0014: '当前活动已结束',
			t0015: '添加参赛商品失败！',
			t0016: '参加活动',
			t0017: '参赛商品',
			t0018: '艺术灯梦想大赛是全球性的艺术大赛，致力于帮助文化创意者完成他们的梦想，请说出你的梦想',
			t0019: '参赛者主页',
			t0020: '分享',
			t0021: '请输入活动标题',
			t0022: '上传图片',
			t0023: '上传封面图片',
			t0024: '销售收益',
			t0025: '主办方',
			t0026: '您的身份验证失败, 你没有权限发布活动信息, 将自动返回首页',
			t0027: '您的身份验证失败, 只有活动发起者才能编辑活动信息, 将自动返回首页',
			t0028: '版权保护翻译',
			t0029: '您申请版权保护的图片是您的原创作品',
			t0030: '现在起您可以享受版权保护',
			t0031: '您还剩余',
			t0032: '张版权保护额度,成功后将扣除一张版权保护额度',
			t0033: '名称',
			t0034: '大小',
			t0035: '进度',
			t0036: '操作',
			t0037: '购物车内没有商品',
			t0038: '没有可用的支付渠道',
			t0039: '请选择地址',
			t0040: '您的收货地址与您的地区不符, 不能发货!请选择与您所在地区相同的收货地址',
			t0041: '商品信息错误',
			t0042: '运费获取失败',
			t0043: '未选择支付方式',
			t0044: '抱歉 , 该商品已下架',
			t0045: '请选择需要购买的商品',
			t0046: '系统提示',
			t0047: '重设密码失败,请重试',
			t0048: '你不能关注自己',
			t0049: '订单状态',
			t0050: '正在生产',
			t0051: '正在配送',
			t0052: '订单完成',
			t0053: '订单编号',
			t0054: '订单时间',
			t0055: '订单金额',
			t0056: '包含',
			t0057: '运费',
			t0058: '收货人',
			t0059: '收货地址',
			t0060: '评论内容不能为空',
			t0061: '收起筛选',
			t0062: '更多筛选',
			t0063: '选好了',
			t0064: '选择您的兴趣',
			t0065: '返回顶部',
			t0066: '添加失败',
			t0067: '请输入关键字',
			t0068: '语言选择',
			t0069: '上传地址不能为空',
			t0070: '文件类型不合法,只支持 jpg、png、jpeg类型',
			t0071: 'SORRY!当前商品暂不支持购买',
			t0072: '发布失败',
			t0073: '发布成功',
			t0074: '保存草稿成功',
			t0075: '上传成功',
			t0076: '上传失败',
			t0077: '添加视频',
			t0078: '贴入URL地址，我们会将网页内容添加到正文里',
			t0079: '不支持当前视频地址，请输入正确的网站地址',
			t0080: '粘贴URL地址',
			t0081: '粘贴链接',
			t0082: '您当前输入网站的网址格式错误，请重新输入',
			t0083: '输 入 关 键 词 搜 索 作 品',
			t0084: '账号不能为空',
			t0085: '账号',
			t0086: '申请提交成功',
			t0087: '金额不能为空',
			t0088: '您输入的金额不是有效数字',
			t0089: '提现金额不能少于50',
			t0090: '提现金额不能超过XXX',
			t0091: '请填写有效的账号',
			t0092: '置顶成功',
			t0093: '置顶失败',
			t0094: '添加参赛商品成功',
			t0095: '您已参加过此次活动',
			t0096: '当前活动已结束',
			t0097: '啊哦~ 添加参赛商品失败',
			t0098: '清空选择',
			t0099: '贴入视频地址，支持YouTube、土豆、优酷等网站',
			t0100: '粘贴视频地址',
			t0101: '不支持当前视频地址，目前仅支持YouTube、土豆、优酷哦',
			t0102: '您的身份验证失败, 你没有权限发布活动信息, 将自动返回首页',
			t0103: '您的身份验证失败, 只有活动发起者才能编辑活动信息, 将自动返回首页',
			t0104: '已上传',
			t0105: '上传速度',
			t0106: '处理中',
			t0107: '创建成功',
			t0108: '创建失败',
			t0109: '支付成功',
			t0110: '支付失败',
			t0111: '我发起的活动',
			t0112: '我参加的活动',
			t0113: '开始时间',
			t0114: '结束时间',
			t0115: '每个参赛者允许的参赛商品数量',
			t0116: '视频体积小于100 MB，mp4格式',
			t0117: '平面作品',
			t0118: '如：油画、插画、摄影、设计',
			t0119: '创意商品',
			t0120: '如：手工艺品、雕塑等立体商品',
			t0121: '您要出售原作吗？',
			t0122: '出售',
			t0123: '不出售',
			t0124: '建议上传',
			t0125: '浏览器最大可上传100MB',
			t0126: '订单支付失败',
			t0127: '很抱歉，支付失败，请返回购物车重新支付',
			t0128: '返回购物车',
			t0129: '订单支付成功',
			t0130: '秒后进入订单详情页面',
			t0131: '查看订单',
			t0132: '继续购物',
			t0133: '美国',
			t0134: '英国',
			t0135: '意大利',
			t0136: '法国',
			t0137: '德国',
			t0138: '阿富汗',
			t0139: '中国',
			t0140: '语言切换',
			t0141: '上传失败,请重新上传',
			t0142: '至少添加3个，按回车键确认',
			t0143: '举报成功',
			t0144: '暂不支持动态图片'
		}
	},
	'US': {
		login: {
			login:    'login',
			register: 'signup',
			user:     'Account',
			email:    'Email',
			password: 'Password',
			remember: 'remember me',
			forgot:   'forgot password',
			msg:      'Password: 6 to 16 characters'
		},
		nav: {
			home:     'Home',
			order:    'My orders',
			cart:     'Cart',
			address:  'Delivery address',
			subject:  'Post blog',
			withdraw: 'Withdraw cash',
			about:    'About us',
			contact:  'Contact us',
			protocol: 'T　&　C',
			privacy:  'Privacy Policy',
			editor:   'Edit',
			logout:   'Logout'
		},
		type: {
			works:    'Market',
			special:  'Community',
			goods:    'Products',
			artwork:  'Original Arts',
			artist:   'Artist',
			diy:      'Create'
		},
		search: {
			placeholder: 'Search Artwork, Blogs, Artist'
		},
		goods: {
			sellout:    'Not for sale',
			relatedPr:  'Related products',
			front:      'front',
			back:       'back',
			follow:     'follow',
			following:  'Following',
			author:     'Artist',
			collectors: 'Collector',
			share:      'Share',
			relatedSp:  'Related blogs',
			shareFr:    'Share this with friends',
			cart:       'Add to Cart',
			cartSus:    'Added to shopping cart',
			cartErr:    'Add to shopping cart failed',
			size:       'Size',
			width:      'width',
			length:     'length',
			selloutMsg: 'sorry！The current goods can not buy',
			buyAdvice:  '购买咨询',
			publish:    'Publish Product',
			publicSale: 'Public sale',
			inquiryForSale:'Inquiry for sale',
		},
		title: {
			cart:     'Shopping Cart',
			checkout: 'Checkout',
			pay:      'Pay',
			goods:    'Products',
			details:  'Details',
			count:    'Quantity',
			price:    'Price',
			totalSub: 'Sub-total',
			total:    'Total',
			shipment: 'Freight cost',
			shopping: 'Continue shopping',
			save:     'Save',
			enter:    'Confirm',
			cancel:   'Cancel',
			or:       'or',
			width:    'Width',
			height:   'Height',
			clear:    'Clear Selection',
			keyword:  'Enter search keywords',
			status:   'Status',
			orderNo:  'Order number',
			orderIn:  'Order details',
			orderAll: 'All orders',
			orderPr:  'Production',
			orderDe:  'Delivery',
			orderFi:  'Finish',
			charity:  'Charity',
			events:   'Events',
			copySuccess:'Copy success',
			copyLink:  'Copy link',
			downloadCode:'Download QR Code',
			format:    'Format',
			top:       'Top'
		},
		withdraw: {
			cash:        'Withdraw cash',
			hold:        'Account On-hold',
			available:   'Available for withdraw',
			accumulated: 'Accumulated Income',
			msg:         'Funds require 14days passing the customer refund period before it is available for withdraw',
			summary:     'Account summary',
			date:        'Dates',
			download:    'Download account summary',
			every:       'Data is updated every 24hours',
			searchTime:  'Search period',
			search:      'Search',
			income:      'Income',
			withdraw:    'Withdraw',
			balance:     'Account Balance',
			text:        'Enter text here',
			origional:   'Please provide supporting document to show that you are the origional creator',
			info:        'Supporting info',
			image:       'Supporting image',
			Suggestions: 'Suggestions',
			uploadSuccess:'Upload success',
			failed:      'Upload failed',
			success:     'Published',
			failedPublish:'Failed to publish',
			saveDrafts:  'Save the drafts',
			Save:        'Saved',
			LimitSize:   'Video volume is less than 100 MP4, MB format',
			UploadAddressNull:"Upload address can not be empty!",
			FiletypeNull:'File type is not legal, only support',
			Uploadvideo: 'Upload video',
			Reupload:    'Re upload',
			upload:      'upload'
		},
		activity: {
			to:        'to',
			profit:    'Edit profit markup',
			supply:    'Supply price',
			income:    'Your income',
			sale:      'Sale price',
			edit:      'Edit',
			blog:      'Blog',
			events:    'Events',
			publish:   'Publish events',
			main:      'Main category',
			secondary: 'Secondary category',
			third:     'Third category',
			stocks:    'Stocks',
			image:     'Image',
			thirdAdd:  'Add third category',
			check:     'Checking for conflict images',
			update:    'Updating intellectural property database',
			protect:   'This artwork is now IP protected'
		},
		cart: {
			del:       'Delete',
			all:       'All',
			delSel:    'Deleted Selected Items',
			empty:     'Shopping Cart Empty',
			browse:    'Browse Products',
			recommend: 'Recommend'
		},
		pay: {
			payment:  'waiting for payment',
			payType:  'payment method',
			item:     '',
			orderSus: 'Order created'
		},
		address: {
			address:   'Delivery address',
			add:       'Add new address',
			addMsg:    'Add new address',
			name:      'Contact name',
			nameMsg:   '2 to 30 characters',
			regional:  'Area',
			street:    'Street',
			streetMsg: 'Enter state/city/street',
			contact:   'Contact number',
			zipCode:   'Postcode',
			edit:      'Edit',
			del:       'Delete',
			setDef:    'Set default',
			addDef:    'Default',
			addMan:    'Address management'
		},
		special: {
			click:       'click',
			like:        'like',
			comment:     'comments',
			Preview:     'preview',
			release:     'publish',
			draft:       'save draft',
			imageAdd:    'Add Image',
			imageChange: 'Change picture',
			goodsAdd:    'Add Product',
			videoAdd:    'Add Video',
			relatedG:    'Related product',
			relatedGAdd: 'Add product',
			select:      'Select',
			tag:         'Tag',
			titleEnter:  'please enter title',
			evaluation:  'Your comments',
			bulbScore:   'give your rating',
			relatedTAdd: 'Add tag search keywords: use comma sign , to separate each word',
			recently:    'Recently used',
			only:        'One more step',
			style:       '',
			cover:       'Cover photo must be bigger than 540 pixels',
			CommentNull: 'Comment content can not be empty'
		},
		user: {
			edit:        'Edit',
			like:        'Like',
			fans:        'Followers',
			follow:      'Follow',
			shop:        'Shop',
			artworkFrom: "'s artwork",
			update:      'Upload',
			release:     'Publish',
			copyright:   'Invisible Code',
			type:        'Type',
			title:       'Title',
			description: 'Description',
			summary:     'Good description will increase your exposure rate',
			original:    'Original Artwork',
			art:         'Original Arts',
			prompt:      'Mature Content 18+',
			size:        'Original Artwork Size',
			price:       'Original Artwork Price',
			imageDetail: 'Detail Photo',
			releaseSp:   'Publish Blog',
			check:       'Checking for identical image',
			blogs:       'Blogs',
			events:      'Events',
			exitMsg:     'Do you want to leave this page, your information will be lost',
			editMsg:     'You can edit the size and location of artwork when its applied to a product',
			explanation0:'Origional Artwork Sales Commission 10%',
			explanation1:'Future product sale income will transfer to the buyer',
			explanation2:'CREATIVE MALL is a Global platform, overseas sales costs will be added on top of your Artwork to be paid by the buyer',
			explanation3:'Seller only needs to ship the origional artwork to your local CREATIVE MALL warehouse',
			explanation4:'All international shipping will be handled by CREATIVE MALL Professional team',
			explanation5:'<Detailed Terms Please Click Here>'
		},
		edit: {
			email:    'Email',
			name:     'NickName',
			summary:  'Personal Description',
			country:  'Country',
			sex:      'Sex',
			male:     'Male',
			female:   'Female',
			secrecy:  'Not sure',
			language: 'Language',
			pdEdit:   'Change password',
			pdOld:    'Old password',
			pdNew:    'New password',
			pdCon:    'Confirm password'
		},
		check: {
			nameEmpty:    'The name can not be empty!',
			nameErr:      'Please fill out the correct name!',
			phoneEmpty:   'The phone number can not be empty!',
			phoneErr:     'Please fill in the correct phone number!',
			addressEmpty: 'The address can not be empty!',
			addressErr:   'Please fill out the correct address!',
			titleEmpty:   'The title number can not be empty!',
			contentEmpty: 'The content number can not be empty!',
			coverEmpty:   'The cover number can not be empty!'
		},
		alert: {
			del: 'You sure you want to delete it?',
			orderSus: 'Create order success!',
			orderFai: 'Create order fails!'
		},
		shear:{
			come:"from CREATIVE MALL",
			shop:"shares you an art product",
			blog:"shares you a blog article",
			events:'shares you an event',
			arts:"shares you"
		},
		new001: {
			t0001: 'Join the event',
			t0002: ' others already joined',
			t0003: 'See all products',
			t0004: 'Top sales',
			t0005: 'More event details',
			t0006: 'to',
			t0007: 'Event Expired',
			t0008: 'Event will start soon',
			t0009: 'Sticked',
			t0010: 'Failed to stick',
			t0011: 'Stick',
			t0012: 'Added to the events',
			t0013: 'Already participated',
			t0014: 'Event closed',
			t0015: 'Failed to add event products',
			t0016: 'Join the event',
			t0017: 'Event products',
			t0018: '艺术灯梦想大赛是全球性的艺术大赛，致力于帮助文化创意者完成他们的梦想，请说出你的梦想',
			t0019: 'Participant\'s homepage',
			t0020: 'Share',
			t0021: 'Name your event',
			t0022: 'Upload image',
			t0023: 'Upload cover image',
			t0024: 'Sales income',
			t0025: 'Event Organizer',
			t0026: 'Authentication failure, back to home page now',
			t0027: 'Failed to be recognized as an event organizer, back to home page now',
			t0028: 'Intellectural property right protection',
			t0029: 'Please make sure you have the proper IPR to be eligible for this IPR protection service',
			t0030: 'Now your artworks is IP protected',
			t0031: 'Remaining',
			t0032: 'Copy right protection credits. 1 credit will be deducted everytime you successfully protect an image.',
			t0033: 'Name',
			t0034: 'Size',
			t0035: 'Progress',
			t0036: 'Edit',
			t0037: 'Cart is empty',
			t0038: 'No payment method available',
			t0039: 'Please choose/input shipping address',
			t0040: 'We only deliver within your country, please select an address within your country',
			t0041: 'Wrong product info',
			t0042: 'Failed to calculate the shipping costs',
			t0043: 'Please selet a payment method',
			t0044: 'The product is currently off the shelf',
			t0045: 'Please select products',
			t0046: 'System tip',
			t0047: 'Failed to reset password, please try again',
			t0048: 'It\'s not allowed to follow your own account',
			t0049: 'Order status',
			t0050: 'Manufacturing in process',
			t0051: 'Order on the way',
			t0052: 'Order completed',
			t0053: 'Order number',
			t0054: 'Order time',
			t0055: 'Order amount',
			t0056: 'include',
			t0057: 'delivery costs',
			t0058: 'Name',
			t0059: 'Shipping Adress',
			t0060: 'Please type your comment',
			t0061: '收起筛选',
			t0062: 'Narrow by more options',
			t0063: 'Selection done',
			t0064: 'Add your favorite',
			t0065: 'Back to top',
			t0066: 'Failed to add',
			t0067: 'Input keywords',
			t0068: 'Select your lanuage',
			t0069: 'Upload address must be filled',
			t0070: 'File type not recognized， please use one of these formats： jpg、png、jpeg',
			t0071: 'Sorry! This product is not currently up for sale.',
			t0072: 'Publish failed',
			t0073: 'Published',
			t0074: 'Saved to draft',
			t0075: 'Uploaded',
			t0076: 'Upload failed',
			t0077: 'Add Video',
			t0078: 'Paste URL here, the content will be automatically retrieved from source web page.',
			t0079: 'Incorrect video link',
			t0080: 'Paste URL',
			t0081: 'Paste Link',
			t0082: 'Wrong web address, please correct',
			t0083: 'Input keywords to search artworks',
			t0084: 'Account info must be filled',
			t0085: 'Account',
			t0086: 'Submitted',
			t0087: 'Amount must be filled',
			t0088: 'Invalid number， please correct',
			t0089: 'Minimum withdraw amount is 50',
			t0090: 'Minimum withdraw amount is XXX',
			t0091: 'Please input valid account',
			t0092: 'Sticked to top',
			t0093: 'Failed to stick',
			t0094: 'Product added to the event',
			t0095: 'Already participated the event',
			t0096: 'Event closed',
			t0097: 'Ohh, failed to add products',
			t0098: 'Empty selection',
			t0099: 'Paste video url, urls from youtube, tudou, youku are all accepted',
			t0100: 'Paste video url',
			t0101: 'Invalid video address, only video address from youtube, youku, and tudou are accepted for the moment',
			t0102: 'Authentication failure, back to home page now',
			t0103: 'Authentication failure, only event organizer is allowed to edit events, back to home page now',
			t0104: 'Uploaded',
			t0105: 'Upload speed',
			t0106: 'Processing',
			t0107: 'Created',
			t0108: 'failed to create',
			t0109: 'Paid',
			t0110: 'Payment failed',
			t0111: 'Events Launched by me',
			t0112: 'Events Joined by me',
			t0113: 'Starting date',
			t0114: 'Ending date',
			t0115: 'Maximum Items',
			t0116: 'Video less than 100mb, format mp4',
			t0117: 'Graphic works',
			t0118: 'Such as: oil painting, illustration, photography, design',
			t0119: 'Creative Goods',
			t0120: 'Such as: handicrafts, sculpture and other three-dimensional goods',
			t0121: 'Do you want to sell the original artwork?',
			t0122: 'Yes',
			t0123: 'No',
			t0124: 'Please upload high quality pictures',
			t0125: 'The maximum picture size is 100MB',
			t0126: 'Payment error please try again',
			t0127: 'Please try again from the shopping cart',
			t0128: 'Back to shopping cart',
			t0129: 'Payment Successful',
			t0130: 'you will be redirected to order page...',
			t0131: 'Order page',
			t0132: 'Continue shopping',
			t0133: 'English',
			t0134: 'united kingdom',
			t0135: 'Italy',
			t0136: 'France',
			t0137: 'Germany',
			t0138: 'Afghanistan',
			t0139: 'Chian',
			t0140: 'LangSwitcher',
			t0141: 'Upload failed Please upload again',
			t0142: 'Please add at least 3 tags, and press Enter button to confirm',
			t0143: 'Report success',
			t0144: 'Not support GIF'
		}
	}
};
var LANGUAGE_NOW = LANGUAGE_CONFIG[ArtJS.server.language];
if (ArtJS.server.language == 'CN') {
	document.title = '创e商城';
} else {
	document.title = 'CREATIVE MALL';
}


//if (location.href == rootPath) location.href = '/index.html'
var imgUrl = ArtJS.server.image;
var sLei ="";
$(function () {
	$('body').addClass('body-'+ArtJS.server.language);
	$('.logo>a').attr({className: 'iconfont icon-logoH_'+ArtJS.server.language});
	HEADER_BOX.init();
	$('#search,label.ztag').attr({placeholder: LANGUAGE_NOW.search.placeholder});
	if ($(".nav_btn").length) {
		$(".nav_btn").live("click",function (e) {
			$(".navmore").addClass('show');
			$("body").addClass('bd-left');
			$(".page-mark").addClass('show').bind("click", function () {
				$(".navmore,.page-mark").removeClass('show');
				$("body").removeClass('bd-left');
				$(".navmore,.page-mark").unbind();
			});
		});
	}
	//点击搜索dataSearch
	/*DOTO筛选更多*/
	if ($(".morebtn").length) {
		$(".morebtn").live("click", function () {
			$(this).find("i").toggleClass("flipy");
			if($(this).find("c").html() =="更多筛选") {
				$(this).find("c").html("收起筛选");
			}else{
				$(this).find("c").html("更多筛选");
			}
			$("#fenlei").find("dt:gt(0),dd:gt(0)").toggle("fast");
		});
	}
});
function gotoTop(min_height,id){
	//预定义返回顶部的html代码，它的css样式默认为不显示
	var gotoTop_html = '<div id="gotoTop">返回顶部</div>';
	$("#"+id).click(//定义返回顶部点击向上滚动的动画
		function(){$('html,body').animate({scrollTop:0},700);
		}).hover(//为返回顶部增加鼠标进入的反馈效果，用添加删除css类实现
		function(){$(this).addClass("hover");},
		function(){$(this).removeClass("hover");
		});
	//获取页面的最小高度，无传入值则默认为600像素  min_height
	//为窗口的scroll事件绑定处理函数
	$(window).scroll(function(){
		//获取窗口的滚动条的垂直位置
		var s = $(window).scrollTop();
		//当窗口的滚动条的垂直位置大于页面的最小高度时，让返回顶部元素渐现，否则渐隐
		if( s > min_height){
			$("#"+id).fadeIn(100);
		}else{
			$("#"+id).fadeOut(200);
		};
	});
}

ArtJS.load(['header'], function () {
	ArtJS.page.header.setCookie();
});
// google|百度统计 true: 执行 false: 取消
//ArtJS.track.init({google: true, baidu: true});

// header 添加大类列表
var HEADER_BOX = {
	init: function () {
		var me = this;
		me.$header = $('.headerbox');
		if (me.$header.length) {
			if (me._isActive == null || me._isActive == false) {
				me._isActive = true;
				me.$nav = $('.navbox');
				me.$typeBox = $('#fenlei');
				me._works = $("#container").attr("data-works");
				me._name = [LANGUAGE_NOW.type.works, LANGUAGE_NOW.type.special];
				me._array = [0, 1, 2];
				me._isSearch = location.href.indexOf('/search/') > -1;

				me.addFont();
				me.addList.init();
				me.addNullBox();
				me.bindEvent();
				me.search.init();
				me.loginAndmune();
				me.cateGory();
				me.uLang.ulWrite();
			}
		}
	},
	bindEvent: function () {
		var me = this;
		$(window).bind('scroll', function () {
			me.scrollTop();
		});
	},
	/*登录||侧边栏*/
	loginAndmune:function (){
		//navmore 右侧导航
		$(".navbox").before(navmore());
		sLei =$("#fenlei").attr("data-lei");
		$("body").after('<a href="javascript:scroll(0,0)" target="_self" id="gotoTop" class="gotop"></a>');
		gotoTop(600,"gotoTop");
	},
	topicFn: function (obj) {
		var obj = $(obj);
		ArtJS.login.pop(function () {
			obj.attr({
				href: '/subject-editor2.html',
				target: '_blank'
			});
		});
	},
	/*分类*/
	cateGory:function(){
		if ($("#fenlei").length){
			queryForm();
			sNav();
		}
		function sNav() {
			var user = {
				uname: $("#uname").val(),
				mobileIpt: $("#mobileIpt").val(),
				birthday: $("#birthday").val()
			};
			var _indexTag="";
			$(".box-menu li").each(function(){
				if($(this).attr("class") =="current") _indexTag = $(this).find("a").attr("indexTag");
			});
			var Url = "/topicSocSite/topic/getTypeBasesByPage";
			var data = {
				indexTag: _indexTag,
				abbr: Alange,
				page: "index",
				source: "web"
			};
			$.ajax({
				url: Url,
				data: data,
				type: 'get',
				dataType: 'json',
				success: function (data) {
					var data = data;
					if (data.code == '200') {
						//if (worksVal == '2') $('#fenlei').append('<a class="btn-fb-special" onclick="HEADER_BOX.topicFn(this);"><i>+</i>'+LANGUAGE_NOW.nav.subject+'</a>');
						BANNER.init();
							$(data.result).each(function (index, v) {
								var str = ArtList.NavSpecial(v);
								$('#fenlei').append(str);
							});
						$(data.result).each(function (index, v) {
							var text = ArtList.NavFL(index, v, sLei);
							$('#fenlei').append(text);
						});
						typeBases._init = '<dl id="fenleiSpecial" class="fenlei-special">'+$('#fenleiSpecial').html()+'</dl>';
						
						/*礼品分类*/
						$("#box-menu-header li").each(function(){
							if($(this).hasClass("current")) {
								if ($(this).find("a").html() == LANGUAGE_NOW.type.works) {
									setTimeout(function(){
										$(".mune-L span").eq(0).click();
									},1000)
								}
							}
						});
					} else {
						console.log('添加失败')
					}
				}
			});
		}
	},
	// 添加
	addList: {
		dom: [
			'<ul class="box-menu" id="box-menu-header">',
				'<li><a indexTag="2" href="'+rootPath+'index.html">'+LANGUAGE_NOW.type.works+'</a></li>',
				//'<li><a indexTag="1" href="'+rootPath+'special.html">'+LANGUAGE_NOW.type.special+'</a></li>',
			    //'<li><a indexTag="8" href="'+rootPath+'artsdiy/">'+LANGUAGE_NOW.type.diy+'</a></li>',
			'</ul>'
		].join(''),
		init: function () {
			if ($('#box-menu').length && !HEADER_BOX._isSearch) $('#box-menu').remove();
			HEADER_BOX.$header.append(this.dom);
			HEADER_BOX.$li = $('#box-menu-header li');
			$('.box-menu').show();
			this.judge();
		},
		judge: function () {
			var works = parseInt(HEADER_BOX._works);
			if (works > -1) {
				var sx = HEADER_BOX._array[works];
				sx = sx > 1? 1: sx;
				if (!HEADER_BOX._isSearch) {
					HEADER_BOX.$li.eq(sx).addClass('current');
					document.title = HEADER_BOX._name[sx];
				}
			}
		}
	},
	addFont: function () {
		$('head').eq(0).append('<link rel="stylesheet" href="/drift/font/iconfont.css" type="text/css">');
	},
	addNullBox: function () {
		var me = this;
		me.$header.after('<div class="headerNull"></div>');
	},
	scrollTop: function () {
		var me = this;
		var st = $(window).scrollTop();
		if (st > 0) {
			me.$header.addClass('header-fixed');
			me.$nav.addClass('nav-fixed');
			$("#otherPeople").addClass("shadow");
		} else {
			me.$header.removeClass('header-fixed');
			me.$nav.removeClass('nav-fixed');
			$("#otherPeople").removeClass("shadow");
		}
	},
	search: {
		init: function () {
			var _this = this;

			_this.$search = $('#search');
			_this.$keybox = $('#searchs');
			_this.$submit = $('#dataSearch');
			_this.$cloce  = $('#cloceSearch');
			_this._Type   = $('input[name=Type]').val() || '4';
			_this._sType  = $('input[name=sType]').val() || 'topic';
			_this._key    = decodeURIComponent(location.href.getQueryValue('searchContext'));

			_this.bindEvent();
			_this.load();
		},
		bindEvent: function () {
			var _this = this;

			_this.$search.bind('keydown', function (e) {
				if (e.keyCode == 13) _this.searchFn(_this.$search.val() || '');
			});

			_this.$submit.bind('click', function (e) {
				_this.searchFn(_this.$search.val() || '');
			});

			if (HEADER_BOX._isSearch) {
				_this.$search.bind('focus', function (e) {
					_this.focus(_this);
				});

				_this.$search.bind('blur', function (e) {
					_this.blur(_this);
				});
			}
		},
		// 关键字搜索
		searchFn: function (_Val) {
			var _this = this;
			if ($.trim(_Val)) {
				_Val = _Val.replace(/(^\s*)|(\s*$)/g, '').replace(/\s{2,}/g, ' ');
				_Val = _Val.split(' ').unique();
				_Val = _Val.join(' ');
				var u = [
					rootPath+'search/?searchType=02',
					'&Type=' + _this._Type,
					'&sType=' + _this._sType,
					'&searchContext=' + _Val
					].join('');
				location.href = u;
			} else {
				alert("请输入关键字！");
			}
			return false;
		},
		// 搜索初始化
		load: function () {
			var _this = this;

			if (HEADER_BOX._isSearch) {
				_this.$cloce.find('span').remove();
				if (_this._key) {
					var k = _this._key.split(' ');
					var l = k.length;
					var a = [];
					for (var i = 0; i < l; i++) {
						var color = ~~(Math.random()*360);
						a.push('<span style="color: hsl('+color+', 100%, 30%);background-color: hsl('+color+', 100%, 85%);">' + k[i] + '<a class="iconfont icon-close-b" style="color: hsl('+color+', 100%, 30%);"></a></span>');
					}
					_this.$cloce.append(a.join(''));
					_this.remove(_this.$cloce.find('a'), k);
					_this.$search.val(_this._key).addClass('hide');
				}

				$('.container').addClass('search-container');
			}
		},
		// 删除关键字
		remove: function (obj, array) {
			var _this = this;
			obj.bind('click', function () {
				if (array.length > 1) {
					var k = $(this).parent().text();
					array.remove(k);
					_this.searchFn(array.join(' '));
					$(this).parent().remove();
				} else {
					location.href = rootPath;
				}
			});
		},
		isSpace: function () {
			return this.$search.val() == '';
		},
		isChange: function () {
			return this.$search.val() == this._key;
		},
		// 获得焦点
		focus: function (o) {
			o.$keybox.addClass('hide');
			o.$search.removeClass('hide');
			if (o.isSpace()) o.$search.val(o._key);
		},
		// 失去焦点
		blur: function (o) {
			if (o.isChange()) {
				o.$keybox.removeClass('hide');
				o.$search.addClass('hide');
			}
		}
	},
	//语言切换
	uLanDom: {
		dom:[
			'<div class="interest-box"></div>',
			'<div class="lang">',
			'<a id="art_colse" href="javascript:;" class="art_colse fx_bg"></a>',
			'<div class="w-400">',
			'<font>'+LANGUAGE_NOW.new001.t0068+'</font>',
			'</div>',
			'<div class="l-list">',
			'<a href="javascript:;" data-lan="CN" class="CN">',
			''+LANGUAGE_NOW.new001.t0139+'',
			'<i class="iconfont icon-check"></i>',
			'</a>',
			'<a href="javascript:;" data-lan="US" class="US">',
			''+LANGUAGE_NOW.new001.t0133+'',
			'<i class="iconfont icon-check"></i>',
			'</a>',
			/*'<a href="javascript:;"data-lan="'+LANGUAGE_NOW.new001.t0134+'">',
			''+LANGUAGE_NOW.new001.t0134+'',
			'<i class="iconfont icon-check"></i>',
			'</a>',
			'<a href="javascript:;" data-lan="'+LANGUAGE_NOW.new001.t0135+'">',
			''+LANGUAGE_NOW.new001.t0135+'',
			'<i class="iconfont icon-check"></i>',
			'</a>',
			'<a href="javascript:;" data-lan="'+LANGUAGE_NOW.new001.t0136+'">',
			''+LANGUAGE_NOW.new001.t0136+'',
			'<i class="iconfont icon-check"></i>',
			'</a>',
			'<a href="javascript:;" data-lan="'+LANGUAGE_NOW.new001.t0137+'">',
			''+LANGUAGE_NOW.new001.t0137+'',
			'<i class="iconfont icon-check"></i>',
			'</a>',
			'<a href="javascript:;" data-lan="'+LANGUAGE_NOW.new001.t0138+'">',
			''+LANGUAGE_NOW.new001.t0138+'',
			'<i class="iconfont icon-check"></i>',
			'</a>',*/
			'</div>',
			'<div class="w-but">',
			'<span>'+LANGUAGE_NOW.title.enter+'</span>',
			'</div>',
			'</div>',
		].join('')
	},
	uLang: {
		ulWrite:function(){
			var $lan =$('.nav-lang');
			var $lang =$('.lang');
			$lan.live("click",function(){
				$('.navmore').removeClass('show');
				$('body').after(HEADER_BOX.uLanDom.dom);
				$('body').css({"overflow":"hidden"});
				HEADER_BOX.uLang.ulBindEvent();
			});
		},
		ulBindEvent: function(){
			var $la =$('.l-list');
			var $cls =$('#art_colse');
			var $bntS =$('.w-but');
			$la.find('a').live("click",function(){
				var that =$(this);
				that.addClass('active').siblings().removeClass('active');
				$('.w-but').attr('id','sut');
			});
			$cls.live("click",function(){
				var that =$(this);
				that.parent().remove();
				$('.interest-box').remove();
				$('.page-mark').removeClass('show');
				$('body').removeAttr("style");
			});
			$('#sut span').live("click",function(){
				var laVal ="";
				var sLen =$('.l-list a.active').length;
				if(sLen <=0){
					return;
				}
				$('.l-list a.active').map(function() {
					laVal = $(this).attr('data-lan');
					ArtJS.cookie.set('regional', laVal, { day:365, domain:'CREATIVE MALL.com' });//注入语言
					window.location.reload();
				});
			});
		}
	}
}
var BANNER = {
	init: function () {
		var me = this;
		me.$wrapper = $('.wrapper');
		var box_choice=me.$wrapper.find("#fenlei").parents(".box_choice"),
			box_choice_find=box_choice.find(".box_choice_find");
		box_choice.after(me.dom[ArtJS.server.language]);

		me.$main = $('#topicBanner');
		me.$img = $('#topicBanner>a');
		me._len = me.$img.length;
		me._now = 0;
		me.imgActive(me._now);
		me.imgPlay();
		
		//此步不需要
		// var _inter = ArtJS.cookie.get("inter");
		// if(!_inter)
		me.interNologin();

		//滚动事件，后期庄维护下
		$(window).scroll(function(){
			var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        	var fxdTop=box_choice.offset().top;
            if (isAndroid || isiOS) {
				fxdTop=100;
            }
            if($(window).scrollTop()+$(".headerbox").outerHeight()>=fxdTop){
				box_choice_find.addClass("fixed");
			}else{
				box_choice_find.removeClass("fixed");
			}
		});
	},
	dom: {
		'CN': [
			'<div id="topicBanner" class="topic-banner">',
				'<a><img src="/drift/images/banner1.jpg"></a>',
				'<a><img src="/drift/images/banner2.jpg"></a>',
			'</div>'
		].join(''),
		'US': [
			'<div id="topicBanner" class="topic-banner">',
				'<a><img src="/drift/images/banner1US.jpg"></a>',
				'<a><img src="/drift/images/banner2US.jpg"></a>',
			'</div>'
		].join('')
	},
	imgPlay: function () {
		var me = this;
		setInterval(function () {
			me.imgActive(me._now);
		}, 5000);
	},
	imgActive: function (num) {
		var me = this;
		me.$img.removeClass('active');
		me.$img.eq(num).addClass('active');
		me._now = ++num;
		me._now = me._now > me._len-1? 0: me._now;
	},
	interNologin:function(){
		$.getJSON("/memberSite/members/getInterset",function(data){
			var iTrue = data.result;
			var inter =ArtJS.cookie.get("inter");
			if(ArtJS.login.checkUserStatus()){
				if(!iTrue){
					BANNER.interestList.interAjax();
					$('body').css({"overflow":"hidden"});
				}
			}
		});
	},
	interestList: {//兴趣
		interAjax: function(){
			var _url ="topicSocSite/topic/getTypeBasesByPage";
			var data={
				source: "web",
				page:"index",
				abbr:ArtJS.server.language,
				indexTag:2
			}
			$.ajax({
				async: false,
				url: _url,
				type: "get",
				dataType: 'json',
				data:data,
				success: function (response) {
					if(response.code && response.code==200){
						$(response.result).each(function (index, v) {
							var _id = v.id;
							var text = ArtList.interestClassify(index, v);

							var $bd = $('body');
							$bd.after(text);
							BANNER.interestList.interBinEvt();
						});
					}
				}
			});
		},
		interBinEvt: function(){
			//兴趣选择
			var $interUl =$("#interest ul");
			$interUl.find(".list-box").die().live("click", function () {
				var that = $(this);
				var $wt = $('.w-but');
				that.toggleClass("actvie");
				var len = $interUl.find("div.actvie").length;
				if (len >= 1) {
					$wt.addClass('act');
					$wt.find('font').remove();
				} else if (len < 1) {
					$wt.removeClass('act');
				}
			});
			$("#interest #Shaer_colse").live("click", function () {
				$("#interest,.interest-box").remove();
				$('body').css({"overflow": "auto"});
			});
		}
	}
}
var user_key=ArtJS.cookie.get("toKen");
//navmore 右侧nav
function navmore(){
	var str ="<div class='page-mark'></div><div class='navmore'><ul class='morebox'></ul></div>"
	//more-->
	return '<div class="navmore-box">' + str + '</div>';
}
//兴趣选择
function interestFun(obj){
	var that = $(obj);
	var _typeIds = typeIds();
	_typeIds = _typeIds.toString();
   	if(_typeIds.length ==0){
	   	that.before('<font>至少选择一种兴趣</font>');
	  	return;
   	}
	var data={
		typeIds:_typeIds,//分类id
		userId:ArtList.getCookie("User_id")//用户id
	}
	$.ajax({
	 	type: "POST",
	 	url:"/topicSocSite/topic/addTypeUserInterest",
	 	data:data,
	 	dataType: "json",
	 	success: function (data) {
		 	if(data.code ==200){
			 	ArtJS.cookie.set("inter","ture");
			 	$("#interest,.interest-box").remove();
			 	$('body').css({"overflow":"auto"});
		  	}
	 	}
   	});
}
function typeIds(){
	var typeId=$("#interest .list-box.actvie").map(function() {
		return $(this).find(">span").attr("classifyid");
	}).get().join(',');
	return typeId;
}
var htp=ArtJS.server.image;
 function queryForm() {
	 //屏蔽回车键提交表单
	 var queryForm = document.getElementById("queryForm");
	 queryForm.onsubmit = function () {
		 return false;
	 }
 }