// Generated by CoffeeScript 1.4.0
(function() {
  var ServiceInstance;

  module.exports = ServiceInstance = (function() {

    function ServiceInstance(config) {
      this.config = config != null ? config : {};
    }

    ServiceInstance.revive = function(obj) {
      return new ServiceInstance(obj.config);
    };

    ServiceInstance.prototype.cryofreeze = function() {
      return {
        config: this.config
      };
    };

    return ServiceInstance;

  })();

}).call(this);
