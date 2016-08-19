const DOMNodeCollection = require('./dom_node_collection.js');
window.loaded = false;

window.$l = function(arg) {
  let functions = [];
  document.addEventListener("DOMContentLoaded", () => {
    window.loaded = true;
    functions.forEach( (el) => {
      el();
    });
  });
  if (arg.substring) {
    let collection = new DOMNodeCollection(Array.from(document.querySelectorAll(arg)));
    return collection;
  } else if (arg instanceof Function) {
    if (window.loaded === true) {
      arg();
    } else {
      functions.push(arg);
    }
  } else if (arg instanceof Object) {
    let collection = new DOMNodeCollection([arg]);
    return collection;
  }
};

window.$l.extend = function(...obj) {
  var newObj = {};
  for (var i = 0; i < obj.length; i++) {
    for (var attrname in obj[i]) { newObj[attrname] = obj[i][attrname]; }
  }
  return newObj;
};

window.$l.ajax = function(options) {
  let defaults = {
    url: window.location.href,
    method: 'GET',
    data: {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: () => {},
    error: () => {},
  };
  options = window.$l.extend(defaults, options);
  const xhr = new XMLHttpRequest();
  xhr.open(options["method"], options["url"]);
  xhr.onload = function () {
    if (xhr.status === 200) {
      options.success(xhr.response);
    } else {
      options.error(xhr.response);
    }
  };
  xhr.setRequestHeader("Content-Type", options.contentType);
  xhr.send(options.data);
};
