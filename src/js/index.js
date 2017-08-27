(function() {
  var index;

  index = (function() {
    function index() {
      console.log(123);
    }

    index.prototype.testOne = function() {
      return console.log(456);
    };

    index.prototype.testTow = function() {
      return console.log(789);
    };

    index.prototype.testTheer = function() {
      return console.log(101);
    };

    return index;

  })();

  mew(index());

}).call(this);
