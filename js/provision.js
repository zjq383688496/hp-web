/**
 *   用户条款相关处理
 *   modify  2016-01-12   author eric
**/
var proveModule = angular.module('proveApp',['modHeaderFull']);
$(document).ready(function () {
    var _lang = ArtJS.server.language;
    var provLang = {
        CN: {
            dom: [
                '<div class="w-out" style="width:1000px; margin:auto;overflow:hidden;" id="proto" data-proto="5">',
                '<div class="tan-cn"> </div>',
                '<div class="out_w cn">',
                '<div id="tAndc01">',
                '<h2 class="cn">创意灯CREATIVE MALL使用协议</h2>',
                '<p>本网站和创意灯CREATIVE MALL应用App的用户将遵循本公司如下文所列的法律协议细则。在本协定中：“我们”和“我们的”指创意灯CREATIVE MALL和其运营控股公司；“您”、“你的”和“用户”指所有访问者；“买家”、“消费者”指在创意灯CREATIVE MALL平台上购买商品和相关服务项目并进行支付的用户；“卖家”、“艺术家”和“账户拥有者”指在创意灯CREATIVE MALL获得认证和许可并有意愿通过其对应的用户账号销售其艺术作品的用户；“作品”和“内容”指由卖家上传的并获准在创意灯CREATIVE MALL平台上进行销售的任何形式之艺术创意及相关商品。</p>',
                '</div>',
                '<div id="tAndc02">',
                '<h2>(一)协议通则</h2>',
                '<p>',
                '本协议是您与CREATIVE MALL网站（简称"本站"，网址：www.cmall.com ）所有者（以下简称为"创意灯CREATIVE MALL"）之间就创意灯CREATIVE MALL网站服务等相关事宜所订立的契约，请您仔细阅读本注册协议，您点击"同意并继续"按钮后，本协议即构成对双方有约束力的法律文件。<br>',
                '1.本站服务条款的确认和接纳<br>',
                '1.1本站的各项电子服务的所有权和运作权归创意灯CREATIVE MALL所有。用户同意所有注册协议条款并完成注册程序，才能成为本站的正式用户。用户确认：本协议条款是处理双方权利义务的契约，始终有效，法律另有强制性规定或双方另有特别约定的，依其规定。<br>',
                '1.2用户点击同意本协议的，即视为用户确认自己具有享受本站服务、下单购物等相应的权利能力和行为能力，能够独立承担法律责任。<br>',
                '1.3如果您在18周岁以下，您只能在父母或监护人的监护参与下才能使用本站。<br>',
                '1.4创意灯CREATIVE MALL保留在中华人民共和国大陆地区法施行之法律允许的范围内独自决定拒绝服务、关闭用户账户、清除或编辑内容或取消订单的权利。<br>',
                '.本站服务<br>',
                '2.1创意灯CREATIVE MALL通过互联网依法为用户提供互联网信息等服务，用户在完全同意本协议及本站规定的情况下，方有权使用本站的相关服务。<br>',
                '2.2用户必须自行准备如下设备和承担如下开支：<br>',
                '1）上网设备，包括并不限于电脑或者其他上网终端、调制解调器及其他必备的上网装置；<br>',
                '（2）上网开支，包括并不限于网络接入费、上网设备租用费、手机流量费等。<br>',
                '3.用户信息<br>',
                '3.1用户应自行诚信向本站提供注册资料，用户同意其提供的注册资料真实、准确、完整、合法有效，用户注册资料如有变动的，应及时更新其注册资料。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且创意灯CREATIVE MALL保留终止用户使用创意灯CREATIVE MALL各项服务的权利。<br>',
                '3.2用户在本站进行浏览、下单购物等活动时，涉及用户真实姓名/名称、通信地址、联系电话、电子邮箱等隐私信息的，本站将予以严格保密，除非得到用户的授权或法律另有规定，本站不会向外界披露用户隐私信息。<br>',
                '3.3用户注册成功后，将产生用户名和密码等账户信息，您可以根据本站规定改变您的密码。用户应谨慎合理的保存、使用其用户名和密码。用户若发现任何非法使用用户账号或存在安全漏洞的情况，请立即通知本站并向公安机关报案。<br>',
                '3.4用户同意，创意灯CREATIVE MALL拥有通过邮件、短信电话等形式，向在本站注册、购物用户、收货人发送订单信息、促销活动等告知信息的权利。<br>',
                '3.5用户不得将在本站注册获得的账户借给他人使用，否则用户应承担由此产生的全部责任，并与实际使用人承担连带责任。<br>',
                '3.6用户同意，创意灯CREATIVE MALL有权使用用户的注册信息、用户名、密码等信息，登录进入用户的注册账户，进行证据保全，包括但不限于公证、见证等。<br>',
                '4.用户依法言行义务<br>',
                '本协议依据国家相关法律法规规章制定，用户同意严格遵守以下义务：<br>',
                '4.1不得传输或发表：煽动抗拒、破坏宪法和法律、行政法规实施的言论，煽动颠覆国家政权，推翻社会主义制度的言论，煽动分裂国家、破坏国家统一的的言论，煽动民族仇恨、民族歧视、破坏民族团结的言论；<br>',
                '4.2从中国大陆向境外传输资料信息时必须符合中国有关法规；<br>',
                '4.3不得利用本站从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；<br>',
                '4.4不得干扰本站的正常运转，不得侵入本站及国家计算机信息系统；<br>',
                '4.5不得传输或发表任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽的、不文明的等信息资料；<br>',
                '4.6不得传输或发表损害国家社会公共利益和涉及国家安全的信息资料或言论；<br>',
                '4.7不得教唆他人从事本条所禁止的行为；<br>',
                '4.8不得利用在本站注册的账户进行牟利性经营活动；<br>',
                '4.9不得发布任何侵犯他人著作权、商标权等知识产权或合法权利的内容；用户应不时关注并遵守本站不时公布或修改的各类合法规则规定。本站保有删除站内各类不符合法律政策或不真实的信息内容而无须通知用户的权利。若用户未遵守以上规定的，本站有权作出独立判断并采取暂停或关闭用户帐号等措施。用户须对自己在网上的言论和行为承担法律责任。<br>',
                '</p>',
                '</div>',
                '<div id="tAndc03">',
                '<h2>（二）开店</h2>',
                '<p>',
                '1.该条款适用于所有经创意灯CREATIVE MALL认证并同意在创意灯CREATIVE MALL平台上销售艺术创意作品的卖家。<br>',
                '2.创意灯CREATIVE MALL是全球最大的艺术创意社区，致力于帮助艺术创意者们推广及销售其艺术作品。艺术创意者可以通过平台提供的艺术衍生品的销售获得分成收益，亦可通过原作销售获得直接收益。（具体详见“平台入驻协议”）<br>',
                '3.平台分为普通店和专卖店两种形式，任何人都可以免费申请开设普通店进行作品上传和销售。通过认证流程的艺术创意者可升级为专卖店，专卖店店主可获得平台提供的增值服务（升级费用及增值服务详情以申请过程中实际说明为准），专卖店主可选择以店内收益抵扣认证费，或一次性支付。<br>',
                '4.任何因银行账号信息错误产生的费用将由账号持有者承担，创意灯CREATIVE MALL将不承担任何责任。<br>',
                '5.创意灯CREATIVE MALL将会为卖家提供安全的平台环境协助其进行作品发布、销售、评论以及和其他会员进行交流的行为。创意灯CREATIVE MALL也会引入优选的第三方合作伙伴协助完成支付、物流、配送方面的服务。<br>',
                '6.创意灯CREATIVE MALL保障账户拥有者上传的作品在平台上获得安全的维护和保存。<br>',
                '7.用户完成注册认证即可获准开店，在注册流程中需设置账号的用户名和密码并严格保管密码以防泄露他人。<br>',
                '8.艺术经纪人可同时管理多个艺术家专卖店，申请前请与客服联系并获得详细入驻指南。<br>',
                '9.该艺术家在设置账号时需：  <br>',
                '9.1在其账号和用户名下设置自己的产品线及每件商品的零售价。<br>',
                '9.2为所有销售的作品匹配选择精准的标签、描述、标题、名称和评论。 <br>',
                '10.您在平台自有账户下发布的任何信息将通过我们的平台被呈现、链接、发布在其他平台或第三方的网站及社交媒体上。<br>',
                '基于对此的重视，我们特别制订了隐私保护政策并在下文处做具体说明。<br>',
                '11.卖家需对上传供销售的内容拥有合法版权，对于您上传到创意灯CREATIVE MALL平台的，您将赋予我们以下权利：<br>',
                '11.1可以将您的作品不受限制地呈现在我们的产品和材料上，并进行销售。<br>',
                '11.2可以将您的作品以安全和保险的方式进行归档。<br>',
                '11.3可以以艺术家和作品的名义在所有渠道宣传推荐我们的网站、公司或产品。<br>',
                '11.4可以决定哪些商品不适合在平台销售并予以下架。<br>',
                '11.5可以将您的作品使用在我们平台的全品类下进行商品开发。<br>',
                '12.创意灯CREATIVE MALL通过我们独特的图像识别技术为开设专卖店的艺术家提供“图像版权认证”的增值服务（增值服务详情以申请过程中实际说明为准）。通过使用该增值服务，任何人用智能手机扫描其作品便可以导入到作品版权拥有者在创意灯CREATIVE MALL上开设的商店。其他和原创作品有65%以上相似度的作品如经扫描也将会被导入到上述网址，采用此方式，一定程度使原创艺术的创意免受被复制、侵权的伤害。<br>',
                '13.当您提交或上传作品或内容到创意灯CREATIVE MALL平台，您将承诺对以下内容进行保证：<br>',
                '13.1您是内容版权的拥有者，可以合法合理地展示，再次开发或销售该内容。<br>',
                '13.2您上传的作品版权在其他与创意灯CREATIVE MALL同类竞争的艺术在线销售平台上不可再授权使用。您仍然可以自由在线下、自己的网站主页和其他非创意灯CREATIVE MALL竞争平台上销售相关衍生商品。<br>',
                '13.3如果您不是版权的拥有者，请确保您上传的作品获得了版权拥有者的授权许可。<br>',
                '13.4您上传的内容不能以任何形式侵犯任何国际性的精神权利、专利、商标或公开权、以及任何个人、公司或实体的知识产权。<br>',
                '13.5内容不能对任何个人、公司或实体构成辱骂、恶意、威胁、攻击或危害的意图和行为。<br>',
                '13.6上传内容的文件不能包含任何会破坏个人或公司操作系统和程序的有害编码、病毒或数字加密。<br>',
                '14.对所有违反上述任何一种情况的内容，创意灯CREATIVE MALL有权于任何时间在不必获得账户拥有人许可的情况下移除此内容。<br>',
                '对情节严重者，创意灯CREATIVE MALL有权立即采取包括但不限于以下行动：冻结其账户、暂停支付分成收入、下架侵权产品并要求赔偿损失。<br>',
                '15.账户拥有者和卖家对上传的作品所产生的销售收入需承担法律和纳税的责任，创意灯CREATIVE MALL将不会对卖家在平台上销售所获得的收入承担相关的纳税责任和法律责任。<br>',
                '16.对于卖家上传的作品可能涉及到任何违反国际或当地的知识产权，版权或公开领域法律条例的行为，创意灯CREATIVE MALL将不承担任何法律责任。<br>',
                '17.作为卖家，您可以选择将衍生品销售获得的分成收益捐赠到创意灯CREATIVE MALL平台下设或合作的公益机构以尽己所之力，进而让艺术之美升华为对社会的温暖之爱。<br>',
                '</p>',
                '</div>',
                '<div id="tAndc04">',
                '<h2>（三）购买</h2>',
                '<p>',
                '1.用户可使用有效信用卡、支付宝、微信支付或PayPal等方式支付购买创意灯CREATIVE MALL网站及其App应用上的商品。<br>',
                '2.在网站上价格会做清晰列明，一旦下单并在支付过程中，价格便会进行锁定。<br>',
                '3.支付一旦完成则订单无法取消。<br>',
                '4.消费者应确保产品配送地址的正确性，任何因配送地址填写错误而导致产品未能送达的情况创意灯CREATIVE MALL将不承担任何责任。',
                '</p>',
                '</div>',
                '<div id="tAndc05">',
                '<h2>（四）配送&物流</h2>',
                '<p>',
                '1.买家需支付其应承担的运费。<br>',
                '2.当一次性购买产品超过99元人民币时买方则无需承担任何运费，在此情况下，运费将由卖家和产品制造商共同承担。<br>',
                '3.如卖家在平台出售艺术原作、艺术品和自有艺术商品（非创意灯自营商品），则由此产生的物流配送费用由卖家与买家协商承担。',
                '</p>',
                '</div>',
                '<div id="tAndc06">',
                '<h2>（五）售后</h2>',
                '<p>',
                '1.创意灯CREATIVE MALL平台的自营商品根据国家三包规定实行售后服务，如有退换货需求请联系我们的客服进行申请：4007288280。<br>',
                '2.产品自售出之日起7日内，发生性能故障，消费者可以选择退货、换货或修理。<br>',
                '3.产品自售出之日起15日内，发生性能故障，消费者可以选择换货或修理。<br>',
                '4.如购买入驻商家的自营商品，入驻店家将提供遵循国家标准的消费者售后服务，用户可直接联系卖家获得相关支持。',
                '</p>',
                '</div>',
                '<div id="tAndc07">',
                '<h2>（六）发表&分享</h2>',
                '<p>',
                '1.所有人都可以在平台的“灯丝圈”发表文章，分享自己对于平台现有作品的评论、感想、反馈等，并鼓励再创作形成新的传播内容。<br>',
                '2.我们鼓励创意灯CREATIVE MALL的所有用户在社交平台分享您自己或您喜欢的艺术作品、衍生商品和灯丝圈文章。不仅分享者本身，被分享并入驻创意灯CREATIVE MALL平台的新朋友都有可能获得一份惊喜。',
                '</p>',
                '</div>',
                '<div id="tAndc08">',
                '<h2>（七）对自己行为负责</h2>',
                '<p>',
                '1．你充分了解并同意，你必须为自己注册帐号下的一切行为负责，包括你所发表的任何内容以及由此产生的任何后果。你应对本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。创意灯CREATIVE MALL无法且不会对因前述风险而导致的任何损失或损害承担责任。<br>',
                '2.平台与用户双方需遵循对应服务所在地的法律法规。如因用户违反法规行为所产生的法律纠纷，与创意灯CREATIVE MALL无关。',
                '</p>',
                '</div>',
                '<div id="tAndc09">',
                '<h2>（八）隐私政策</h2>',
                '<p>',
                '创意灯CREATIVE MALL尊重其成员的隐私并承诺不会出于任何目的将其个人信息提供或销售给任何第三方。您使用本网站即表示您同意我们基于此隐私政策收集、储存并使用您的非个人信息。<br>',
                '1.个人信息<br>',
                '用户需输入其邮箱和网站登录密码方能使用本网站。您还可以选择提供更多个人信息如您的全名、年龄和所在地。关于支付和配送，我们同样需要您提供如账单和支付详情、纳税状况及有效配送地址等更多信息。<br>',
                '2.非个人信息<br>',
                '创意灯CREATIVE MALL将通过记录文本和缓存或第三方储存用户的非个人信息，或通过第三方供应商来协助提高对买家和卖家的服务质量。非个人信息包括您所访问过的页面、IP地址、游览器、地理位置和操作系统等。您可以自行删除缓存，但可能会因此对本网站某些板块的流畅运行造成影响。<br>',
                '3.非个人信息的使用<br>',
                '出于生产制造、打印输出或物流配送等原因我们需要与供应商分享某些特定信息。我们会不时通过邮件形式向您发送关于创意灯CREATIVE MALL的重要信息，但您也可以选择拒绝接受此类服务。我们的员工将随时协助您解答在创意灯CREATIVE MALL上所遇到的任何问题。我们的联系方式：4007288280。',
                '</p>',
                '</div>',
                '<div id="tAndc010">',
                '<h2>（九）知识产权和公开宣传权</h2>',
                '<p>',
                '1.创意灯CREATIVE MALL要求所有加入社区的艺术创意者都充分认识国际知识产权和公开宣传权的重要性，并了解其与艺术作品所存在的关联。<br>',
                '2.国际上现有通行的一些法律条款对个人、企业、理念及创意进行保护：<br>',
                '2.1版权法用于保护原创理念的使用和表达，原创理念包括照片或绘画形式的艺术作品和诗歌或故事形式的文学创作等。<br>',
                '2.2商标法用于保护能确认和区分某类商品的文字、符号、设计或标识的相关使用<br>',
                '2.3公开宣传权用于保护个人的姓名和形象。这意味您在无授权的情况下无法使用其他人的身份（无论视觉、书面或是音频形式）来谋取自身商业利益。<br>',
                '3.卖家（用本人持有账号上传艺术作品者）将对所有该用户名下所呈现的内容承担全部责任。<br>',
                '4.在创建创意灯CREATIVE MALL账号并上传艺术作品前您应确保完整阅读、充分了解并接受此协议。<br>',
                '5.当任何用户违反以上协议内容时，创意灯CREATIVE MALL保留立即封存该账号并使之在平台上不被公开显示和搜索到。',
                '</p>',
                '</div>',
                '</div>',
                '<div class="out_right cn">',
                '<div id="out_right">',
                '<a href="#tAndc02" style="padding-top:16px">(一) 协议通则</a>',
                '<a href="#tAndc03">(二）开店</a>',
                '<a href="#tAndc04">(三）购买</a>',
                '<a href="#tAndc05">(五）售后</a>',
                '<a href="#tAndc06">(五）售后</a>',
                '<a href="#tAndc07">(六）发表&分享</a>',
                '<a href="#tAndc08">(七）对自己行为负责</a>',
                '<a href="#tAndc09">(八）隐私政策</a>',
                '<a href="#tAndc010">(九）知识产权和公开宣传权</a>',
                '</div>',
                '</div>',
                '</div>',
                '<div class="copyright">',
                '<a href="http://www.miitbeian.gov.cn/publish/query/indexFirst.action" target="_blank">沪ICP备:11039190 号</a>',
                '</div>'
            ].join('')
        },
        US: {
            dom: [
                '<div class="w-out" style="width:1000px; margin:auto;overflow:hidden;" id="proto" data-proto="5">',
                '<div class="tan-us"> </div>',
                '<div class="out_w">',
                '<div id="tAndc01">',
                '<h2 style="text-align: center">CREATIVE MALL User Agreement</h2>',
                '<p>All users of the website and App CREATIVE MALL upon doing so, enter into a legal agreement with the company that is set out in the terms below. For the purposes of this agreement “we, us and our” refer to CREATIVE MALL and the controlling company. “You, your and user” refers to all visitors. “Buyer or customer” refers to those people paying money for items and products through the CREATIVE MALL platform, “Seller, artist or account holder” refers to those users approved for and agreeing to sell their own art works through a user identity on the CREATIVE MALL platforms and “works or content” refers to any and all creative collateral uploaded by the seller and approved for sale on the CREATIVE MALL platforms.</p>',
                '</div>',
                '<div id="tAndc02">',
                '<h2>General</h2>',
                '<p>',
                '・    If you are not at least 16 years of age, CREATIVE MALL can not and will not enter into any agreement to buy from you or sell to you any works.<br>',
                '・    CREATIVE MALL will provide a safe platform to enable an approved seller to publish, sell, discuss and connect with other members. CREATIVE MALL will also facilitate the inclusion of third party suppliers to complete tasks involving payment, logistics and item delivery.<br>',
                '・    CREATIVE MALL agrees to safely maintain and store the original works as posted by the individual account holder or seller.<br>',
                '・    The works uploaded for sale into an account holder’s account (the approved seller) will be for tax and legal purposes, the sole responsibility of the account holder. CREATIVE MALL accepts no responsibility for the taxation legalities surrounding income generated by any user through sale of any works.<br>',
                '・    CREATIVE MALL accepts no responsibility for any breech of international or local laws or rules surrounding the intellectual property, copyright or publicity of the works uploaded and sold in seller’s account.<br>',
                '・    You must become a member before uploading any content. You must select a username and password and agree to not share that password with any other individuals. The user is solely responsible for this information.<br>',
                '・    Any information you choose to publish in the public section of your profile may be viewed, distributed or linked to from our website to other platforms or third party websites, including social media websites. We have a Privacy Policy which we take very seriously. You may view that here on these pages.<br>',
                '・    The seller will always maintain copyright over the content that is uploaded for sale. By uploading your content to CREATIVE MALL, you agree to give us to:<br>',
                '・    Offer this content for sale, without geographical limit, on our products and materials.<br>',
                '・    Archive this content in a safe and secure manner<br>',
                '・    Promote our website, company or products in all channels, with an artist and artwork credit<br>',
                '・     Decide which content we believe is inappropriate for publication and sale on our website<br>',
                '・    CREATIVE MALL protects copy rights of artworks through our unique ID technology. Customers can scan seller’s artwork with their smart phone and get taken straight to seller’s CREATIVE MALL shop. Any other artworks with more than 80% similarity to your artwork will bring customer directly to your CREATIVE MALL shop. This will prevent other people from copying your artworks and creations. In order to provide this technology the seller cannot sell your content on other websites competing with CREATIVE MALL platform. The artist can still freely sell your artwork offline or through your own website.<br>',
                '・     When you submit or upload work or content onto CREATIVE MALL, you agree and warrant that:<br>',
                '・    You are the copyright holder of that content, that you have any and all rights and permission to display, reproduce or sell that content.<br>',
                '・    If you are not the owner of the copyright, by uploading work you agree that you do have explicit permission to do so by the copyright owner.<br>',
                '・    The content you are uploading does not infringe any international moral rights, patent, trademark, privacy or publicity rights in any way, or infringe upon the IP rights of any person, company or entity.<br>',
                '・    The content is not of an abusive, malicious, threatening, invasive or harmful nature to any person, company or entity. -      The files of uploaded content do not contain any harmful digital codes, viruses or digital encryption that will harm the software of any individual or company’s software operating system or programmes.<br>',
                '・     CREATIVE MALL reserves the right to remove, at any time, any content deemed to contradict any or all conditions as listed above, without consent or explanation to the account holder.',
                '</p>',
                '</div>',
                '<div id="tAndc03">',
                '<h2>PURCHASING</h2>',
                '<p>',
                '・    Users may purchase products on the CREATIVE MALL website and App using a valid credit card or PayPal.<br>',
                '・    The price is clearly marked on the website, and in the payment process and is fixed at the time of ordering.<br>',
                '・    Orders may not be cancelled once the payment has been made.<br>',
                '・    The customer will ensure the product delivery address is correct CREATIVE MALL takes no responsibility for any product a customer does not receive because of errors in the delivery address given to us.',
                '</p>',
                '</div>',
                '<div id="tAndc04">',
                '<h2>DELIVERY AND SHIPPING</h2>',
                '<p>',
                '・    Buyers will pay their own shipping fees.<br>',
                '・    Buyer is entitled to Free express shipping when purchased more than $99 USD of products in one order. The cost of the shipping is shared by the seller and the manufacturer. For small items the seller and the product manufacturer each pay $4. For large items more than 40cm the seller and the manufacturer each pays $10. (in your local currency)',
                '</p>',
                '</div>',
                '<div id="tAndc05">',
                '<h2>PRIVACY POLICY</h2>',
                '<p>',
                'CREATIVE MALL respects the privacy of it’s members and does not supply or sell your personal information to any third party, for any reason.<br>',
                'By using this website you are consenting to our collection, storage and use of non- personal information as specified in this Privacy Policy document.',
                '</p>',
                '</div>',
                '<div id="tAndc06">',
                '<h2>Personal Information</h2>',
                '<p>',
                'The user will provide an email address and password to use our site. You may also choose to provide additional personal information such as your full name, age and location. For payment and delivery information, we may also need you to provide other information such as billing and payment information, tax status, and physical shipping address.',
                '</p>',
                '</div>',
                '<div id="tAndc07">',
                '<h2>Non-Personal Information</h2>',
                '<p>',
                'CREATIVE MALL will collate and store non-personal information through log files and cookies, or via third party vendors to help us improve our service to both buyers and sellers. Examples of non-personal information include pages that you have visited, ip address, browser type, geographical location and operating system. You may disable cookies however sections of our site may not operate perfectly should you do so.',
                '</p>',
                '</div>',
                '<div id="tAndc08">',
                '<h2>Use of non-personal information</h2>',
                '<p>',
                'We will be required to share certain information with vendors for reasons such as manufacturing, printing or logistics. From time to time we may email you useful inform<br>',
                'ation regarding CREATIVE MALL, but naturally you may opt out of this feature. We will be required to share certain information with vendors for reasons such as manufacturing, printing or logistics. From time to time we may email you useful information regarding CREATIVE MALL, but naturally you may opt out of this feature. Our staff are always available to assist you in answering any questions you may have.',
                '</p>',
                '</div>',
                '</div>',
                '<div class="out_right">',
                '<div id="out_right">',
                '<a href="#tAndc02" style="padding-top:16px">GENERAL</a>',
                '<a href="#tAndc03">PURCHASING</a>',
                '<a href="#tAndc04">DELIVERY & SHIPPING</a>',
                '<a href="#tAndc05">PRIVACY POLICY</a>',
                '<p class="m"><a href="#tAndc06">•Personal Information</a>',
                '<a href="#tAndc07">•Non-Personal Information</a>',
                '<a href="#tAndc08">•Use of non-personal infor mation</a>',
                '</p>',
                '</div>',
                '</div>',
                '</div>',
                '<div class="copyright">',
                '<a href="http://www.miitbeian.gov.cn/publish/query/indexFirst.action" target="_blank"></a>',
                '</div>'
            ].join('')
        }
    }
    var ProveFun = {
        init: function () {
            var prove = this;
            prove.CnAndUs();
        },
        CnAndUs: function () {
            var tit=$('title');
            var modder = $('.modder');
            if (_lang == 'CN') {
                tit.html('用户条款');
                var dom = provLang.CN.dom;
                modder.after(dom);
            }
            if (_lang == 'US') {
                tit.html('TERMS AND CONDITIONS');
                var dom = provLang.US.dom;
                modder.after(dom);
            }
        }
    }
    ProveFun.init();
    //绑定
    $("#out_right").smartFloat();
});
;(function(){
    $.fn.smartFloat = function () {
        var position = function (element) {
            var top = element.position().top, pos = element.css("position");
            $(window).scroll(function () {
                var scrolls = $(this).scrollTop();
                if (scrolls > 425) {
                    if (window.XMLHttpRequest) {
                        element.css({
                            position: "fixed",
                            top: "50px",
                            left: "50%",
                            'margin-left': "288px"
                        });
                    } else {
                        element.css({
                            top: scrolls
                        });
                    }
                } else {
                    element.css({
                        position: "static",
                        top: top - 50,
                        left: "0",
                        'margin-left': "0px"
                    });
                }
            });
        };
        return $(this).each(function () {
            position($(this));
        });
    };
})(jQuery);