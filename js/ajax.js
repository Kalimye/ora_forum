/*
 * ajax.js
 * Root namespace module
*/

/*jslint        browser: true, continue: true,
  devel: true,  indent: 2,     maxerr: 50,
  newcap: true  nomen: true,   plusplus: true,
  regexp: true, sloppy: true, vars: false,
  white: true
*/

ajax = (function() {
  let count = 0;

  const urls = {
    index: {
      hotQuestion: '../json/hotq.json',
      newestQuestion: '',
      mineQuestion: ''
    }
  };

  const index = {
    getHotQuestionData: function() {
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
	if (xhr.readyState === 4) {
	  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
	    const data = JSON.parse(xhr.responseText);
	    App.dataMap.index.hotQuestion = {
	      count: count,
	      length: data.length,
	      data: data
	    };
	  } else {
	    console.log('Request was unsuccessful: ' + xhr.status);
	  }
	}
      };

      xhr.open('GET', urls.index.hotQuestion, true);
      xhr.send(null);
    },

    getNewestQuestionData: function() {},

    getMineQuestionData: function() {}
  };

  return {
    getHotQuestionData: index.getHotQuestionData,
    getNewestQuestionData: index.getNewestQuestionData,
    getMineQuestionData: index.getMineQuestionData
  };
}());
