import PubSub from '../lib/pubsub.js';

export default class Store{

    constructor(params){
      
      this.actions = {};
      this.mutations = {};
      this.state = {};

      this.status = 'resting';

      this.events = new PubSub();

      if(params.hasOwnProperty('actions')){
        this.actions = params.actions;
      }

      if(params.hasOwnProperty('mutations')){
        this.mutations = params.mutations;
      }
      let that =this;
      // this.state 实际上为param.state的代理。操作this.state接见操作param.state
      this.state = new Proxy(params.state, {
        set(obj, prop, value){
          obj[prop] = value;

          console.log(`stateChange: ${prop}: ${value}`, ` this: ${that}`);
          that.events.publish('stateChange', that.state);

          // 只能在mutations状态下更新state?
          if(that.status!=='mutation') {
            console.warn(`You should use a mutation to set ${prop}`);
          }

          // 更新完后又要变为resting?
          that.status = 'resting';
          //'set' on proxy: trap returned falsish for property 'items'
          return true
        }
      })
    }

    // 接收action, payload?
    dispatch(actionKey, payload){

      if(typeof this.actions[actionKey] !== 'function'){
        console.error(`Action "${actionKey} doesn't exist.`);
        return false;
      }
      console.groupCollapsed(`ACTION: ${actionKey}`);

      this.status = 'action';

      this.actions[actionKey](this, payload);
      
      console.groupEnd();

      return true;
    }

    // 接收mutations更新state, payload?
    commit(mutationKey, payload){

      if(typeof this.mutations[mutationKey] !== 'function') {
        console.log(`Mutation "${mutationKey}" doesn't exist`);
        return false;
      }
      this.status = 'mutation';

      let newState = this.mutations[mutationKey](this.state, payload);

      this.state = Object.assign(this.state, newState);

      return true
    }
}