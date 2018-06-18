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
  /**
   * 缓存 DOM 元素
   * @func setSelectorMap
  */
  let setSelectorMap = function() {
    // 用来缓存 DOM 元素的对象
    let selectorMap = App.configMap.selectorMap;
    let forum = selectorMap.forum;
    selectorMap.hotTopic = forum.querySelector('.forum .hotTopic');
    selectorMap.tab = forum.querySelector('.tabs .tabs-items');
    selectorMap.tabContent = forum.querySelector('.tabs .tabs-contents');
    selectorMap.tabContentItems = forum.querySelectorAll('.tabs .tabs-contents-item');

    selectorMap.mask = document.querySelector('.mask');
    selectorMap.maskTab = selectorMap.mask.querySelector('.tabs');
  };

  /**
   * 专业导师部分轮播
   * @func professionalMentors
  */
  let professionalMentors = new Swiper('.mentors .swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 15,
    slidesOffsetBefore: 15,
    freeMode: true
  });
  
  /**
   * 实时监听滚动条
   * @func watchScroll
  */
  let watchScroll = function() {
    return function() {
      const {root} = App.configMap.selectorMap;
      App.scrollPosMap.root = root.scrollTop;

      widgets.getPageInfo();

      setTabPosition();
      
      return false;

      // 设置 tab 是否固定
      toggleTabFixed();

      toggleLabelContent.toggleContentItemsScroll();
    }
  };

  /**
   * 设置 tab 固定
   * @func setTabPosition
  */
  let setTabPosition = () => {
    const {root} = App.scrollPosMap;
    const {tab, tabContent, tabContentItems, maskTab} = App.configMap.selectorMap;

    const tabHeight = tab.offsetHeight,
	  tabOffsetTop = tab.offsetTop,
	  tabContentOffsetTop = tabContent.offsetTop;

    if (root >= tabOffsetTop) {
      maskTab.classList.remove('hidden');
      setTabContentItemsScroll.scroll();
      return false;
    }

    if (root <= tabOffsetTop) {
      maskTab.classList.add('hidden');
      setTabContentItemsScroll.hidden();
      return false;
    }

  };

  /**
   * 使 tabContentItems 可滚动
   * @func setTabContentItemsScroll
  */
  let setTabContentItemsScroll = {
    init() {
      const {tabContentItems} = App.configMap.selectorMap;
      tabContentItems.forEach((item) => {
        item.classList.add('scroll');
	item.style.overflowY = 'hidden';
      });
    },

    scroll() {
      const {tabContentItems, tab} = App.configMap.selectorMap;
      tabContentItems.forEach((item) => {
	item.classList.add('scroll');
	item.style.height = widgets.getPageInfo().pageHeight - tab.offsetHeight + 'px';
	item.style.overflowY = 'scroll';
      });
    },

    hidden() {
      const {tabContentItems} = App.configMap.selectorMap;
      tabContentItems.forEach((item) => {
	item.classList.remove('scroll');
	item.style.overflowY = 'hidden';
      });
    }
  };

  /**
   * 切换标签
   * @func toggleLabelContent
  */
  let toggleLabelContent = {
    watchAnchor: function() {
      let label;
      let current = toggleLabelContent;
      let scrollPos = App.scrollPosMap.scrollPos;
      let selectorMap = App.configMap.selectorMap;
      let tab = selectorMap.tab;
      let tabContent = selectorMap.tabContent;
      let tabContentItems = selectorMap.tabContentItems;
      let tabItemEleArr = [];
      let tabItemIndexArr = [];
      const {maskTab} = selectorMap;
      let maskTabItemEleArr = [];
      let maskTabItemIndexArr = [];

      if (!$.uriAnchor.makeAnchorMap()._page) {
        return false;
      }

      label = $.uriAnchor.makeAnchorMap()._page.label;

      tab.querySelectorAll('.tabs-items-group')
	.forEach(function(item, index) {
	  tabItemEleArr.push(item);
	  tabItemIndexArr.push(index);
	});

      maskTab.querySelectorAll('.tabs-items-group')
        .forEach((item, index) => {
	  maskTabItemEleArr.push(item);
	  maskTabItemIndexArr.push(index);
	});

      switch(label) {
	case 'hot':
	  current.execute.call(tabItemEleArr[0], {
	    index: tabItemIndexArr[0],
	    tabContent: tabContent
	  });
	  current.execute.call(maskTabItemEleArr[0], {
	    index: maskTabItemIndexArr[0],
	    tabContent: tabContent
	  });
	  break;
	case 'newest':
	  current.execute.call(tabItemEleArr[1], {
	    index: tabItemIndexArr[1],
	    tabContent: tabContent
	  });
	  current.execute.call(maskTabItemEleArr[1], {
	    index: maskTabItemIndexArr[1],
	    tabContent: tabContent
	  });
	  break;
	case 'mine':
	  current.execute.call(tabItemEleArr[2], {
	    index: tabItemIndexArr[2],
	    tabContent: tabContent
	  });
	  current.execute.call(maskTabItemEleArr[2], {
	    index: maskTabItemIndexArr[2],
	    tabContent: tabContent
	  });
	  break;
	default:
	  break
      }
    },

    execute: function(obj) {
      let index = obj.index;
      let parentElement = this.parentElement;
      let labelClassName = this.className;
      let labels = parentElement.querySelectorAll('.' + labelClassName);
      let current = toggleLabelContent;

      current.normalLabelStyle.apply(this, labels);
      current.activeLabelStyle.call(this);

      current.toggleContentItems(obj);
    },

    activeLabelStyle: function() {
      this.querySelectorAll('span').forEach(function(item) {
        item.classList.add('active');
      });
    },

    normalLabelStyle: function() {
      for (let i = 0, len = arguments.length; i < len; i++) {
	arguments[i].querySelectorAll('span').forEach(function(item) {
	  item.classList.remove('active');
	});
      }
    },

    toggleContentItems(...keys) {
      const obj = keys[0];
      const selectorMap = App.configMap.selectorMap;
      const tabContentItems = selectorMap.tabContentItems;
      const pageWidth = widgets.getPageInfo().pageWidth;
      let itemsArr = [];  // 索引集合
      let removedIndex = null;
      let restIndexes = null
      
      // 获取索引集合
      tabContentItems.forEach((item, index) => {
	itemsArr.push(index);
      });

      removedIndex = itemsArr.splice(obj.index, 1);
      restIndexes = itemsArr.reverse();

      tabContentItems[removedIndex.toString()].style.left = 0;
      tabContentItems[removedIndex].classList.remove('hidden');

      restIndexes.forEach((item, index) => {
        tabContentItems[item].style.left = pageWidth * (index + 1) + 'px';
	tabContentItems[item].classList.add('hidden');
      });
    },

    toggleContentItemsScroll () {
      const selectorMap = App.configMap.selectorMap;
      const tab = selectorMap.tab;
      const tabContentItems = selectorMap.tabContentItems;
      const tabHeight = tab.offsetHeight;
      const tabOffsetTop = tab.offsetTop;
      const pageHeight = App.pageInfo.pageHeight;

      if (Object.is(tabOffsetTop, 0)) {
        tabContentItems.forEach((item) => {
	  item.style.overflowY = 'scroll';
	});
      } else {
	tabContentItems.forEach((item) => {
	  item.style.overflowY = 'hidden';
	});
      }
    }
  };

  /**
   * @TODO 当使 tabContentItem 水平摆放后，修改这段函数
   * 当切换标签后，重定向滚动条位置
   * @func redirectScrollPos
  */
  let redirectScrollPos = function() {
    let selectorMap = App.configMap.selectorMap;
    let tab = selectorMap.tab;
    let tabContent = selectorMap.tabContent;
    let scrollPos = App.scrollPosMap.scrollPos;

    // 初次加载 tabContent
    if (scrollPos >= tab.offsetTop) {
      if (document.documentElement.scrollTop) {
	document.documentElement.scrollTop = tabContent.offsetTop;
      } else {
	document.body.scrollTop = tabContent.offsetTop;
      }
    }
  };

  const toggleLoadingEle = {
    execute() {
      const {root, tabContentItems} = App.configMap.selectorMap;
      const {pageHeight, pageWidth} = App.pageInfo;
      root.onscroll = watchScroll();
      tabContentItems.forEach((item) => {
	item.onscroll = () => {
	  console.log(item.scrollTop, item.getBoundingClientRect());
	};
      });
    },

    show() {},

    hide() {}
  };

  /**
   * 监听并更新 uri
   * @func changeAnchorPart
  */
  let changeAnchorPart = function() {
    // 监听 uri ，动态切换 tab
    toggleLabelContent.watchAnchor();

    // 切换标签后，重新设置页面滚动条位置
    // redirectScrollPos();
  };


  /**
   * 点击事件处理程序
   * @func onClick
  */
  let onClick = function() {
    let selectorMap = App.configMap.selectorMap;
    
    // 点击 热门提问、最新提问、我的提问 标签
    selectorMap.tab.querySelectorAll('.tabs-items-group')
      .forEach(function(item, index) {
	item.onclick = function() {
	  let dataTag = item.getAttribute('data-tag');

	  $.uriAnchor.setAnchor({
	    page: 'qa',
	    _page: {
	      label: dataTag
	    }
	  });
	};
      });

    selectorMap.maskTab.querySelectorAll('.tabs-items-group')
      .forEach((item, index) => {
        item.onclick = () => {
	  let dataTag = item.getAttribute('data-tag');

	  $.uriAnchor.setAnchor({
	    page: 'qa',
	    _page: {
	      label: dataTag
	    }
	  });
	};
      });
  };

  /**
   * 模块初始化
   * @func initModule
  */
  let initModule = function(container) {
    App.configMap.selectorMap.forum = container;

    setSelectorMap();
    widgets.getPageInfo();
    setTabContentItemsScroll.init();
    toggleLoadingEle.execute();
    onClick();

    /*************** test area ***************/
    ajax.getHotQuestionData({
      type: 'get',
      url: '../json/hotq.json',
      callback: function() {
	const {hotQuestion} = App.dataMap.index;
      }
    });
  };

  return { initModule, changeAnchorPart };
}());
