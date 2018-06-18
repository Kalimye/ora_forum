/*
 * templates.js
 * 页面模板
*/

/*jslint        browser: true, continue: true,
  devel: true,  indent: 2,     maxerr: 50,
  newcap: true  nomen: true,   plusplus: true,
  regexp: true, sloppy: true, vars: false,
  white: true
*/

const templates = (() => {
  /**
   * 动态创建 热门提问 DOM 元素
   * @func [createHotQuestionEle]
   * @return [element] - 返回创建好的虚拟 DOM
  */
  let createHotQuestionEle = (() => {
    let
      user = widgets.createEle('div.user'),
      userContent = widgets.createEle('div.user-content'),
      userContentUsernameTopic = widgets.createEle('div.user-content-username_topic'),
      userContentTopic = widgets.createEle('span.user-content-topic'),
      userContentDateTime = widgets.createEle('div.user-content-date_time'),
      userContentQuestion = widgets.createEle('div.user-content-question'),
      userContentReply = widgets.createEle('div.user-content-reply'),
      userContentReplyMentor = widgets.createEle('div.user-content-reply-mentor')
    ;

    user.appendChild(widgets.createEle('span.user-avatar'));
    user.appendChild(userContent);

    userContent.appendChild(widgets.createEle('span.user-content-username'));
    userContent.appendChild(userContentTopic);
    userContent.appendChild(userContentDateTime);
    userContent.appendChild(userContentQuestion);
    userContent.appendChild(userContentReply);

    userContentTopic.appendChild(widgets.createEle('i.topic-icon'));
    userContentTopic.appendChild(widgets.createEle('span.topic-text'));
    userContentDateTime.appendChild(widgets.createEle('span.user-content-date'));
    userContentDateTime.appendChild(widgets.createEle('span.user-content-time'));
    userContentQuestion.appendChild(widgets.createEle('p.text-justify'));
    userContentQuestion.appendChild(widgets.createEle('p.user-content-question-full'));
    userContent.querySelector('p.user-content-question-full').classList.add('hidden');
    userContentReply.appendChild(userContentReplyMentor);
    userContentReplyMentor.append(widgets.createEle('span.user-content-reply-mentor-name'));
    userContentReplyMentor.append(widgets.createEle('p.user-content-reply-mentor-content'));

    App.elements.index.hotQuestionEle = [];
    App.elements.index.hotQuestionEle.push(user);
  })();

  /**
   * 滑动到页面底部时，动态创建 loading
   * @func loadingEle
   * @returns {elements} loading 元素
  */
  const loading = (() => {
    const loadingEle = widgets.createEle('div.loading');
    const loadingEleIcon = widgets.createEle('div.loading-icon');
    const loadingEleText = widgets.createEle('div.loading-text');

    loadingEle.appendChild(loadingEleIcon);
    loadingEle.appendChild(loadingEleText);

    loadingEleIcon.textContent = 'X';
    loadingEleText.textContent = 'loading...';

    return loadingEle;
  })();
})();
