/*
 * forum.js
 * Root namespace module
*/

/*jslint        browser: true, continue: true,
  devel: true,  indent: 2,     maxerr: 50,
  newcap: true  nomen: true,   plusplus: true,
  regexp: true, sloppy: true, vars: false,
  white: true
*/

let forum = (function() {
  let
    App, createEle, watchScroll, getScrollPos, scrollPos, 
    hideQuestionContent, toggleMentorAnswer, onClick, initModule;

  const tabItems = document.querySelectorAll('.forum .tabs-items-group');
  const userQuestionContents = document.querySelectorAll('.forum .user-content-question p:first-child');
  const userContentQuestionFull = document.querySelectorAll('.user-content-question-full');
  const userContentReplyBtn = document.querySelectorAll('.forum .user-content-reply-all');

  // 动态创建命名空间
  App = {};
  App.namespace = function(name) {
    let parts = name.split('.');
    let current = App;
    for (let i = 0, len = parts.length; i < len; i++) {
      if (!current[parts[i]]) { current[parts[i]] = {}; }
      current = current[parts[i]];
    }
  };
  App.namespace('config');
  App.namespace('html');
  App.namespace('config.scroll_pos');
  App.config.scroll_pos.index = {
    hot: 0, newest: 0, mine: 0
  };

  /**
   * 动态创建 DOM 元素
  */
  createEle= function(ele) {
    let html, parts;

    if (ele.includes('.')) {
      parts = ele.split('.');
      html = document.createElement(parts[0]);
      html.className = parts[1];
      return html;
    }

    if (ele.includes('#')) {
      parts = ele.split('#');
      html = document.createElement(parts[0]);
      html.id = parts[1];
      return html;
    }
  };

  let setScrollPos = function(arg_map) {
  };

  let toggleTabsAndTabsContents = (arg_map) => {
    const tabs = document.querySelector('.forum .tabs'),
      tabsItems = tabs.querySelector('.tabs-items'),
      tabsItemsHeight = tabsItems.getBoundingClientRect().height,
      tabsContents = tabs.querySelector('.tabs-contents');

    let scrollTop = arg_map.scrollTop;

    if (tabs.offsetTop <= scrollTop) {
      tabsItems.classList.add('fixed');
      tabsContents.style.paddingTop = tabsItemsHeight+ 'px';
    } 

    if (tabsContents.getBoundingClientRect().top >= 0) {
      tabsItems.classList.remove('fixed');
      tabsContents.style.paddingTop = 0;
    }
  };

  watchScroll = function() {
    return function(event) {

      let scrollTop = document.documentElement.scrollTop ||
	              document.body.scrollTop;
      let label = $.uriAnchor.makeAnchorMap()._page.label;

      toggleTabsAndTabsContents({scrollTop: scrollTop});

      App.config.scroll_pos.index[label] = 
	App.config.scroll_pos.index._scrollTop = scrollTop;

      console.log(App.config.scroll_pos.index);

      return scrollTop;
    }
  };

  let mentorsSwiper = new Swiper('.mentors .swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 15,
    slidesOffsetBefore: 15,
    freeMode: true
  });

  /******** 热门提问 ********/
  const hotTopics = {
    execute: function(index, callback) {
      hotTopicsSwiper.slideTo(index, 300, true);
      if (callback) { callback(); }
    },

    // 默认的标签样式
    normalStyle: function(ele_obj) {
      for (const key in ele_obj) {
        ele_obj[key].forEach(function(item) {
	  item.classList.remove('active');
	});
      }
    },

    // 激活的标签样式
    activeStyle: function(eles) {
      eles.forEach(function(item) {
        item.classList.add('active');
      });
    },

    // 设置标签样式
    setStyle: function(ele_obj) {
      let
        current = hotTopics,
	// 获取当前被点击的标签下的所有 span 标签
        activeEleChildren = ele_obj.activeEle.querySelectorAll('span')
      ;

      // 设置标签的默认样式
      current.normalStyle({
	activeText: ele_obj.activeText,  // 标签的文字部分
	activeLine: ele_obj.activeLine   // 标签中的下划线
      });
      current.activeStyle(activeEleChildren);
    }
  };

  let hotTopicsSwiper = new Swiper('.tabs .swiper-container', {
    autoHeight: true,
    on: {
      slideChangeTransitionEnd: function(event) {
	let
	  // 获取当前被单击的标签
	  activeEle = tabItems[this.activeIndex],
	  // 获取所有标签中的文字元素
	  activeText = document
	                 .querySelectorAll('.forum .tabs-items-group-text'),
	  // 获取所有标签中的下划线元素
	  activeLine = document
	                 .querySelectorAll('.forum .tabs-items-group-line')
	  scrollPosMap = App.config.scroll_pos.index,
	  dataTag = activeEle.getAttribute('data-tag')
	;

	// 设置标签样式
	hotTopics.setStyle({
	  activeEle: activeEle,
	  activeText: activeText,
	  activeLine: activeLine
	});

	// document.documentElement.scrollTop = scrollPosMap[dataTag];
	// document.documentElement.scrollTop = scrollPosMap[dataTag];
      }
    }
  });
  

  /**
   * 动态创建 热门提问 DOM 元素
   * @func [createHotQuestionEle]
   * @return [element] - 返回创建好的虚拟 DOM
  */
  let createHotQuestionEle = function() {
    let
      user = createEle('div.user'),
      userContent = createEle('div.user-content'),
      userContentUsernameTopic = createEle('div.user-content-username_topic'),
      userContentTopic = createEle('span.user-content-topic'),
      userContentDateTime = createEle('div.user-content-date_time'),
      userContentQuestion = createEle('div.user-content-question'),
      userContentReply = createEle('div.user-content-reply'),
      userContentReplyMentor = createEle('div.user-content-reply-mentor')
    ;

    user.appendChild(createEle('span.user-avatar'));
    user.appendChild(userContent);

    userContent.appendChild(createEle('span.user-content-username'));
    userContent.appendChild(userContentTopic);
    userContent.appendChild(userContentDateTime);
    userContent.appendChild(userContentQuestion);
    userContent.appendChild(userContentReply);

    userContentTopic.appendChild(createEle('i.topic-icon'));
    userContentTopic.appendChild(createEle('span.topic-text'));
    userContentDateTime.appendChild(createEle('span.user-content-date'));
    userContentDateTime.appendChild(createEle('span.user-content-time'));
    userContentQuestion.appendChild(createEle('p.text-justify'));
    userContentQuestion.appendChild(createEle('p.user-content-question-full'));
    userContent.querySelector('p.user-content-question-full').classList.add('hidden');
    userContentReply.appendChild(userContentReplyMentor);
    userContentReplyMentor.append(createEle('span.user-content-reply-mentor-name'));
    userContentReplyMentor.append(createEle('p.user-content-reply-mentor-content'));

    return user;
  };
  
  /**
   * 当用户提问的内容超出指定字符数时，隐藏超出部分并显示“全文”按钮
   * 当用户提问的内容未超出指定字符数时，默认显示全文并隐藏“全文”按钮
   * @func [hideQuestionContent]
   * @param [NodeList] - 所有用户提问的内容
  */
  hideQuestionContent = function(eles) {
    eles.forEach(function(item) {
      if (item.textContent.length > 80) {
	item.classList.add('text-hidden');
	item.nextElementSibling.classList.remove('hidden');
      } else {
        item.classList.remove('text-hidden');
	item.nextElementSibling.classList.add('hidden');
      }
    });
  };


  toggleMentorAnswer = function(ele, state) {
    if (state.extend) {
      ele.parentElement.querySelectorAll('.user-content-reply-mentor')
	.forEach(function(item) {
	  item.classList.remove('hidden');
	});
      ele.querySelector('.user-content-reply-all-text')
	.textContent = '收起';
    } else {
      ele.parentElement.querySelectorAll('.user-content-reply-mentor')
        .forEach(function(item, index) {
	  if (index + 3 > ele.parentElement.querySelectorAll('.user-content-reply-mentor').length) { return false; }
	  ele.classList.remove('extend');
	  ele.parentElement.querySelectorAll('.user-content-reply-mentor')[index + 2]
	    .classList.add('hidden');
	  ele.querySelector('.user-content-reply-all-text')
	    .textContent  = '展开全部';
	});
    }
  };


  // 点击事件处理程序
  onClick = function() {
    // 标签按钮
    tabItems.forEach(function(item, index) {
      item.onclick = function() {
	let dataTag = item.getAttribute('data-tag');
	let scrollPosMap = App.config.scroll_pos.index;
	$.uriAnchor.setAnchor({
	  page: 'qa',
	  _page: {
	    label: dataTag
	  }
	});

	document.documentElement.scrollTop = scrollPosMap[dataTag];

	hotTopics.execute(index);
      };
    });

    // 显示全文
    userContentQuestionFull.forEach(function(item) {
      item.onclick = function() {
	item.previousElementSibling.classList.remove('text-hidden');
	item.classList.add('hidden');
      };
    });

    // 展开全部导师评论
    userContentReplyBtn.forEach(function(item) {
      item.onclick = function() {
	if (!item.classList.contains('extend')) {
	  toggleMentorAnswer(item, {extend: true});
	  item.classList.add('extend');
	  item.querySelector('.user-content-reply-all-icon').classList.add('rotate');
	  hotTopicsSwiper.update();
	} else {
	  toggleMentorAnswer(item, {extend: false});
	  item.classList.remove('extend');
	  item.querySelector('.user-content-reply-all-icon').classList.remove('rotate');
	  hotTopicsSwiper.update();
	}
      };
    });
  };

  // 初始化
  initModule = function(container) {
    App.config.address = app.address.getAddress();

    $.uriAnchor.setAnchor({
      page: 'qa',
      _page: {
        label: 'hot'
      }
    });

    createHotQuestionEle();

    window.onscroll = watchScroll(event);
    onClick();

    hideQuestionContent(userQuestionContents);

  };

  return { initModule: initModule };
}());
