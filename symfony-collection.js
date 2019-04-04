const body = document.querySelector('body');
const config = { childList: true, subtree: true };

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      Collection.searchCollections(node);
    });
    mutation.removedNodes.forEach((node) => {
      Collection.removeCollections(node);
    })
  });
});

observer.observe(body, config);

class Collection {
  constructor(collectionElement) {
    if(!Collection.has(collectionElement)){
      this.init = this.init.bind(this);
      this._addEventListeners = this._addEventListeners.bind(this);
      this.add = this.add.bind(this);
      this.generateNewElement = this.generateNewElement.bind(this);
      this.element = collectionElement;
      this.index = this.element.children.length || parseInt(this.element.dataset.index) || 0;
      this.placeholder = this.element.dataset.placeholder || '__name__';
      this.buttonData = {};
      this.buttonData.id = this.element.dataset.buttonid || '';
      this.buttonData.classes = this.element.dataset.buttonclasses || '';
      this.buttonData.innerHTML = this.element.dataset.buttoninnerhtml || 'add';
      this.prototype = this.element.dataset.prototype || null;
      this.addOneByDefault = this.element.dataset.addonebydefault !== 'false';
      if(this.prototype !== null) {
        Collection.add(collectionElement);
        this.init();
      }
    }
  }

  init() {
    if(this.addOneByDefault){
      this.add();
    }
    if(this.buttonData.id !== '' && !!document.querySelector('#'+this.buttonData.id)) {
      this.button = document.querySelector('#'+this.buttonData.id);
    } else {
      this.button = document.createElement('button');
      if(this.buttonData.classes !== '')this.buttonData.classes.split(' ').forEach((classString) => {
        if(classString!=='')this.button.classList.add(classString);
      });
      if(this.buttonData.id !== '')this.button.id = this.buttonData.id;
      this.button.innerHTML = this.buttonData.innerHTML;
      if(this.element.parentNode.nextSibling !== null && this.element.parentNode.nextSibling.nodeType === Node.ELEMENT_NODE){
        this.element.parentNode.insertBefore(this.button, this.element.parentNode.nextSibling);
      }else{
        this.element.parentNode.appendChild(this.button);
      }
    }
    this._addEventListeners();
  }

  _addEventListeners() {
    this.button.addEventListener('click',this.add);
  }

  add() {
    let newElement = this.generateNewElement();
    this.index++;
    this.element.appendChild(newElement);
  }

  generateNewElement() {
    const stripped = this.prototype.split(this.placeholder);
    const html = stripped.join(this.index);
    const container = document.createElement('div');
    container.innerHTML = html;
    return container.children[0];
  }

  static has(collectionElement) {
    return Collection.collections.has(collectionElement);
  }

  static add(collectionElement) {
    Collection.collections.add(collectionElement);
  }

  static remove(collectionElement) {
    Collection.collections.remove(collectionElement);
  }

  static searchCollections(element) {
    if(element.nodeType === Node.ELEMENT_NODE) {
      element.parentNode.querySelectorAll('[data-prototype]').forEach((element)=>{
        if(!Collection.has(element)){
          new Collection(element);
        }
      });
    }
  }

  static removeCollections(element) {
    if(element.nodeType === Node.ELEMENT_NODE) {
      element.parentNode.querySelectorAll('[data-prototype]').forEach((element)=>{
        if(Collection.has(element)){
          Collection.remove(element);
        }
      });
    }
  }
}
Collection.collections = new Set();
