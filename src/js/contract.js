(function() {
  var login;

  login = (function() {
    function login() {}

    login.prototype.move = function() {
      return alert('你好');
    };

    login.prototype.moveTwo = function() {
      return alert('大家好');
    };

    login.prototype.moveTrhee = function() {
      return alert('我也好');
    };

    login.prototype.moveForu = function() {
      return alert('很好');
    };

    login.prototype.moveSeven = function() {
      return alert('非常好');
    };

    return login;

  })();

  new login();

}).call(this);
