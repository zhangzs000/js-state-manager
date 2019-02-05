export default class PubSub {

  constructor(){
    this.events = {};
  }

  subscribe(event, cb){
    if(!this.events.hasOwnProperty(event)){
      this.events[event] = [];
    }

    this.events[event].push(cb);
  }

  publish(event, data={}){
    // for in判断只要可枚举 enumerable: true, 会遍历原型链；而hasOwnProperty遍历不在原型链的自定义属性。
    if(event in this.events) {
      this.events[event].map(cb => cb(data));
    }
  }
}