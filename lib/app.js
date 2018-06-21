let app = (() => {
  App.namespace('defaultPartial.notfound');
  App.namespace('defaultPartial.updating');

	App.namespace('defaultPartial.welcome');
	App.namespace('defaultPartial.register');
	App.namespace('defaultPartial.login');

  App.namespace('defaultPartial.home');
  App.namespace('defaultPartial.hotQuestion');
  App.namespace('defaultPartial.newestQuestion');
  App.namespace('defaultPartial.mineQuestion');

	App.namespace('defaultPartial.mentor');
	App.namespace('defaultPartial.mentorItem');
	App.namespace('defaultPartial.mentorDetail');

	App.namespace('defaultPartial.findpwd');
	App.namespace('defaultPartial.resetpwd');

	App.namespace('defaultPartial.topic');
	App.namespace('defaultPartial.savelove');
	App.namespace('defaultPartial.savemarriage');
	App.namespace('defaultPartial.customlove');
	App.namespace('defaultPartial.separatemistress');

  App.namespace('defaultPartial.template');



  /******************** 缺省对象 ********************/
  let notfound = App.defaultPartial.notfound;  // 404 page
  notfound.partial = 'lib/404/404.html';
  notfound.init = () => {
    // 跳转到 404 页面后要干的事情
    // ... 
  };

  let updating = App.defaultPartial.updating;  // updating page
  updating.partial = 'lib/updating/updating.html';
  updating.init = () => {
    // 跳转到 `页面正在维护` 的页面
    // ...
  };

	
	let welcome = App.defaultPartial.welcome;  // 注册和登陆容器
	welcome.partial = 'lib/welcome/welcome.html';
	welcome.init = () => {
	  console.log('welcome page.');
	};

	let register = App.defaultPartial.register;  // register partial page
	register.partial = 'lib/register/register.html';
	register.init = () => {
		const rootElement = App.settings.rootElement;  // 根元素
		// 昵称输入框元素
		const nicknameEle = rootElement.querySelector('.register-container-nickname input');
		// 邮箱输入框元素
		const emailEle = rootElement.querySelector('.register-container-email input');
		// 邮箱验证码输入框元素
		const emailVerificationEle = rootElement.querySelector('.register-container-verificationCode input');
		// 密码输入框元素
		const pwdEle = rootElement.querySelector('.register-container-pwd input');
		// 确认密码输入框元素
		const repwdEle = rootElement.querySelector('.register-container-repwd input');
		// 手机号输入框元素
		const phoneEle = rootElement.querySelector('.register-container-phone input');
		// 性别
		const sexContainerEle = rootElement.querySelector('.register-container-sex');
		// 发送验证码按钮
		const verificationCodeBtn = rootElement.querySelector('.welcome .register-container-verificationCode-btn');
		// 性别按钮
		const sexBtns = rootElement.querySelectorAll('.welcome .register-container-sex-group');
		// 注册按钮
		const registerBtn = rootElement.querySelector('.welcome .register-container-registerBtn');
		// 登陆按钮
		const loginBtn = rootElement.querySelector('.welcome .register-loginBtn');
		// 验证提示信息元素
		const verificationTextTip = rootElement.querySelector('.register-tips-verification-text');

		/**
		 * 添加注册验证规则
		 * @func validatorFunc
		 * @returns {str} errorMsg - 返回验证错误信息
		*/
		const validatorFunc = () => {
		  const validator = new App.extend.Validator();

			validator.add(nicknameEle, [{  // 昵称验证规则
			  strategy: 'isNonEmpty',  // 不能为空
				errorMsg: '请输入昵称'
			}, {
				strategy: 'minLength: 4',  // 验证昵称长度
				errorMsg: '昵称长度最少需要 4 个字符'
			}]);

			validator.add(emailEle, [{  // 邮箱验证规则
			  strategy: 'isNonEmpty',  // 不能为空
				errorMsg: '请输入邮箱'
			}, {
			  strategy: 'isEmail',  // 验证邮箱格式
				errorMsg: '邮箱格式有误'
			}]);

			validator.add(emailVerificationEle, [{  // 邮箱验证码规则
			  strategy: 'isNonEmpty',  // 邮箱验证码不能为空
				errorMsg: '请输入邮箱验证码'
			}, {
				strategy: 'isLength: 6',  // 验证邮箱验证码长度
				errorMsg: '请输入 6 位数验证码'
			}]);

			validator.add(pwdEle, [{  // 验证密码
			  strategy: 'isNonEmpty',  // 密码不能为空
				errorMsg: '请输入密码'
			}, {
				strategy: 'minLength: 8',  // 验证密码最小长度
				errorMsg: '密码最少为 8 位'
			}, {
				strategy: 'maxLength: 16',  // 验证密码最大长度
				errorMsg: '密码长度不能超过 16 位'
			}]);

			validator.add(repwdEle, [{  // 验证确认密码
			  strategy: 'isNonEmpty',  // 确认密码输入框不能为空
				errorMsg: '请确认密码'
			}]);

			validator.add(phoneEle, [{  // 验证手机号
			  strategy: 'isNonEmpty',  // 手机号不能为空
				errorMsg: '请输入手机号'
			}, {
			  strategy: 'isMobile',  // 验证手机号
				errorMsg: '手机号格式不正确'
			}]);

			// 验证性别

			const errorMsg = validator.start();  // 获取验证后错误信息
			return errorMsg;
		};

		// 获取验证码按钮
		verificationCodeBtn.onclick = (event) => {
			/**
				* @TODO
				* 1. 与服务器通讯
				* 2. 成功后，该按钮不可点击
				*    设置属性 data-clickable
				*      true - 可点击
				*      false - 不可点击
				*
		  */
			const target = event.target;
			const isClickable = target.dataset.clickable;
			const myTimer = new App.extend.Timer(target, {
				count: 3,
				message: '获取验证码'
			});

			// 执行定时器
			myTimer.timerFunc(target, isClickable);
		};

		// 选择性别
		sexBtns.forEach((item, index) => {
			item.onclick = (event) => {
				// 初始化元素状态
				sexBtns.forEach((item) => {
				  item.querySelector('.icon-inner').classList.add('hidden');
					item.dataset.selected = 'false';
				});

				// 设置被点击元素的状态
				item.querySelector('.icon-inner').classList.remove('hidden');
				item.dataset.selected = 'true';
			};
		});

		/**
		 * 注册按钮
		 * @TODO
		 * 1. 与服务器通讯
		 * 2. 成功后显示提示信息
		 * 3. 隐藏提示信息后设置 uriAnchor 到登陆模块
		 */
		registerBtn.onclick = () => {
			const errorMsg = validatorFunc();
			
			// 渲染错误信息
			if (errorMsg) {
				verificationTextTip.textContent = errorMsg;
		  	verificationTextTip.classList.remove('hidden');
				return;
			}

			// 确认密码
			console.log(pwdEle.value, repwdEle.value);
			if (pwdEle.value != repwdEle.value) {
				verificationTextTip.classList.remove('hidden');
			  verificationTextTip.textContent = '密码不匹配';
				return;
			}

			// 隐藏错误信息
			verificationTextTip.textContent = '';
			verificationTextTip.classList.add('hidden');

			// 测试跳转
		  $.uriAnchor.setAnchor({
				forum: 'welcome', _forum: { login: 'login' }
			});
		};

		// 登陆按钮
		loginBtn.onclick = () => {
		  $.uriAnchor.setAnchor({
			  forum: 'welcome', _forum: { login: 'login' }
			});
		};
	};

	let login = App.defaultPartial.login;  // login partial page
	login.partial = 'lib/login/login.html';
	login.init = () => {
		// 根元素
		const rootElement = App.settings.rootElement;
		// 邮箱输入框元素
		const emailEle = rootElement.querySelector('.login-container-email input');
		// 密码输入框元素
		const pwdEle = rootElement.querySelector('.login-container-pwd input');
		// 验证码输入框元素
		const verificationInputEle = rootElement.querySelector('.login-container-verificationCode-input');
		// 登陆按钮
		const loginBtn = rootElement.querySelector('.welcome .login-container-loginBtn');
		// 暂不登录按钮
		const touristBtn = rootElement.querySelector('.welcome .login-container-extraInfo-tourist');
		// 忘记密码按钮
		const forgetpwdBtn = rootElement.querySelector('.welcome .login-container-extraInfo-forgetpwd');
		// 注册新用户按钮
		const registerBtn = rootElement.querySelector('.welcome .login-registerBtn');
		// 验证提示元素
		const verificationTipEle = rootElement.querySelector('.login-tips-verification-text');

		/**
		 * 验证规则
		 * @func validatorFunc
		 * @returns {str} errorMsg - 返回错误信息
		*/
		const validatorFunc = () => {
		  const validator = new App.extend.Validator();

			validator.add(emailEle, [{  // 邮箱验证规则
			  strategy: 'isNonEmpty',
				errorMsg: '请输入邮箱'
			}, {
			  strategy: 'isEmail',
				errorMsg: '请输入正确的邮箱'
			}]);

			validator.add(pwdEle, [{  // 密码验证规则
			  strategy: 'isNonEmpty',
				errorMsg: '请输入密码'
			}, {
				strategy: 'minLength: 8',
				errorMsg: '密码不能少于 8 位'
			}, {
				strategy: 'maxLength: 12',
				errorMsg: '密码不能多于 12 位'
			}]);

			validator.add(verificationInputEle, [{  // 验证码验证规则
			  strategy: 'isNonEmpty',
				errorMsg: '验证码不能为空'
			}, {
				strategy: 'isLength: 4',
				errorMsg: '请输入 4 位数验证码'
			}]);

			const errorMsg = validator.start();
			return errorMsg;
		};

		// 登陆
    loginBtn.onclick = () => {
			const errorMsg = validatorFunc();

			// 渲染错误信息
			if (errorMsg) {
				verificationTipEle.textContent = errorMsg;
				verificationTipEle.classList.remove('hidden');
				return;
			}

			// 隐藏错误信息
			verificationTipEle.textContent = '';
			verificationTipEle.classList.add('hidden');

			// @TODO
			// 与后台通信，成功后跳转页面
			
			// @TODO 
			// 通信验证通过后，跳转页面
			$.uriAnchor.setAnchor({
			  forum: 'home',
				_forum: { tabContent: 'hotQuestion' }
			});
		};

		// 暂不登录
		touristBtn.onclick = () => {
			$.uriAnchor.setAnchor({
			  forum: 'home',
				_forum: { tabContent: 'hotQuestion' }
			});
		};

		// 忘记密码
		forgetpwdBtn.onclick = () => {
			$.uriAnchor.setAnchor({
			  forum: 'findpwd',
				_forum: { findpwd: 'findpwd' }
			});
		};

		// 注册新用户
		registerBtn.onclick = () => {
			$.uriAnchor.setAnchor({
			  forum: 'welcome',
				_forum: { register: 'register' }
			});
		};
	};


  let home = App.defaultPartial.home;  // default partial page
  home.partial = 'lib/home/home.html';
  home.init = () => {
    // bootstrap method
    // nothing but static content only to render

    const settings = App.settings;
    const rootElement = settings.rootElement;
		const loginBtn = rootElement.querySelector('.header-login');
		const viewMentorBtn = settings.rootElement.querySelector('.forum .mentors-title-more');
    const tabsItems = rootElement.querySelectorAll('.forum .tabs-items-group');
    const mentors = rootElement.querySelector('.mentors');
    const mentorsContainer = mentors.querySelector('.swiper-container');
		const mentorAvatars = mentorsContainer.querySelectorAll('.swiper-slide');
		const topics = rootElement.querySelectorAll('.forum .hotTopic-subject-group img');

		// 登陆按钮
		loginBtn.onclick = () => {
		  $.uriAnchor.setAnchor({
			  forum: 'welcome', _forum: { login: 'login' }
			});
		};

    // 导师轮播图
    let mentorsSwiper = new Swiper(mentorsContainer, {
      slidesPerView: 'auto',
      spaceBetween: 15,
      slidesOffsetBefore: 15,
      freeMode: true
    });

		// 查看所有导师
		viewMentorBtn.onclick = () => {
			$.uriAnchor.setAnchor({
				forum: 'mentor',
				_forum: { mentorItem: 'mentorItem' }
			});
		};

		// 加载导师详情页
		mentorAvatars.forEach((item) => {
			App.cache = item.dataset.mark;
		  item.onclick = () => {
				console.log('待解决...');
				return;
			  $.uriAnchor.setAnchor({
				  forum: 'mentor', _forum: { mentor: 'mentorDetail' }
				});
			};
		});

		/* 进入话题页面 */
		// 通过点击事件处理程序进入指定加载
		// @TODO 这是测试的已注册用户的话题页面，还要测试游客的话题页面
    topics.forEach((item, index) => {
		  item.onclick = () => {
				$.uriAnchor.setAnchor({
				  forum: 'topic', _forum: { topic: 'register' }
				});
			};
		});

    // 切换标签
    tabsItems.forEach((item, index) => {
      item.onclick = () => {
				switch (item.getAttribute('data-tag')) {
					case 'hotQuestion':
						$.uriAnchor.setAnchor({
							forum: 'home', _forum: { tabContent: 'hotQuestion' }
						});
						break;
					case 'newestQuestion':
						$.uriAnchor.setAnchor({
							forum: 'home', _forum: { tabContent: 'newestQuestion' }
						});
						break;
					case 'mineQuestion':
						$.uriAnchor.setAnchor({
							forum: 'home', _forum: { tabContent: 'mineQuestion' }
						});
						break;
					default:
						break;
				}
      };
    });
  };

  let hotQuestion = App.defaultPartial.hotQuestion;  // 首页 - 热门提问
  hotQuestion.partial = 'lib/components/tabContents/hotQuestion.html';
  hotQuestion.init = () => {
    let settings = App.settings;
    let defaultPartial = App.defaultPartial;
    let rootElement = settings.rootElement;
    let tabsContentsItem = rootElement.querySelector('.forum .tabs-contents-item');
		const fullTextEles = rootElement.querySelectorAll('.conversation-question-fullText-para');
		const fullTextBtnEles = rootElement.querySelectorAll('.conversation-question-fullText-btn');
		const viewAndThumbEles = rootElement.querySelectorAll('.viewAndThumb');
		const mentorAnswerEles = rootElement.querySelectorAll('.conversation-answer-mentor');
		const viewMoreEles = rootElement.querySelectorAll('.conversation-more');

    // @TODO 动态获取数据后再显示
    rootElement.querySelector('.forum .tabs-contents-item')
      .classList.remove('hidden');

    // @TODO 获取后台数据
    spa.ajaxRequest('json/hotq.json', 'GET', '', (status, data) => {
      let defaultPartial = App.defaultPartial;
      let parseData = JSON.parse(data);
      let num = 0;
      defaultPartial.hotQuestion.hotQuestion = parseData;
    });

		const conversation = new App.extend.Conversation();

		// @TODO
		// 隐藏用户提问超出的部分
		conversation.hideQuestionText({
			fullTextEles: fullTextEles,
			fullTextBtnEles: fullTextBtnEles
		});

		// @TODO
		// 点击展开用户提问被隐藏的部分
		conversation.showQuestionText();

		// 点赞
		// @TODO 点赞成功后，将数据发到后台
		conversation.thumbsUp(viewAndThumbEles, (thumbCount) => {
		  console.log('点赞成功后，将数据发到后台: ' + thumbCount);
		});

		// 隐藏超出的导师回答部分
		conversation.hideAnswerText(mentorAnswerEles);

		// 展开全部 - 展开超出部分的导师回答
		conversation.viewMore({
			clickedEles: viewMoreEles,
			mentorAnswerEles: mentorAnswerEles
		});
  };

  let newestQuestion = App.defaultPartial.newestQuestion;  // 首页 - 最新提问
  newestQuestion.partial = 'lib/components/tabContents/newestQuestion.html';
  newestQuestion.init = () => {
    let settings = App.settings;
    let rootElement = settings.rootElement;

    spa.render('newestQuestion');

    // @TODO 动态获取数据后再显示
    rootElement.querySelector('.forum .tabs-contents-item')
      .classList.remove('hidden');
  };

  let mineQuestion = App.defaultPartial.mineQuestion;  // 首页 - 我的提问
  mineQuestion.partial = 'lib/components/tabContents/mineQuestion.html';
  mineQuestion.init = () => {
    let settings = App.settings;
    let rootElement = settings.rootElement;

    spa.render('mineQuestion');

    // @TODO 动态获取数据后再显示
    rootElement.querySelector('.forum .tabs-contents-item')
      .classList.remove('hidden');
  };


	let mentor = App.defaultPartial.mentor;  // 导师汇总页面
	mentor.partial = 'lib/mentor/mentor.html';
	mentor.init = () => {
		const header = App.settings.rootElement.querySelector('header');
		const backBtn = App.settings.rootElement.querySelector('.header-back');

		// 返回上一页
		backBtn.onclick = () => {
			window.history.back();
		};
	};

	let mentorItem = App.defaultPartial.mentorItem;  // 导师汇总页面 - 导师
	mentorItem.partial = 'lib/mentor/mentorItem.html';
	mentorItem.init = () => {
		const mentorItems = App.settings.rootElement.querySelectorAll('.mentor-main-item');
		let num = 1;

		// 渲染导师头像
		const renderMentorAvatar = (mentorAvatar) => {
			const avatar = 'url("/forum/images/mentors/mentor100' + num + '.png") no-repeat center center';

			mentorAvatar.style.background = avatar;
	  	mentorAvatar.style.backgroundSize = '100%';

			num += 1;
		};

		// 加载导师详情页
		const loadMentorPartial = (item) => {
			App.cache = item.dataset.mark;

			$.uriAnchor.setAnchor({
				forum: 'mentor', _forum: { mentorDetail: 'mentorDetail' }
			});
		};

		mentorItems.forEach((item, index) => {
			const mentorAvatar = item.querySelector('.mentor-main-item-avatar');

			renderMentorAvatar(mentorAvatar);

			mentorAvatar.onclick = () => {
				loadMentorPartial(mentorAvatar);
			};
		});
	};

	let mentorDetail = App.defaultPartial.mentorDetail;  // 导师详情页
	mentorDetail.partial = 'lib/mentor/mentorDetail.html';
	mentorDetail.init = () => {
		const rootElement = App.settings.rootElement;
		const mainEle = rootElement.querySelector('.mentor-main');
		const headerTitleEle = rootElement.querySelector('.header-title-text');
		const bannerMentorAvatar = rootElement.querySelector('.mentorDetail-banner-info-avatar');
		const bannerTitleEle = rootElement.querySelector('.mentorDetail-banner-info-text-title');
		const bannerSecTitleEle = rootElement.querySelector('.mentorDetail-banner-info-text-sectitle');
		const viewAndThumbEles = rootElement.querySelectorAll('.viewAndThumb');
		const viewMoreEles = rootElement.querySelectorAll('.conversation-more');
		const fullTextEles = rootElement.querySelectorAll('.conversation-question-fullText-para');
		const fullTextBtnEles = rootElement.querySelectorAll('.conversation-question-fullText-btn');
		const mentorAnswerEles = rootElement.querySelectorAll('.conversation-answer-mentor');
		const headerTitleData = {
			mentor1: '嘉伟导师', mentor2: '青恩导师', mentor3: '阿苏导师',
			mentor4: '艺心导师', mentor5: '佳馨导师', mentor6: '木兮导师',
			mentor7: 'Hope 导师', mentor8: '皓霖导师', mentor9: '诺亚导师',
			mentor10: '子叶导师', mentor11: '孑然导师', mentor12: '谧沙导师',
			mentor13: '文心导师'
		};

		/**
		 * Note: 根据 App.cache 中的值来更新内容
	  */

		// 更新页面标题
		if (headerTitleEle) {
			headerTitleEle.textContent = headerTitleData[App.cache];
		}

		// 更新 banner 导师头像
		const avatarNum = App.cache.split('mentor')[1];
		const avatarUrl = 'url("/forum/images/mentors/mentor100' + avatarNum + '.png") no-repeat center center'
		bannerMentorAvatar.style.background = avatarUrl;
		bannerMentorAvatar.style.backgroundSize = '100%';
		
		// 更新 banner 标题
		bannerTitleEle.textContent = headerTitleData[App.cache];

		// @TODO
		// 更新 banner 次标题

		// @TODO
		// 更新 banner 描述

		// 调整主内容区样式
		mainEle.style.padding = '45px 0 0';


		// 调用方法 用户与导师对话
		const conversation = new App.extend.Conversation();

		// @TODO
		// 隐藏用户提问超出的部分
		conversation.hideQuestionText({
			fullTextEles: fullTextEles,
			fullTextBtnEles: fullTextBtnEles
		});

		// @TODO
		// 点击展开用户提问被隐藏的部分
		conversation.showQuestionText();

		// 点赞
		// @TODO 点赞成功后，将数据发到后台
		conversation.thumbsUp(viewAndThumbEles, (thumbCount) => {
		  console.log('点赞成功后，将数据发到后台: ' + thumbCount);
		});

		// 隐藏超出的导师回答部分
		conversation.hideAnswerText(mentorAnswerEles);

		// 展开全部 - 展开超出部分的导师回答
		conversation.viewMore({
			clickedEles: viewMoreEles,
			mentorAnswerEles: mentorAnswerEles
		});
	};


	let findpwd = App.defaultPartial.findpwd;  // 找回密码模块
	findpwd.partial = 'lib/findpwd/findpwd.html';
	findpwd.init = () => {
		const rootElement = App.settings.rootElement;  // 根元素
		// 邮箱输入框元素
		const emailEle = rootElement.querySelector('.findpwd-email input');
		// 邮箱验证码输入框元素
		const emailCodeEle = rootElement.querySelector('.findpwd-verificationCode input');
		// 发送邮箱验证码按钮
		const sendEmailBtnEle = rootElement.querySelector('.findpwd-verificationCode-btn');
		// 下一步按钮
		const submitBtnEle = rootElement.querySelector('.findpwd-btn');
		// 验证提示信息元素
		const verificationTextEle = rootElement.querySelector('.findpwd-tips-verification-text');

		const validatorFunc = () => {
		  const validator = new App.extend.Validator();

			// 验证邮箱
			validator.add(emailEle, [{
			  strategy: 'isNonEmpty',
				errorMsg: '请输入邮箱'
			},{
			  strategy: 'isEmail',
				errorMsg: '邮箱格式有误'
			}]);

			// 验证邮箱验证码
			validator.add(emailCodeEle, [{
			  strategy: 'isNonEmpty',
				errorMsg: '请输入邮箱验证码'
			}, {
				strategy: 'isLength:6',
				errorMsg: '请输入 6 位验证码'
			}]);

			const errorMsg = validator.start();
			return errorMsg;
		};

		// @TODO 
		// 发送验证码 - 发送请求给后台
		sendEmailBtnEle.onclick = (event) => {
			/**
				* @TODO
				* 1. 与服务器通讯
				* 2. 成功后，该按钮不可点击
				*    设置属性 data-clickable
				*      true - 可点击
				*      false - 不可点击
				*
		  */
			const target = event.target;
			const isClickable = target.dataset.clickable;
			const myTimer = new App.extend.Timer(target, {
				count: 5,
				message: '发送验证码'
			});

			// 执行定时器
			myTimer.timerFunc(target, isClickable);
		};

		// @TODO 
		// 下一步
		submitBtnEle.onclick = () => {
			// 验证
			const errorMsg = validatorFunc();

			// 渲染错误验证信息
			if (errorMsg) {
				verificationTextEle.textContent = errorMsg;
				verificationTextEle.classList.remove('hidden');
				return;
			}

			// 隐藏错误验证信息
			verificationTextEle.textContent = '';
			verificationTextEle.classList.add('hidden');

			$.uriAnchor.setAnchor({
				forum: 'resetpwd',
				_forum: { resetpwd: 'resetpwd' }
			});
		};
	};

	let resetpwd = App.defaultPartial.resetpwd;  // 重设密码模块
	resetpwd.partial = 'lib/findpwd/resetpwd.html';
	resetpwd.init = () => {
		const rootElement = App.settings.rootElement;
		const emailEle = rootElement.querySelector('.resetpwd-email input');
		const verificationCodeEle = rootElement.querySelector('.resetpwd-verificationCode input');
		const submitBtnEle = rootElement.querySelector('.resetpwd-btn');
		const verificationTip = rootElement.querySelector('.resetpwd-verificationTip span');

	  console.log('重设密码模块.');
		/**
		 * 验证规则
		 * @func validatorFunc
		 * @returns {str} errorMsg - 返回错误信息
		*/
		const validatorFunc = () => {
		  const validator = new App.extend.Validator();

			validator.add(emailEle, [{  // 邮箱验证规则
			  strategy: 'isNonEmpty',  // 验证邮箱是否为空
				errorMsg: '请输入邮箱'
			}, {
			  strategy: 'isEmail',  // 验证邮箱格式
				errorMsg: '请输入格式正确的邮箱'
			}]);

			validator.add(verificationCodeEle, [{  // 邮箱验证码验证规则
			  strategy: 'isNonEmpty',  // 验证邮箱验证码是否为空
				errorMsg: '请输入邮箱验证码'
			}, {
				strategy: 'isLength: 6',  // 验证邮箱验证码是否为 6 位
				errorMsg: '请输入 6 位邮箱验证码'
			}]);

			const errorMsg = validator.start();  // 获取错误信息
			return errorMsg;
		};

		// 点击提交按钮
		submitBtnEle.onclick = () => {
			const errorMsg = validatorFunc();  // 获取错误信息

			// 渲染错误信息
			if (errorMsg) {
				// @TODO
				// 渲染错误信息
				//   [ ] 1. 邮箱不为空
				//   [ ] 2. 邮箱格式是否正确
				//   [ ] 3. 邮箱验证码不为空
				//   [ ] 4. 邮箱验证码必须为 6 位

				verificationTip.textContent = errorMsg;
				verificationTip.classList.remove('hidden');
			  console.log(errorMsg);
				return;
			}

			// 隐藏错误信息
			verificationTip.textContent = '';
			verificationTip.classList.add('hidden');

			// @TODO
			// 与后台通信: 渲染提示信息 - 验证成功
			// spa.ajaxRequest();

			// @TODO
			// 在请求中跳转页面
			$.uriAnchor.setAnchor({
			  forum: 'welcome', _forum: { login: 'login' }
			});
		};
	};


	let topic = App.defaultPartial.topic;  // 话题模块
	topic.partial = 'lib/topic/topic.html';
	topic.init = () => {
	  console.log('登陆后的话题模块.');
	};

	let savelove = App.defaultPartial.savelove;  // 话题 - 挽回爱情
	savelove.partial = 'lib/topic/savelove.html';
	savelove.init = () => {
	  console.log('挽回爱情模块.');
	};

	let savemarriage = App.defaultPartial.savemarriage;  // 话题 - 挽救婚姻
	savemarriage.partial = 'lib/topic/savemarriage.html';
	savemarriage.init = () => {
	  console.log('挽救婚姻模块.');
	};

	let customlove = App.defaultPartial.customlove;  // 话题 - 定制爱情
  customlove.partial = 'lib/topic/customlove.html';
	customlove.init = () => {
	  console.log('定制爱情模块.');
	};

	let separatemistress = App.defaultPartial.separatemistress;  // 话题 - 分离小三
	separatemistress.partial = 'lib/topic/separatemistress.html';
	separatemistress.init = () => {
	  console.log('分离小三模块.');
	};


	// 测试页面
	let template = App.defaultPartial.template;
	template.partial = 'lib/template/template.html';
	template.init = () => {};


  App.settings.rootElement = document.querySelector('#root');
  App.settings.tabContentsElement = document.querySelector('.forum .tabs-contents');


	/**
   * 用户导师对话
	 * @func App.extend.Conversation
	*/
	App.extend.Conversation = function(selector, options) {
		if (!(this instanceof App.extend.Conversation)) {
		  return new App.extend.Conversation(selector, options);
		}

		// 合并参数
		this.options = this.extend({
		  // 默认参数
			// ...
		}, options);

		if(typeof selector === 'string') {
		  this.selector = document.querySelectorAll(selector);
		} else { this.selector = selector; }

		// 初始化
		this.init();
	};
	App.extend.Conversation.prototype.init = function() {
		// 初始化...
	};
	App.extend.Conversation.prototype.extend = function(obj, options) {
		for (let key in options) {
		  obj[key] = options[key];
		}
		return obj;
	};
	/**
	 * @TODO
	 * 隐藏用户提问超出的部分
	 * @func App.extend.Conversation.hideQuestionText
	*/
	App.extend.Conversation.prototype.hideQuestionText = function(selectors) {
	  console.log('隐藏用户提问超出的部分。');

		const {fullTextEles, fullTextBtnEles} = selectors;

		fullTextEles.forEach((item, index) => {
			if (item.textContent.length > 78) {
			  console.log('隐藏用户提问超出的部分');
			}
		});
	};
	/**
	 * @TODO
	 * 展开用户提问超出的部分
	 * @func App.extend.Conversation.showQuestionText
	*/
	App.extend.Conversation.prototype.showQuestionText = function() {};
	/**
	 * 隐藏超出的导师回答
	 * @func App.extendConversation.hideAnswerText
	 */
	App.extend.Conversation.prototype.hideAnswerText = function(selectors) {
		const answerLen = selectors.length;

		selectors.forEach((item, index) => {
			const children = item.children;

			// 多于 2 条的用户回答将被隐藏
			if (children.length > 3) {
				const leftChildren = Array.prototype.slice.call(children, 2, children.length - 1);
				leftChildren.forEach((item2, index2) => {
					item2.classList.add('hidden');
				});
			}

			// 小于等于 2 条的用户回答将不显示 展开全部 按钮
			if (children.length <= 3) {
				item.children[item.children.length - 1].classList.add('hidden');
			}
		});
	};
	/**
	 * 用户点赞
	 * @func App.extend.Conversation.prototype.thumbsUp
	 * @param {elements} ele - 目标元素父容器
	 * @param {fnc} callback - 点赞后的回调函数
	*/
	App.extend.Conversation.prototype.thumbsUp = function(ele, callback) {
		ele.forEach((item, index) => {
			item.onclick = (event) => {
				const target = event.target;
				const thumbIconEle = item.querySelector('.thumb-icon');
				const thumbTextEle = item.querySelector('.thumb-text');
				let thumbTextNum = thumbTextEle.textContent;
				let thumbCount = null;  // 点赞后的点赞数

				// 点赞
				if (target.classList.contains('thumb-icon') || target.classList.contains('thumb-text')) {
					if (thumbIconEle.dataset.thumbed === 'treu') { return false; }

					thumbIconEle.classList.remove('normal');
					thumbIconEle.classList.add('active');
					thumbIconEle.dataset.thumbed = 'true';

					// 更新点赞数
					thumbCount = thumbTextEle.textContent = parseInt(thumbTextNum, 10) + 1;

					// @TODO 点赞数更新后发给后台
					// ...
					if (typeof callback === 'function') {
						callback(parseInt(thumbCount, 10));
					}
				}
			};
		});
	};
	/**
	 * 展开全部导师评论
	 * @func App.extend.Conversation.prototype.viewMore
	 * @param {object}
	 * @param {element} obj.clickTargetEles - 被点击的元素
	*/
	App.extend.Conversation.prototype.viewMore = function(options) { 
		const { clickedEles, mentorAnswerEles} = options;

		clickedEles.forEach((item, index) => {
			item.onclick = (event) => {
			  const target = event.target;
				const isClassNameExist = 
					target.classList.contains('conversation-more-text') || 
					target.classList.contains('conversation-more-icon');

				if (isClassNameExist) {
					const children = Array.prototype.slice.call(mentorAnswerEles[index].children, 0);

					children.forEach((item2, index2) => {
						if (item2.classList.contains('hidden')) {  // 展开超出部分
						  item2.classList.remove('hidden');
						}
						if (item2.classList.contains('conversation-more')) {  // 隐藏按钮
						  item2.classList.add('hidden');
						}
					});
				}
			};
		});
	}
	/**
	 * 查看用户提问的全文
	 * @func App.extend.Conversation.prototype.fullQuestionText
	*/
	App.extend.Conversation.prototype.fullQuestionText = function() {};


	/**
	 * 定时器
	 * @func App.extend.Timer
	*/
	App.extend.Timer = function(selector, options) {
		if (!(this instanceof App.extend.Timer)) {
		  return new App.extend.Timer(selector, options);
		}

		// 合并参数
		this.options = this.extend({
		  // 默认参数
			// ...
			count: 60,
			message: '自定义信息'
		}, options);

		if(typeof selector === 'string') {
		  this.selector = document.querySelectorAll(selector);
		} else { this.selector = selector; }

		// 初始化
		this.init();
	};
	// 初始化
	App.extend.Timer.prototype.init = function() {};
	// 合并参数
	App.extend.Timer.prototype.extend = function(obj, options) {
		for (let key in options) {
		  obj[key] = options[key];
			obj[key + '_init'] = options[key];
		}
		return obj;
	};
	App.extend.Timer.prototype.timerFunc = function(target, isClickable) {
		// 定时器
		if (Object.is(isClickable, 'true')) {
			console.log('开始通讯');
			// 开始通讯
			// 成功后
			//   1. 按钮不可点击
			//   2. 提示用户已发送验证码的
			//   3. 更新状态
			//   4. 60s 后更新状态

			// 按钮不可点击
			this.updateTargetState(target, 'unclickable');

			// 不可点击状态倒计时
			timer = setInterval(() => {
				console.log(this.options.count);
				if (this.options.count === 0) {
					// 更新为可点击状态
					this.updateTargetState(target, 'clickable');

					clearInterval(timer);
					return false;
				}

				--this.options.count;
				target.textContent = '重新获取 ' + this.options.count;
			}, 1000);

			return false;
		}
		else if (Object.is(isClickable, 'false')) {
			console.log('不可点击');
			return false;
		}
	};
	// 更新状态
	App.extend.Timer.prototype.updateTargetState = function(target, state) {
		// 按钮可点击
		if (Object(state, 'clickable')) {
			target.classList.remove('unclickable');
			target.dataset.clickable = true;
			target.textContent = this.options.message;
			this.options.count = this.options.count_init;
		}

		// 按钮不可点击
		if (Object.is(state, 'unclickable')) {
			target.classList.add('unclickable');
			target.dataset.clickable = false;
		}
	};


	/**
	 * 验证用策略对象
	*/
	App.extend.verificationStrategies = {
	  isNonEmpty (value, errorMsg) {  // 验证是否为空
		  if (value === '') { return errorMsg; }
		},
		minLength (value, length, errorMsg) {  // 验证最小长度
		  if (value.length < length) { return errorMsg; }
		},
		isLength (value, length, errorMsg) {  // 验证 value 固定长度
		  if (value.length != length) { return errorMsg; }
		},
		maxLength (value, length, errorMsg) {  // 验证最大长度
			if (value.length > length) { return errorMsg; }
		},
		isMobile (value, errorMsg) {  // 验证是否为手机号
			if (!/^1[3|5|8][0-9]{9}$/.test(value)) { return errorMsg; }
		},
		isEmail (value, errorMsg) {  // 验证是否为邮箱
		  if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
				return errorMsg;
			}
		}
	};
	/**
	 * 验证类
	*/
  App.extend.Validator = function() { this.cache = []; };
	App.extend.Validator.prototype.add = function(dom, rules) {
		const self = this;

		for (let i = 0, len = rules.length; i < len; i++) {
			(rule => {
			  const strategyArr = rule.strategy.split(':');
				const errorMsg = rule.errorMsg;

				self.cache.push(() => {
				  const strategy = strategyArr.shift();

					// 将 input.value 插入为数组的第一个元素
					strategyArr.unshift(dom.value);
					
					// 将错误信息插入到数组尾部
					strategyArr.push(errorMsg);

					// 将对应的策略方法 push 到 this.cache 数组中
					return App.extend.verificationStrategies[strategy].apply(dom, strategyArr);
				});
			})(rules[i]);
		}
	};
	App.extend.Validator.prototype.start = function() {
	  for (let i = 0, len = this.cache.length; i < len; i++) {
		  const errorMsg = this.cache[i]();
			if (errorMsg) { return errorMsg; }
		}
	};


	/**
   * 页面信息 - 页面宽度和页面高度
	 * @func App.extend.pageInfo
	 * @returns {object} object.pageWidth - 页面宽度
	 * @returns {object} object.pageHeight - 页面高度
	*/
	App.extend.pageInfo = () => {
	  let pageWidth = window.innerWidth;    // 页面宽度
		let pageHeight = window.innerHeight;  // 页面高度

		if (typeof pageWidth != 'number') {
		  if (document.compatMod == CSS1Compat) {
			  pageWidth = document.documentElement.clientWidth;
				pageHeight = document.documentElement.clientHeight;
			} else {
			  pageWidth = document.body.clientWidth;
				pageHeight = document.body.clientHeight;
			}
		}

		// 暴露页面宽度和高度
		return { pageWidth, pageHeight };
	};



	/******************** 私有方法 *************************/
	const fixedTabItem = () => {
		const anchorMap = $.uriAnchor.makeAnchorMap();

		for (let key in anchorMap) {
		  if (anchorMap[key] === 'home') {
				const tabItem = App.settings.rootElement.querySelector('.tabs-items');
				const scrollTop = App.settings.rootElement.scrollTop;
				const tabItemOffsetTop = tabItem.offsetTop;
				const maskTabItem = document.querySelector('.mask .forum .tabs');
				const maskTabItemGroup = maskTabItem.querySelectorAll('.tabs-items-group');

				if (scrollTop >= tabItemOffsetTop) {
					maskTabItem.classList.remove('hidden');

					maskTabItemGroup.forEach((item, index) => {
						item.onclick = () => {
							switch (item.getAttribute('data-tag')) {
								case 'hotQuestion':
									$.uriAnchor.setAnchor({
										forum: 'home', _forum: { tabContent: 'hotQuestion' }
									});
									break;
								case 'newestQuestion':
									$.uriAnchor.setAnchor({
										forum: 'home', _forum: { tabContent: 'newestQuestion' }
									});
									break;
								case 'mineQuestion':
									$.uriAnchor.setAnchor({
										forum: 'home', _forum: { tabContent: 'mineQuestion' }
									});
									break;
								default:
									break;
							}
						};
					});
				} else { maskTabItem.classList.add('hidden'); }
			}
		}
	};


  // 初始化 
  // @TODO 先判断有没有对应页面，有的话直接加载，没有的话加载 404 页面
  $.uriAnchor.setAnchor({
		forum: 'home',
		_forum: { tabContent: 'hotQuestion' } 
	});

	// 监听地址栏哈希值
  spa.onHashchange();

	// 监听 rootElement 滚动条
	App.settings.rootElement.onscroll = event => {
		// 固定首页热门标签
		fixedTabItem();
	};
})();
