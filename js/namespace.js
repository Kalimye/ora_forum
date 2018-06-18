(function() {
  let App = {};
  App.namespace = function(name) {
    let parts = name.split('.');
    let current = App;
    for (let i = 0, len = parts.length; i < len; i++) {
      if (!current[parts[i]]) { current[parts[i]] = {}; }
      current = current[parts[i]];
    }
  };

  App.namespace('spa');
  App.namespace('partialCache');
  App.namespace('configMap.selectorMap');
  App.namespace('scrollPosMap.index');
  App.namespace('eventMap.toggleTabMap');
  App.namespace('dataMap.index');
  App.namespace('pageInfo');
  App.namespace('elements.index');
  
  window.App = App;
}());
