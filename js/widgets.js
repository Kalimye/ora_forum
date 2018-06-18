/*
 * widgets.js
 * 组件
*/

/*jslint        browser: true, continue: true,
  devel: true,  indent: 2,     maxerr: 50,
  newcap: true  nomen: true,   plusplus: true,
  regexp: true, sloppy: true, vars: false,
  white: true
*/

let widgets = (() => {
  /**
   * 动态创建 dom 元素
   * @func createEle
  */
  const createEle= (ele) => {
    let html, parts;

    const isClassSymbol = /\./g.test(ele);
    const isIdSymbol = /#/g.test(ele); 

    // 创建带有类名的元素
    if (isClassSymbol) {
      parts = ele.split('.');
      html = document.createElement(parts[0]);
      html.className = parts[1];
      return html;
    }

    // 创建带有 ID 名的元素
    if (isIdSymbol) {
      parts = ele.split('#');
      html = document.createElement(parts[0]);
      html.id = parts[1];
      return html;
    }

    return document.createElement(ele);
  };

  /**
   * 获取页面信息
   * @func getPageInfo
   * returns {obj} pageWidth - 页面宽度
   * returns {obj} pageHeight - 页面高度
  */
  const getPageInfo = () => {
    let pageWidth = window.innerWidth; 
    let pageHeight = window.innerHeight;

    if (typeof pageWidth != 'number') {
      if (document.compatMod == 'CSS1Compat') {
        pageWidth = document.documentElement.clientWidth;
	pageHeight = document.documentElement.clientHeight;
      } else {
        pageWidth = document.body.clientWidth;
	pageHeight = document.body.clientHeight;
      }
    }

    App.pageInfo.pageWidth = pageWidth;
    App.pageInfo.pageHeight = pageHeight;

    return { pageWidth, pageHeight };
  };

  /**
   * 当滑动到页面底部时，动态创建 loading 元素
   * @func loadingEle
  */
  const loadingEle = (() => {
    const loadingEle = createEle('div.loading');
    const loadingEleIcon = createEle('div.loading-icon');
    const loadingEleText = createEle('div.loading-text');

    loadingEle.appendChild(loadingEleIcon);
    loadingEle.appendChild(loadingEleText);

    App.elements.loading = loadingEle;
  })();
  
  /**
   * 初始化
   * @func initModule
  */
  let initModule = () => {
    console.log('widgets');
  };

  return {createEle, getPageInfo, initModule};
})();
