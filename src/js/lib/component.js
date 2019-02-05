import Store from '../store/store.js';

export default class Component {
  constructor(props = {}) {

      this.render = this.render || function() {};
      
      if(props.store instanceof Store) {
          props.store.events.subscribe('stateChange', () => this.render());
      }
      
      // Store the HTML element to attach the render to if set
      if(props.hasOwnProperty('element')) {
          this.element = props.element;
      }
  }
}