/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(array) {
	    this.htmlElements = array;
	  }
	  html(str) {
	    if (str === undefined) {
	      return this.htmlElements[0].innerHTML;
	    } else {
	      for (var i = 0; i < this.htmlElements.length; i++) {
	        this.htmlElements[i].innerHTML = str;
	      }
	    }
	  }

	  empty() {
	    for (var i = 0; i < this.htmlElements.length; i++) {
	      this.htmlElements[i].innerHTML = "";
	    }
	  }

	  length() {
	    return this.htmlElements.length;
	  }

	  append(arg) {
	    if (arg instanceof DOMNodeCollection) {
	      for (let i = 0; i < this.htmlElements.length; i++) {
	        for (let j = 0; j < arg.length(); j++) {
	          this.htmlElements[i].innerHTML += arg.htmlElements[j].outerHTML;
	        }
	      }
	    } else if (arg.substring) {
	      for (let i = 0; i < this.htmlElements.length; i++) {
	        this.htmlElements[i].innerHTML += arg;
	      }
	    } else if (arg instanceof Object) {
	      for (let i = 0; i < this.htmlElements.length; i++) {
	        this.htmlElements[i].innerHTML += arg.outerHTML;
	      }
	    } else {
	      console.log("wtf");
	    }
	  }

	  attr(atr, val) {
	    if (val === undefined) {
	      return this.htmlElements[0].getAttribute(atr);
	    } else {
	      for (let i = 0; i < this.length(); i++) {
	        this.htmlElements[i].setAttribute(atr,val);
	      }
	    }
	  }

	  addClass(className) {
	    for (let i = 0; i < this.length(); i++) {
	      this.htmlElements[i].className += ` ${className}`;
	    }
	  }

	  removeClass(className) {
	    Array.prototype.diff = function(a) {
	      return this.filter(function(i) {return a.indexOf(i) < 0;});
	    };

	    if (className === undefined) {
	      for (let i = 0; i < this.length(); i++) {
	        this.htmlElements[i].className = "";
	      }
	    } else {
	      for (let i = 0; i < this.length(); i++) {
	        let classes = this.htmlElements[i].className.split(' ');
	        let rClasses = className.split(' ');
	        let newClasses = classes.diff(rClasses);
	        newClasses = newClasses.join(' ');
	        this.htmlElements[i].className = newClasses;
	      }
	    }
	  }

	  children() {
	    let allChildren = [];
	    for (var i = 0; i < this.length(); i++) {
	      allChildren = allChildren.concat(Array.from(this.htmlElements[i].children));
	    }
	    allChildren = new DOMNodeCollection(allChildren);
	    return allChildren;
	  }

	  parent() {
	    let allParents = [];
	    for (var i = 0; i < this.length(); i++) {
	      allParents.push(this.htmlElements[i].parentNode);
	    }
	    allParents = new DOMNodeCollection(allParents);
	    return allParents;
	  }

	  find(arg) {
	    let elements = [];
	    for (var i = 0; i < this.length(); i++) {
	      elements = elements.concat(Array.from(this.htmlElements[i].querySelectorAll(arg)));
	    }
	    elements = new DOMNodeCollection(elements);
	    return elements;
	  }

	  remove() {
	    for (var i = 0; i < this.htmlElements.length; i++) {
	      this.htmlElements[i].outerHTML = "";
	    }
	    this.htmlElements = [];
	  }

	  on($event, callback) {
	    this.htmlElements.forEach( (element) => {
	      element.addEventListener($event,callback);
	    });
	  }

	  off($event,callback) {
	    this.htmlElements.forEach( (element) => {
	      element.removeEventListener($event,callback);
	    });
	  }
	}



	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);