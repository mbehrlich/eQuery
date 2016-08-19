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
