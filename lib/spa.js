/******************** 命名空间 ********************/
let App = {};
App.namespace = (name) => {
  let parts = name.split('.');
  let current = App;
  parts.forEach((item, index) => {
    if (!current[parts[index]]) { current[parts[index]] = {}; }
    current = current[parts[index]];
  });
};
App.namespace('spa');
App.namespace('anchorSchemeMap');
App.namespace('anchorSchemeMapCache.previous');
App.namespace('settings.partialCache');
App.namespace('getPartialData');
App.namespace('extend');
App.result = [];


/******************** 验证 anchorSchemeMap ********************/
let anchorSchemeMap = App.anchorSchemeMap;
anchorSchemeMap.forum = {
	welcome: true,
  home: true,
  notfound: true,
	updating: true,
	mentor: true,
	findpwd: true,
	resetpwd: true,
	topic: true,

	template: true
};
anchorSchemeMap._forum = {
	register: {
		register: true,
		email: true,
		nickname: true,
		pwd: true
	},
  login: { login: true },
	findpwd: { findpwd: true },
  tabContent: {
    welcome: true,
    hotQuestion: true,
    newestQuestion: true,
    mineQuestion: true
  },
	mentor: { mentor: true, mentorItem: true },
	topic: { topic: true },

	template: { tempalte: true }
};


/******************** 主程序 ********************/
let spa = App.spa;
/**
 * 加载错误页面 - 404 页面
 * @func spa.loadingInvalidPage()
*/
spa.loadingInvalidPage = () => {
  let defaultPartial = App.defaultPartial;
  let settings = App.settings;

  spa.ajaxRequest(defaultPartial['notfound'].partial, 'GET', null,
    (status, page404) => {
      settings.rootElement.innerHTML = page404;
      spa.initFunc('notfound');
      return false;
    }
  );
};

spa.changeAnchorMap = () => {
	let anchorMap = $.uriAnchor.makeAnchorMap();
	let anchorSchemeMapCache = App.anchorSchemeMapCache;
	let defaultPartial = App.defaultPartial;
	let settings = App.settings;
	let pageUrl = null;
	let tagUrl = null;
	let tag = null;
	let partial = null;

	for (let key in anchorMap) {
		if (!key.includes('_')) {
			// 验证不通过
			if (!anchorSchemeMap[key]) { return false; }
		}

		// 验证不通过
		if (key.lastIndexOf('_') === 0) { return false; }

		anchorSchemeMapCache.page = anchorMap[key].split(':')[0];
		anchorSchemeMapCache.tag = anchorMap[key].split(':')[1];

		switch (anchorMap[key].split(':').length) {
			// case 1:
				// if (key.indexOf('_')) {
			  //   const pageUrl = defaultPartial[anchorMap[key]].partial;

				// 	spa.ajaxRequest(pageUrl, 'GET', '', (status, page) => {
				// 		if (Object.is(status, 400)) { spa.loadingInvalidPage(); }
				// 		else {
				// 			settings.rootElement.innerHTML = page;
				// 			spa.initFunc(anchorMap[key]);
				// 		}
				// 	});
				// }
				// break;
			case 2:
				if (typeof defaultPartial[anchorSchemeMapCache.page] != 'undefined') {
					pageUrl = defaultPartial[anchorSchemeMapCache.page].partial;
				}

				// page
				spa.ajaxRequest(
					pageUrl,
					'GET',
					'',
					'application/x-www-form-urlencoded',
					(status, page) => {
						if (status === 404) { spa.loadingInvalidPage(); }
						else {
							settings.rootElement.innerHTML = page;
							spa.initFunc(anchorSchemeMapCache.page);
						}
					}
				);

				// partial 
				if (anchorSchemeMapCache.tag.split('|').length === 1) {
					tagName = anchorSchemeMapCache.tag.split(',')[0];
					tagValue = anchorSchemeMapCache.tag.split(',')[1];

					if (typeof defaultPartial[tagValue] != 'undefined') {
						tagUrl = defaultPartial[tagValue].partial;
					}

					spa.ajaxRequest(
						tagUrl, 'GET', '', 'application/x-www-form-urlencoded',
						(status, page) => {
							// 无该页面时，加载 404 页面
							if (status === 404) { spa.loadingInvalidPage(); }

							if (settings.rootElement.querySelector('.' + tagName)) {
								settings.rootElement.querySelector('.' + tagName)
									.innerHTML = page;
								spa.initFunc(tagValue);
							}
						}
					);
				}

				// partial 2 - 该标记用来请求数据用
				if (anchorSchemeMapCache.tag.split('|').length === 2) {
					partial = anchorSchemeMapCache.tag.split('|')[1];
					tagName = partial.split(',')[0];
					tagValue = partial.split(',')[1];

					// @TODO 根据 tagValue 来请求数据
					// spa.getPartialData(tagValue);
					// spa.getPartialData(tagValue);
					console.log('partial 被 | 分割');
				}
				break;
			default:
				break;
		}
	}
};

spa.onHashchange = () => {
  spa.changeAnchorMap();
};

spa.ajaxRequest = (url, method, data, contentType, callback) => {
	let settings = App.settings;
	let xhr = null, anchorMap = null;

	if (settings.partialCache[url]) {
		callback(200, settings.partialCache[url]);
		return false;
	}

	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
		anchorMap = $.uriAnchor.makeAnchorMap();

		xhr.open(method, url, true);

		if (method = 'POST') {
			xhr.setRequestHeader(
				'Content-type', contentType
			);
		}

		// 带凭据的请求
		// 如果不支持 credentials，阻止向下运行
		if ('withCredentials' in xhr) {
		  xhr.withCredentials = true;
		} else {
		  console.log('不支持 credentials！');
			return;
		}

		xhr.send(data);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				switch(xhr.status) {
					case 404:
						url = 'notfound';
						break;
					default:
						for (let key in anchorMap) {
							if (key.indexOf('_')) {
								// 如果请求地址包含 http 不缓存
								if (!url.includes('http')) {
									settings.partialCache[url] = xhr.responseText;
								}
							}
						}
						break;
				}

				// 回调接口
				if (typeof callback === 'function') {
					// xhr.status - 响应状态码
					// xhr.responseText - 接收返回的内容
					callback(xhr.status, xhr.responseText);
				}
			}
		};
	}
	else {
		alert ('Sorry, your browser is too old to tun this app.');
		callback(404, {});
	}
};

// @TODO 暂时用不到这个方法，先不要调用
spa.render = (node, url, callback) => {
  let defaultPartial = App.defaultPartial;
  let settings = App.settings;
  App.callback = callback;

  settings.rootScope = defaultPartial[url];
  // spa.refresh(node, settings.rootScope);
};

// @TODO 该方法有问题，后期优化
spa.refresh = (node, scope) => {
  let children = node.childNodes;
  let dataItem = null;
  let dataRepeat= null;
  let scopeRepeat = null;
  let result = null;

  if (node.nodeType != 3) {
    children.forEach((item, index) => {
      if (item.nodeType != 3 && item.hasAttribute('data-repeat')) {
	dataItem= item.dataset.item;
	dataRepeat = item.dataset.repeat;
	scopeRepeat = scope[dataRepeat];
	scope.data = scopeRepeat;

	item.removeAttribute('data-repeat');

	App.callback(node);
	scopeRepeat.forEach((dataItem, dataIndex) => {
	  item = item.cloneNode(true);
	  node.appendChild(item);

	  // 处理数据
	  spa.refresh(item, scope);
	});

	node.removeChild(children[index]);
      }
      else {
	spa.refresh(item, scope);
      }
    });
  }
  else {
    // App.callback(node);
    return false;
    node.textContent = node.textContent.replace(/\{\{([^}]+)\}\}/gmi, (model) => {
      console.log(model);
    });
    return false;
    let result = spa.feedData(node.textContent, scope);
    // node.textContent = spa.feedData(node.textContent, scope);
    
    //console.log(result);

    // console.log(App.result);
    
    // console.log(result.split(','));
    return false;
    console.log(testNum++);
    return false;
    if (App.result.length ===0) { return false; }
    let test = App.result.filter((item, index, arr) => {
      return arr.indexOf(item) === index;
    });
    console.log(test);
  }
};

// @TODO 该方法有问题，后期优化
spa.feedData = (template, scope) => {
  return false;
  return template.replace(/\{\{([^}]+)\}\}/gmi, (model) => {
    let property = model.substring(2, model.length - 2).split('.')[1];

    if (scope.data) { var result = scope.data; } else { result = scope; }

    if (typeof result === 'object') {
      if (result instanceof Array) {
	result.forEach((data, index) => {
	  // 循环遍历数据(data)，找到 data 下属性名为 property 的值
	  for (let key in data) {
	    if (typeof data[key] === 'string') {
	      if (key === property) { 
		result = data[property];
		App.result.push(result);
	      }
	    } else if (typeof data[key] === 'object') {
	      if (data[key] instanceof Array) {
		spa.feedData(template, data[key]);
	      }
	      else if (typeof data[key] === 'object') {
		spa.feedData(template, data[key]);
	      }
	    }
	  }
	});
      }
      else if (typeof result === 'object') {
	// 循环遍历数据(result)，找到 result 下属性名为 property 的值
	if (result[property]) {
	  result = result[property];
	  App.result.push(result);
	}
      }
    }
    return App.result;
  });
};

spa.initFunc = (partial) => {
  let defaultPartial = App.defaultPartial;
  let fn = defaultPartial[partial].init;
  if (typeof fn === 'function') {
    fn();
  }
};


// 缓存 404 页面
spa.ajaxRequest(
	'lib/404/404.html', 'GET', '', 'application/x-www-form-urlencoded',
	(status, partial) => {
		App.settings.partialCache.notfound = partial;
	}
);

// set anchor map
window.onhashchange = spa.onHashchange;
