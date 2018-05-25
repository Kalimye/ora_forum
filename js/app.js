/*
 * app.js
 * Root namespace module
*/

/*jslint        browser: true, continue: true,
  devel: true,  indent: 2,     maxerr: 50,
  newcap: true  nomen: true,   plusplus: true,
  regexp: true, sloppy: true, vars: false,
  white: true
*/

var app = (function() {
  var initModule = function(container) {
    App.configMap.selectorMap.root = document.querySelector('#root');
    app.shell.initModule(container);
  };

  return {
    initModule: initModule
  };
}());

/*
 * 账号：（动态验证）
 *   1. 6-16 位
 *   2. 只支持英文和数字
 * 密码：
 *   1. 6-16
 *   2. 没有其他限制了。。。
 * 昵称：无限制（动态验证）
 * 性别：单选（选择之后无法更改）
 * 邮箱：邮箱格式验证（可选）
 * 手机号：手机号格式验证（可选）
*/
