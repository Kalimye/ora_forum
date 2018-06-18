app.address = (function() {
  let getAddress = function() {
    return {
      getHotQuestion: '/forum/json/hotq.json'
    };
  };

  return {
    getAddress: getAddress
  };
}());
