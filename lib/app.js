let app = (() => {
  App.namespace('defaultPartial.notfound');  // 404 页面
  App.namespace('defaultPartial.updating');  // 提示用户正在维护或升级的页面

	App.namespace('defaultPartial.welcome');  // 登陆和注册容器
	
	App.namespace('defaultPartial.register');
	App.namespace('defaultPartial.email');
	App.namespace('defaultPartial.nickname');
	App.namespace('defaultPartial.pwd');

	App.namespace('defaultPartial.login');

  App.namespace('defaultPartial.home');  // 首页容器
  App.namespace('defaultPartial.hotQuestion');
  App.namespace('defaultPartial.newestQuestion');
  App.namespace('defaultPartial.mineQuestion');

	App.namespace('defaultPartial.mentor');  // 导师列表容器
	App.namespace('defaultPartial.mentorItem');
	App.namespace('defaultPartial.mentorDetail');

	App.namespace('defaultPartial.findpwd');  // 找回密码
	App.namespace('defaultPartial.resetpwd');  // 重设密码

	App.namespace('defaultPartial.topic');  // 热门话题容器
	App.namespace('defaultPartial.savelove');
	App.namespace('defaultPartial.savemarriage');
	App.namespace('defaultPartial.customlove');
	App.namespace('defaultPartial.separatemistress');

	App.namespace('urls');
	App.urls['origin'] = 'http://wd.jvziqinggan.com/Forum/';

  App.namespace('defaultPartial.template');  // 测试

	let globalCache = {
	  userinfo: {  // 用户信息
		  email: null,  // 用户邮箱
			nickname: null,  // 用户昵称
		},
		isLogin: false  // 判断用户是否已登陆
	};  // 全局缓存对象


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

		return;

		const rootElement = App.settings.rootElement;  // 根元素
		const verificationTextTip = rootElement.querySelector('.register-tips-verification-text');
		let cache = [];
		let state = {};

		// 显示注册模块隐藏登陆模块
		document.querySelector('.welcome .login').classList.add('hidden');
		document.querySelector('.welcome .register').classList.remove('hidden');

		/**
		 * 添加注册验证规则
		 * @func validatorFunc
		 * @returns {str} errorMsg - 返回验证错误信息
		*/
		const validatorFunc = () => {
		  const validator = new App.extend.Validator();
			const nicknameEle = rootElement.querySelector('.register-container-nickname input');
			const emailEle = rootElement.querySelector('.register-container-email input');
			const emailVerificationEle = rootElement.querySelector('.register-container-verificationCode input');
			const pwdEle = rootElement.querySelector('.register-container-pwd input');
			const repwdEle = rootElement.querySelector('.register-container-repwd input');
			const phoneEle = rootElement.querySelector('.register-container-phone input');

			validator.add(nicknameEle, [{  // 昵称验证规则
				strategy: 'isNonEmpty',
				errorMsg: '请输入昵称'
			}, {
				strategy: 'minLength: 3',
				errorMsg: '昵称长度不可少于 3 个字符'
			}, {
				strategy: 'maxLength: 12',
				errorMsg: '昵称长度不可大于 12 个字符'
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

			const errorMsg = validator.start();  // 获取验证后错误信息
			return errorMsg;
		};

		const getEmailCode = (() => {  // 获取邮箱验证码
			const verificationCodeBtn = rootElement.querySelector('.welcome .register-container-verificationCode-btn');
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
				const emailEle = rootElement.querySelector('.register-container-email input');
				const myTimer = new App.extend.Timer(target, {
					count: 3,
					message: '获取验证码'
				});

				// 发送邮箱验证码按钮为灰色时，不可点击
				if (event.target.classList.contains('unclickable')) { return; }

				// @TODO 通讯
				spa.ajaxRequest(
					'http://wd.jvziqinggan.com/Forum/sendVerifyCodeEmail',
					'POST',
					JSON.stringify({email: emailEle.value}),
					'application/json;charset=UTF-8',
					(status, data) => {
						if (status === 200) {
							if (data === 'false') {
								verificationTextTip.textContent = '获取邮箱验证码失败，请重试！';
								verificationTextTip.classList.remove('hidden');
							} else {
								verificationTextTip.textContent = '';
								verificationTextTip.classList.add('hidden');
								emailVerificationCodeCache = data;
							}

							return;
						}

						console.log('获取邮箱验证码时，与后台通信失败！');
					}
				);

				// 执行定时器
				myTimer.timerFunc(target, isClickable);
			};
		})();

		const chooseSex = (() => {  // 选择性别
			const sexBtns = rootElement.querySelectorAll('.welcome .register-container-sex-group');
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
		})();


		/**
		 * 注册按钮
		 * @TODO
		 * 1. 与服务器通讯
		 * 2. 成功后显示提示信息
		 * 3. 隐藏提示信息后设置 uriAnchor 到登陆模块
		 */
		const register = (() => {  // 注册
			const registerBtn = rootElement.querySelector('.welcome .register-container-registerBtn');
			registerBtn.onclick = () => {
				const verificationTextTip = rootElement.querySelector('.register-tips-verification-text');
				const nicknameEle = rootElement.querySelector('.register-container-nickname input');
				const emailEle = rootElement.querySelector('.register-container-email input');
				const pwdEle = rootElement.querySelector('.register-container-pwd input');
				const repwdEle = rootElement.querySelector('.register-container-repwd input');
				const phoneEle = rootElement.querySelector('.register-container-phone input');
				const sexes = rootElement.querySelectorAll('.register-container-sex-group');
				const errorMsg = validatorFunc();

				// 当与服务器验证没有通过时，一直显示对应的错误信息而不显示前端验证的
				// 错误信息
				if (cache.length != 0) {
					verificationTextTip.textContent = cache[0];
					verificationTextTip.classList.remove('hidden');
					return;
				}

				if (errorMsg) {  // 渲染错误信息
					verificationTextTip.textContent = errorMsg;
					verificationTextTip.classList.remove('hidden');
					return;
				}

				if (pwdEle.value != repwdEle.value) {  // 确认密码
					verificationTextTip.classList.remove('hidden');
					verificationTextTip.textContent = '密码不匹配';
					return;
				}

				spa.ajaxRequest(
				  'http://wd.jvziqinggan.com/Forum/checkUsername',
					'POST',
					JSON.stringify({ username: nicknameEle.value }),
					'application/json;charset=UTF-8',
					(status, data) => {
						if (data === 'false') {
						  verificationTextTip.textContent = '昵称已被注册，换一个吧';
							return;
						}
					}
				);

				// 隐藏错误信息
				verificationTextTip.textContent = '';
				verificationTextTip.classList.add('hidden');

				console.log('开始注册...');

				return;

				// @TODO 将注册信息发送到后台，随后跳转到登陆页面
				spa.ajaxRequest(
				  'http://wd.jvziqinggan.com/Forum/register',
					'POST',
					JSON.stringify({
					  username: usernameEle.value,
						email: emailEle.value,
						password: pwdEle.value,
						tel: parseInt(phoneEle.value, 10),
						sex: selectedSexVal,
					}),
					'application/json;charset=UTF-8',
					(status, data) => {
						console.log(status, data);
						console.log('typeof data: ' + typeof data);
					  if (status === 200) {
							console.log('waiting...');
						}

						console.log('注册失败，请重试！');
					}
				);

				// @TODO 测试跳转
				$.uriAnchor.setAnchor({
					forum: 'welcome', _forum: { login: 'login' }
				});
			};
		})();

		const login = (() => {  // 登陆
			const loginBtn = rootElement.querySelector('.welcome .register-loginBtn');
			loginBtn.onclick = () => {
				$.uriAnchor.setAnchor({forum: 'welcome', _forum: {login: 'login'}});
			};
		})();
	};

	let email = App.defaultPartial.email;
	email.partial = 'lib/register/email.html';
	email.init = () => {
		const rootElement = App.settings.rootElement;
		const emailEle = rootElement.querySelector('.register-container-email input');
		const verificationCodeEle = rootElement.querySelector('.register-container-verificationCode input');
		const sendEmailCodeBtn = rootElement.querySelector('.register-container-verificationCode-btn');
		const nextBtn = rootElement.querySelector('.register-container-registerBtn button');
		const loginBtn = rootElement.querySelector('.register-loginBtn');
		let state = {  // 状态
		  emailEle: false,
			verificationCodeEle: false
		};
		let stateArr = [];
		
		// 隐藏登陆模块，显示注册模块
		document.querySelector('.welcome .login').classList.add('hidden');
		document.querySelector('.welcome .register').classList.remove('hidden');

		emailEle.focus();  // 邮箱输入框自动获取焦点

		const renderErrorMsg = (errorMsgEle, errorMsg) => {  // 渲染错误消息
			errorMsgEle.textContent = errorMsg;
			errorMsgEle.classList.remove('hidden');
		};

		const clearErrorMsg = (errorMsgEle) => {  // 清除错误消息
			errorMsgEle.textContent = '';
			errorMsgEle.classList.add('hidden');
		};

		const emailValidatorFunc = () => {  // 邮箱验证规则
			const validator = new App.extend.Validator();
			validator.add(emailEle, [{  // 邮箱验证规则
			  strategy: 'isNonEmpty',  // 验证邮箱是否为空
				errorMsg: '邮箱不能为空'  // 邮箱为空时的错误消息
			}, {
			  strategy: 'isEmail',  // 验证邮箱格式是否正确
				errorMsg: '邮箱格式有误'  // 邮箱格式有误时的错误消息
			}]);

			const errorMsg = validator.start();
			return errorMsg;
		};

		const emailCodeValidatorFunc = () => {  // 邮箱验证码验证规则
			const validator = new App.extend.Validator();

			validator.add(verificationCodeEle, [{
				strategy: 'isLength: 6',
				errorMsg: '请输入 6 位数验证码'
			}]);
			const errorMsg = validator.start();
			return errorMsg;
		};

		emailEle.onkeyup = (event) => {  // 邮箱失去焦点
			const errorMsg = emailValidatorFunc();
			const errorMsgEle = event.target.nextElementSibling;

			// 存在错误信息则渲染到页面
			if (errorMsg) {
				renderErrorMsg(errorMsgEle, errorMsg);  // 渲染错误信息
				state['emailEle'] = false;  // 缓存状态
				return;
			}

			state['emailEle'] = true;  // 缓存状态

			// 隐藏错误信息
			errorMsgEle.textContent = '';
			errorMsgEle.classList.remove('hidden');
		};

		verificationCodeEle.onkeyup = (event) => {  // 邮箱验证码失去焦点
			const target = event.target;
			const errorMsgEle = target.nextElementSibling.nextElementSibling;
			const errorMsg = emailCodeValidatorFunc();
			if (errorMsg) {
				renderErrorMsg(errorMsgEle, errorMsg);
				state['verificationCodeEle'] = false;  // 缓存状态
				return;
			}

			state['verificationCodeEle'] = true; // 缓存状态
			errorMsgEle.textContent = '';
			errorMsgEle.classList.add('hidden');
		};

		sendEmailCodeBtn.onclick = (event) => {
			const target = event.target;
			const isClickable = target.dataset.clickable;
			const errorMsg = emailValidatorFunc();
			const errorMsgEle = emailEle.nextElementSibling;
			const myTimer = new App.extend.Timer(target, {
				count: 3,
				message: '获取验证码'
			});

			if (errorMsg) { 
				renderErrorMsg(errorMsgEle, errorMsg);
				return;
			}

			// 发送邮箱验证码
			spa.ajaxRequest(
				'http://wd.jvziqinggan.com/Forum/sendVerifyCodeEmail',
				'POST',
				JSON.stringify({email: emailEle.value}),
				'application/json;charset=UTF-8',
				(status, data) => {
					if (status === 200 && status !== 404) {
						// 执行定时器
						myTimer.timerFunc(target, isClickable);
						return;
					}

					renderErrorMsg(errorMsgEle, '发送验证码失败，请稍后重试');
				}
			);
		};
		
		nextBtn.onclick = (event) => {  // 点击 下一步
			const target = event.target;
			const emailCodeEle = rootElement.querySelector('.register-container-verificationCode input');
			const errorMsgEle = target.nextElementSibling;

			stateArr = [];
			for (let key in state) {
			  stateArr.push(state[key]);
			}

			const isNextEleClickable = stateArr.some((item) => {
			  return item === false;
			});

			// 信息不完善，禁止进行下一步
			if (isNextEleClickable) {
				renderErrorMsg(target.nextElementSibling, '请完善信息');
				return;
			}

			// 验证邮箱是否已存在
			spa.ajaxRequest(
			  App.urls.origin + 'checkEmail',
				'POST',
				JSON.stringify({ email: emailEle.value }),
				'application/json;charset=UTF-8',
				(status, data) => {
					if (status === 200 && status !== 404) {
					  if (data === 'false') {  // 邮箱已存在
						  renderErrorMsg(errorMsgEle, '该邮箱已注册，请登陆');  // 渲染错误信息
							return;
						}

						clearErrorMsg(errorMsgEle);  // 清除错误信息
						checkEmailCode();  // 验证邮箱验证码是否正确
					}
				}
			);

			// 验证邮箱验证码
			const checkEmailCode = () => {
				spa.ajaxRequest(
					App.urls.origin + 'checkVerifyCodeEmail',
					'POST',
					JSON.stringify({verifyCode: emailCodeEle.value}),
					'application/json;charset=UTF-8',
					(status, data) => {
						if (status === 200 && status !== 404) {
							if (data === 'true') {
								target.nextElementSibling.textContent = '';
								target.nextElementSibling.classList.add('hidden');

								// 缓存用户邮箱
								globalCache.userinfo['email'] = emailEle.value;

								// 加载用户设置昵称模块
								$.uriAnchor.setAnchor({
									forum: 'welcome',
									_forum: { register: 'nickname' }
								});
								return;
							}

							renderErrorMsg(
								target.nextElementSibling,
								'验证码无效，请稍后重新获取'
							);
						}
					}
				);
			};
		};

		loginBtn.onclick = () => {  // 登陆按钮点击事件处理程序
		  $.uriAnchor.setAnchor({
			  forum: 'welcome',
				_forum: { login: 'login' }
			});
		};
	};

	let nickname = App.defaultPartial.nickname;
	nickname.partial = 'lib/register/nickname.html';
	nickname.init = () => {
		/**
		 * 该模块为用户注册时，验证邮箱后加载的设置用户昵称模块，此时，用户邮箱
		 * 已缓存全局对象 globalCache 中，
		 * 当用户通过 url 来访问该模块时，应检查用户邮箱是否已缓存在 globalCache
		 * 全局对象中。
	  */

		// 判断用户是否有权限访问该模块
		if (globalCache.userinfo.email === null) {
			// 稍后跳转
			$.uriAnchor.setAnchor({
			  forum: 'home',
				_forum: { tabContent: 'hotQuestion' }
			});
			return;
		}

		// 隐藏登陆模块，显示注册模块
		document.querySelector('.welcome .login').classList.add('hidden');
		document.querySelector('.welcome .register').classList.remove('hidden');

		const rootElement = App.settings.rootElement;
		const nicknameEle = rootElement.querySelector('.register-container-nickname input');
		const nextBtn = rootElement.querySelector('.register-container-registerBtn button');
		const loginBtn = rootElement.querySelector('.register-loginBtn');

		nicknameEle.focus();  // 昵称输入框自动获取焦点
		nicknameEle.nextElementSibling.textContent = '3-12 位，只支持字母、数字、下划线';
		nicknameEle.nextElementSibling.classList.remove('hidden');

		const renderErrorMsg = (errorMsgEle, errorMsg) => {  // 渲染错误信息
		  errorMsgEle.textContent = errorMsg;
			errorMsgEle.classList.remove('hidden');
		};

		const clearErrorMsg = (errorMsgEle) => {  // 清除错误信息
		  errorMsgEle.textContent = '';
			errorMsgEle.classList.add('hidden');
		};

		const nicknameValidatorFunc = () => {  // 添加昵称验证规则
		  const validator = new App.extend.Validator();

			validator.add(nicknameEle, [{  // 验证规则
			  strategy: 'matchingw',  // 验证是否匹配 \w
				errorMsg: '3-12 位，只支持字母、数字、下划线'
		  }, {
			  strategy: 'isNonEmpty',
				errorMsg: '昵称不能为空'
			}, {
				strategy: 'minLength: 3',
				errorMsg: '昵称不能少于 3 位'
			}, {
				strategy: 'maxLength: 12',
				errorMsg: '昵称不能超过 12 位'
			}]);

			const errorMsg = validator.start();  // 验证不通过获取错误信息
			return errorMsg;
		};

		nicknameEle.onfocus = (event) => {  // 昵称获得焦点
			const target = event.target;
			const errorMsgEle = target.nextElementSibling;
			const errorMsg = nicknameValidatorFunc();

			if (!errorMsgEle.classList.contains('hidden')) { return; }
			if (!errorMsg) { return; }

			errorMsgEle.textContent = '3-12 位，只支持字母、数字、下划线';
			errorMsgEle.classList.remove('hidden');
		};

		nicknameEle.onkeyup = (event) => {  // 键盘抬起事件
			const target = event.target;
			const errorMsgEle = target.nextElementSibling;
		  const errorMsg = nicknameValidatorFunc();

			if (errorMsg) {
				renderErrorMsg(errorMsgEle, errorMsg);  // 渲染错误信息
				nextBtn.classList.add('unclickable');  // 下一步按钮不可点击
				return;
			}

			// 与后台通信，验证昵称是否可用
			spa.ajaxRequest(
			  App.urls.origin + 'checkUsername',
				'POST',
				JSON.stringify({ username: nicknameEle.value }),
				'application/json;charset=UTF-8',
				(status, data) => {
				  if (status === 200 && status !== 404) {
						console.log(data);
					  if (data === 'false') {
							renderErrorMsg(errorMsgEle, '该昵称已存在');  // 渲染错误信息
							nextBtn.classList.add('unclickable');
						  return;
						}

						clearErrorMsg(errorMsgEle);  // 清除错误信息
						nextBtn.classList.remove('unclickable');  // 下一步按钮可点击
					}
				}
			);
		};

		nextBtn.onclick = (event) => {
			const isClickable = event.target.classList.contains('unclickable');

			// 判断该按钮能否点击
			if (isClickable) { return; }

			globalCache.userinfo['nickname'] = nicknameEle.value;  // 缓存用户昵称

			$.uriAnchor.setAnchor({
				forum: 'welcome',
				_forum: { register: 'pwd' }
			});
		};

		loginBtn.onclick = () => {  // 登陆按钮点击事件处理程序
		  $.uriAnchor.setAnchor({
			  forum: 'welcome',
				_forum: { login: 'login' }
			});
		};
	};

	let pwd = App.defaultPartial.pwd;
	pwd.partial = 'lib/register/pwd.html';
	pwd.init = () => {
		/**
		 * 该模块为用户注册时，验证用户昵称后加载的设置用户昵称模块，此时，用户
		 * 昵称已缓存全局对象 globalCache 中，
		 * 当用户通过 url 来访问该模块时，应检查用户昵称是否已缓存在 globalCache
		 * 全局对象中。
	  */

		// 判断用户是否有权限访问该模块
		if (globalCache.userinfo.nickname === null) {
			$.uriAnchor.setAnchor({
			  forum: 'home',
				_forum: { tabContent: 'hotQuestion' }
			});
			return;
		}

		// 隐藏登陆模块，显示注册模块
		document.querySelector('.welcome .login').classList.add('hidden');
		document.querySelector('.welcome .register').classList.remove('hidden');


		const rootElement = App.settings.rootElement;
		const pwdEle = rootElement.querySelector('.register-container-pwd input');
		const repwdEle = rootElement.querySelector('.register-container-repwd input');
		const registerBtn = rootElement.querySelector('.register-container-registerBtn button');
		const loginBtn = rootElement.querySelector('.register-loginBtn');
		let stateArr = [];
		let state = {
		  pwdEle: false,
			repwdEle: false
		};

		pwdEle.focus();  // 密码输入框自动获取焦点

		const renderErrorMsg = (errorMsgEle, errorMsg) => {  // 渲染错误信息
			errorMsgEle.textContent = errorMsg;
			errorMsgEle.classList.remove('hidden');
		};

		const clearErrorMsg = (errorMsgEle) => {  // 清除错误信息
			errorMsgEle.textContent = '';
			errorMsgEle.classList.add('hidden');
		};

		const pwdValidatorFunc = () => {  // 添加密码验证规则
			const validator = new App.extend.Validator();

			validator.add(pwdEle, [{
				strategy: 'isNonEmpty',
				errorMsg: '密码不能为空'
			}, {
			  strategy: 'isPwd',
				errorMsg: '8-16 位，支持字母，数字和_-.'
			}]);

			const errorMsg = validator.start();
			return errorMsg;
		};

		const repwdValidatorFunc = () => {  // 确认密码验证规则
			if (pwdEle.value !== repwdEle.value) { return false; }
			return true;
	  };

		pwdEle.onkeyup = (event) => {  // 密码输入框键盘抬起事件
		  const target = event.target;
			const errorMsgEle = target.nextElementSibling;
			const errorMsg = pwdValidatorFunc();

			if (errorMsg) {
			  renderErrorMsg(errorMsgEle, errorMsg);
				state['pwdEle'] = false;  // 缓存状态
				return;
			}

			clearErrorMsg(errorMsgEle);
			state['pwdEle'] = true;
		};

		repwdEle.onkeyup = (event) => {  // 确认密码输入框键盘抬起事件
		  const target = event.target;
			const errorMsgEle = target.nextElementSibling;
			const errorMsg = repwdValidatorFunc();

			if (!errorMsg) {
			  renderErrorMsg(errorMsgEle, '密码不一致');  // 渲染错误信息
				state['repwdEle'] = false;  // 缓存状态
				return;
			}

			clearErrorMsg(errorMsgEle);  // 清除错误信息
			state['repwdEle'] = true;  // 缓存状态
		};

		registerBtn.onclick = (event) => {
		  const target = event.target;
			const errorMsgEle = target.nextElementSibling;
			const errorMsg = '请完善信息';

      stateArr = [];
			for (let key in state) { stateArr.push(state[key]); }

			const isClickable = stateArr.every((item) => {
			  return item === true;
			});

			if (!isClickable) {
				renderErrorMsg(errorMsgEle, errorMsg);  // 渲染错误信息
				return;
			}

			clearErrorMsg(errorMsgEle);  // 清除错误信息

			// 注册信息发送到后台，验证是否注册成功
			spa.ajaxRequest(
			  App.urls.origin + 'register',
				'POST',
				JSON.stringify({
				  email: globalCache.userinfo.email,
					username: globalCache.userinfo.nickname,
					password: pwdEle.value
				}),
				'application/json;charset=UTF-8',
				(status, data) => {
					if (status === 200 & status !== 404) {
						if (data === 'true') {  // 注册成功
							// 注册成功后，弹出提示信息
							const successTip = rootElement.querySelector('.register-container-tips-success');
							successTip.classList.add('active');

							setTimeout(() => {
								// 跳转到登陆模块
								$.uriAnchor.setAnchor({
									forum: 'welcome',
									_forum: { login: 'login' }
								});
							}, 1000);

							return;
						}

						alert('与服务器通讯失败，请重试');
					}
				}
			);
		};

		loginBtn.onclick = () => {  // 登陆按钮点击事件处理程序
		  $.uriAnchor.setAnchor({
			  forum: 'welcome',
				_forum: { login: 'login' }
			});
		};
	};

	let login = App.defaultPartial.login;  // login partial page
	login.partial = 'lib/login/login.html';
	login.init = () => {
		// 根元素
		const rootElement = App.settings.rootElement;
		// 暂不登录按钮
		const touristBtn = rootElement.querySelector('.welcome .login-container-extraInfo-tourist');
		// 忘记密码按钮
		const forgetpwdBtn = rootElement.querySelector('.welcome .login-container-extraInfo-forgetpwd');
		// 注册新用户按钮
		const registerBtn = rootElement.querySelector('.welcome .login-registerBtn');
		// 验证提示元素
		const verificationTipEle = rootElement.querySelector('.login-tips-verification-text');

		// 显示登陆模块隐藏注册模块
		document.querySelector('.welcome .register').classList.add('hidden');
		document.querySelector('.welcome .login').classList.remove('hidden');

		const emailEle = rootElement.querySelector('.login-container-email input');
		const pwdEle = rootElement.querySelector('.login-container-pwd input');
		const loginBtn = rootElement.querySelector('.welcome .login-container-loginBtn');
		const verificationInputEle = rootElement.querySelector('.login-container-verificationCode-input');
		const verificationImg = rootElement.querySelector('.login-container-verificationCode img');
		let stateArr = [];
		let state = {  // 状态
		  emailEle: false,
			pwdEle: false,
			verificationCodeEle: false
		};

		emailEle.focus();  // 邮箱输入框自动获取焦点

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

		const renderErrorMsg = (errorMsgEle, errorMsg) => {  // 渲染错误信息
		  errorMsgEle.textContent = errorMsg;
			errorMsgEle.classList.remove('hidden');
		};

		const clearErrorMsg = (errorMsgEle) => {  // 清除错误信息
		  errorMsgEle.textContent = '';
			errorMsgEle.classList.add('hidden');
		};

		const emailValidatorFunc = () => {  // 邮箱输入框验证规则
			const emailEle = rootElement.querySelector('.login-container-email input');
		  const validator = new App.extend.Validator();

			validator.add(emailEle, [{  // 验证规则
			  strategy: 'isNonEmpty',
				errorMsg: '邮箱不能位空'
			}, {
			  strategy: 'isEmail',
				errorMsg: '邮箱格式有误'
			}]);

			const errorMsg = validator.start();  // 验证不通过时获取错误信息
			return errorMsg;  // 返回错误信息
		};

		const pwdValidatorFunc = () => {  // 密码验证规则
		  const pwdEle = rootElement.querySelector('.login-container-pwd input');
			const validator = new App.extend.Validator();

			validator.add(pwdEle, [{
			  strategy: 'isNonEmpty',
				errorMsg: '密码不能为空'
			}, {
			  strategy: 'isPwd',
				errorMsg: '8-16 位，支持字母，数字和_-.'
			}]);

			const errorMsg = validator.start();
			return errorMsg;
		};

		/********** 事件处理程序 **********/
		emailEle.onkeyup = (event) => {  // 实时监听邮箱输入框
			const target = event.target;
			const errorMsgEle = rootElement.querySelector('.login-container-email-errorMsg');
			const errorMsg = emailValidatorFunc();
			
			if (errorMsg) {
				renderErrorMsg(errorMsgEle, errorMsg);  // 渲染错误信息
				state['emailEle'] = false;  // 缓存状态
				return;
			}

			// 用户邮箱格式无误后，与后台通信，验证用户邮箱是否存在
			spa.ajaxRequest(
			  App.urls.origin + 'checkEmail',
				'POST',
				JSON.stringify({email: emailEle.value}),
				'application/json;charset=UTF-8',
			  (status, data) => {
				  if (status === 200 && status !== 404) {
					  if (data === 'true') {  // 用户邮箱不存在
							renderErrorMsg(errorMsgEle, '该邮箱不存在，请重试');
							state['emailEle'] = false;  // 缓存状态
							return;
						}

						else if (data === 'false') {  // 用户邮箱存在
							clearErrorMsg(errorMsgEle);  // 清除错误信息
							state['emailEle'] = true;  // 缓存状态
							return;
						}

						// 当后台返回的既不是 'true' 又不是 'false' 时，调用预留的回调接口
						else {
							renderErrorMsg(errorMsgEle, '发生未知错误，请重试');
							state['emailEle'] = false;  // 缓存状态
							if (typeof callback === 'function') { callback(status, data); }
						}
					}
				}
			);

			return;
		};

		pwdEle.onkeyup = (event) => {  // 实时监听密码输入框
			const target = event.target;
			const errorMsgEle = rootElement.querySelector('.login-container-pwd-errorMsg');
			const errorMsg = pwdValidatorFunc();

			if (errorMsg) {
				renderErrorMsg(errorMsgEle, errorMsg);  // 渲染错误信息
				state['pwdEle'] = false;  // 缓存状态
				return;
			}

			clearErrorMsg(errorMsgEle);  // 清除错误信息
			state['pwdEle'] = true;  // 缓存状态
		};

		verificationInputEle.onkeyup = (event) => {  // 实时监听图片验证码输入框
		  const target = event.target;
			const errorMsgEle = rootElement.querySelector('.login-container-verificationCode-errorMsg');

			if (target.value.length === 4) {
			  spa.ajaxRequest(
				  App.urls.origin + 'checkVerifyCode',
					'POST',
					JSON.stringify({verifyCode: target.value}),
					'application/json;charset=UTF-8',
					(status, data) => {
						if (status === 200 && status !== 404) {
						  if (data === 'false') {  // 验证码错误
								state['verificationCodeEle'] = false;  // 缓存状态
								// 渲染错误信息
								renderErrorMsg(errorMsgEle, '验证码有误，请重试');
								return;
							} 

							else if (data === 'true') {  // 验证码正确
								state['verificationCodeEle'] = true;  // 缓存状态
								clearErrorMsg(errorMsgEle);
								return;
							}

							// 当返回值既不是 'true' 也不是 'false' 时，可调用预留的回调接口
							else {
							  if (typeof callback === 'function') {
									state['verificationCodeEle'] = false;  // 缓存状态
									renderErrorMsg(errorMsgEle, '出现未知错误，请重试');
								  callback(status, data);
									return;
								}
							}
						}
					}
				);
			}
		};

		verificationImg.onclick = (event) => {  // 切换验证码图片
			const target = event.target;
		  const date = new Date().getTime();
			target.src = 'http://wd.jvziqinggan.com/Forum/getVerifyCode?' + date;
		};

		// 登陆
		loginBtn.onclick = (event) => {  // 登陆按钮点击事件处理程序
			const target = event.target;
			const errorMsgWrapEle = rootElement.querySelector('.login-container-loginErrorMsg-wrap');
			const errorMsgEle = rootElement.querySelector('.login-container-loginBtn-errorMsg');

			stateArr = [];
			for (let key in state) {
			  stateArr.push(state[key]);
			}

			const isClickable = stateArr.every((item) => {
			  return item === true;
			});

			if (!isClickable) {  // 信息不完善或邮箱或密码错误
				renderErrorMsg(errorMsgEle, '请完善登陆信息');

				errorMsgWrapEle.classList.remove('hidden');  // 显示错误信息
				errorMsgEle.classList.add('active');  // 错误信息透明度

				setTimeout(() => {  // 2s 后隐藏错误信息
					errorMsgEle.classList.remove('active');
					errorMsgWrapEle.classList.add('hidden');
				}, 2000);
				return;
			}

			// 将用户登陆时的用户信息发送到后台，判断是否可以登陆
			spa.ajaxRequest(
			  App.urls.origin + 'login',
				'POST',
				JSON.stringify({ email: emailEle.value, password: pwdEle.value }),
				'application/json;charset=UTF-8',
				(status, data) => {
				  if (status === 200 & status !== 404) {
						if (data === '1000') {  // 可以登录
							globalCache.isLogin = true;  // 记录用户登陆状态

							// @TODO 点击登陆按钮后在页面渲染提示信息
							$.uriAnchor.setAnchor({  // 跳转到首页
								forum: 'home',
								_forum: { tabContent: 'hotQuestion' }
							});
							return;
						}

						if (data === '1001') {  // 账号密码正确，但被禁止登陆
							renderErrorMsg(errorMsgEle, '您被禁止登陆！');  // 渲染错误信息

							errorMsgWrapEle.classList.remove('hidden');  // 显示错误信息
							errorMsgEle.classList.add('active');  // 错误信息透明度

							setTimeout(() => {  // 2s 后隐藏错误信息
								errorMsgEle.classList.remove('active');
								errorMsgWrapEle.classList.add('hidden');
							}, 1000);
							return;
						}

						if (data === '1002') {  // 不能登陆，账号或密码错误
							renderErrorMsg(errorMsgEle, '账号或密码错误');  // 渲染错误信息

							errorMsgWrapEle.classList.remove('hidden');  // 显示错误信息
							errorMsgEle.classList.add('active');  // 错误信息透明度

							setTimeout(() => {  // 2s 后隐藏错误信息
								errorMsgEle.classList.remove('active');
								errorMsgWrapEle.classList.add('hidden');
							}, 2000);
							return;
						}
					}
				}
			);

			return;
			// 跳转到首页
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
				_forum: { register: 'email' }
			});
		};
	};


  let home = App.defaultPartial.home;  // default partial page
  home.partial = 'lib/home/home.html';
  home.init = () => {
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

    // 切换标签内容
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
						// 检查用户是否有权限访问该 tab 下的内容
						if (globalCache.isLogin) {
							// 用户登陆后可以加载该 tab 下的内容
							$.uriAnchor.setAnchor({
								forum: 'home', _forum: { tabContent: 'mineQuestion' }
							});
							return;
						}

						// 用户没有登陆的话，不能加载该 tab 下的内容，并提示用户需要先
						// 登录
						alert('请先登陆');

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
		const anchorMap = $.uriAnchor.makeAnchorMap();
    const settings = App.settings;
    const defaultPartial = App.defaultPartial;
    const rootElement = settings.rootElement;
		const tabItemEles = rootElement.querySelectorAll('.tabs-items-group');
		const maskTabItemEles = document.querySelectorAll('.mask .tabs-items-group');
    const tabsContentsItem = rootElement.querySelector('.forum .tabs-contents-item');
		const fullTextEles = rootElement.querySelectorAll('.conversation-question-fullText-para');
		const fullTextBtnEles = rootElement.querySelectorAll('.conversation-question-fullText-btn');
		const viewAndThumbEles = rootElement.querySelectorAll('.viewAndThumb');
		const mentorAnswerEles = rootElement.querySelectorAll('.conversation-answer-mentor');
		const viewMoreEles = rootElement.querySelectorAll('.conversation-more');

		// 切换标签样式
		tabItemEles.forEach((item, index) => {
			// 移除所有标签样式
			for (let i = 0, len = item.children.length; i < len; i++) {
				item.children[i].classList.remove('active');
			}

			// 当前标签添加激活的样式
			if (item.dataset.tag === anchorMap._forum.tabContent) {
				for (let i = 0, len = item.children.length; i < len; i++) {
					item.children[i].classList.add('active');
				}

				return;
			}
		});
		maskTabItemEles.forEach((item, index) => {
			// 移除所有标签样式
			for (let i = 0, len = item.children.length; i < len; i++) {
				item.children[i].classList.remove('active');
			}

			// 当前标签添加激活的样式
			if (item.dataset.tag === anchorMap._forum.tabContent) {
				for (let i = 0, len = item.children.length; i < len; i++) {
					item.children[i].classList.add('active');
				}

				return;
			}
		});

    // @TODO 动态获取数据后再显示
    rootElement.querySelector('.forum .tabs-contents-item')
      .classList.remove('hidden');

    // @TODO 获取后台数据
    spa.ajaxRequest(
			'json/hotq.json', 'GET', '', 'application/json;charset=UTF-8',
			(status, data) => {
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
    const settings = App.settings;
    const rootElement = settings.rootElement;
		const tabItemEles = rootElement.querySelectorAll('.tabs-items-group');
		const maskTabItemEles = document.querySelectorAll('.mask .tabs-items-group');
		const anchorMap = $.uriAnchor.makeAnchorMap();

    spa.render('newestQuestion');

    // @TODO 动态获取数据后再显示
    rootElement.querySelector('.forum .tabs-contents-item')
      .classList.remove('hidden');

		// 切换标签样式
		tabItemEles.forEach((item, index) => {
			// 移除所有标签样式
			for (let i = 0, len = item.children.length; i < len; i++) {
				item.children[i].classList.remove('active');
			}

			// 当前标签添加激活的样式
			if (item.dataset.tag === anchorMap._forum.tabContent) {
				for (let i = 0, len = item.children.length; i < len; i++) {
					item.children[i].classList.add('active');
				}

				return;
			}
		});
		maskTabItemEles.forEach((item, index) => {
			// 移除所有标签样式
			for (let i = 0, len = item.children.length; i < len; i++) {
				item.children[i].classList.remove('active');
			}

			// 当前标签添加激活的样式
			if (item.dataset.tag === anchorMap._forum.tabContent) {
				for (let i = 0, len = item.children.length; i < len; i++) {
					item.children[i].classList.add('active');
				}

				return;
			}
		});
  };

  let mineQuestion = App.defaultPartial.mineQuestion;  // 首页 - 我的提问
  mineQuestion.partial = 'lib/components/tabContents/mineQuestion.html';
  mineQuestion.init = () => {
    const settings = App.settings;
    const rootElement = settings.rootElement;
		const tabItemEles = rootElement.querySelectorAll('.tabs-items-group');
		const maskTabItemEles = document.querySelectorAll('.mask .tabs-items-group');
		const anchorMap = $.uriAnchor.makeAnchorMap();

    spa.render('mineQuestion');

    // @TODO 动态获取数据后再显示
    rootElement.querySelector('.forum .tabs-contents-item')
      .classList.remove('hidden');

		// 切换标签样式
		tabItemEles.forEach((item, index) => {
			// 移除所有标签样式
			for (let i = 0, len = item.children.length; i < len; i++) {
				item.children[i].classList.remove('active');
			}

			// 当前标签添加激活的样式
			if (item.dataset.tag === anchorMap._forum.tabContent) {
				for (let i = 0, len = item.children.length; i < len; i++) {
					item.children[i].classList.add('active');
				}

				return;
			}
		});
		maskTabItemEles.forEach((item, index) => {
			// 移除所有标签样式
			for (let i = 0, len = item.children.length; i < len; i++) {
				item.children[i].classList.remove('active');
			}

			// 当前标签添加激活的样式
			if (item.dataset.tag === anchorMap._forum.tabContent) {
				for (let i = 0, len = item.children.length; i < len; i++) {
					item.children[i].classList.add('active');
				}

				return;
			}
		});
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
			if (!/^1[3|5|8][0-9]{9}$/g.test(value)) { return errorMsg; }
		},
		isEmail (value, errorMsg) {  // 验证是否为邮箱
		  if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/g.test(value)) {
				return errorMsg;
			}
		},
		isPwd (value, errorMsg) {
		  if (!/^[\w\.-]{8,16}$/g.test(value)) { return errorMsg; }
		},
		matchingw (value, errorMsg) {  // 匹配正则中的 \w
		  if (!/^(\w)+$/g.test(value)) { return errorMsg; }
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
