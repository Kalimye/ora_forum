/*
 * app.shell.js
*/

/*jslint        browser: true, continue: true,
  devel: true,  indent: 2,     maxerr: 50,
  newcap: true  nomen: true,   plusplus: true,
  regexp: true, sloppy: true, vars: false,
  white: true
*/

app.shell = (function() {
  /**
   * 动态创建命名空间
   * @func App.namespace
  */
  const App = {};
  App.namespace = function(name) {
    let parts = name.split('.');
    let current = App;
    for (let i = 0, len = parts.length; i < len; i++) {
      if (!current[parts[i]]) { current[parts[i]] = {}; }
      current = current[parts[i]];
    }
  };

  const configMap = {
    anchor_schema_map: {
      page: true,
      _page: {
	label: {
	  welcome: true,
	  hot: true,
	  newest: true,
	  mine: true
	}
      }
    }
  };

  const stateMap = { container: null };
  const selectorMap = {};

  const setSelectorMap = function() {
  };

  const onHashchange = function(arg_map, callback) {
    if (callback) { callback(arg_map); }

    forum.changeAnchorPart();
  };

  const initModule = function(container) {
    const forum_ele = container.querySelector('.forum');

    $.uriAnchor.configModule({schema_map: configMap.anchor_schema_map});

    forum.initModule(forum_ele, App);

    for (let key in $.uriAnchor.makeAnchorMap()) {
      if (!key) {
        console.log('not');
      }
    }

    $(window)
      .bind('hashchange', onHashchange)
      .trigger('hashchange');
  };

  return { initModule: initModule };
}());
