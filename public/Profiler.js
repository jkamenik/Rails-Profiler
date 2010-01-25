Profiler = new function(){
  this.log = function(x){
    if(console && console.log){
      console.log(x);
    }
  };
  
  this.clone = function(obj){
    this.log('Cloning');
    this.log(obj);
    var rtn = {};
    for(var i in obj){
      this.log(i);
      this.log(typeof(obj[i]));
      this.log(obj[i]);
      if(typeof(obj[i]) === 'object'){
        rtn[i] = this.clone(obj[i]);
      } else {
        rtn[i] = obj[i];
      }
    }
    return rtn;
  };
};