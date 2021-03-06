// Generated by CoffeeScript 1.12.4
var $catch, $host, forData;

$host = null;

$catch = null;

global.rubic = {
  host: function(host) {
    var last, len;
    len = host.length;
    last = host[len - 1];
    if (last !== '/') {
      host += '/';
    }
    return $host = host;
  },
  "catch": function(callback) {
    return $catch = callback;
  },
  fromDataURL: function(dataUrl) {
    var base64, base64Wrapped;
    base64 = dataUrl.replace(/data:.*;base64,/, '');
    base64Wrapped = "\/Base64(" + base64 + ")\/";
    return base64Wrapped;
  },
  call: function(name, data) {
    var headers, url;
    if (data == null) {
      data = {};
    }
    forData(data, function(value, key, parent) {
      var date, timeStamp;
      if (value instanceof Date) {
        date = value;
        timeStamp = date.getTime();
        return parent[key] = "\/Date(" + timeStamp + ")\/";
      }
    });
    url = "" + $host + name;
    data = JSON.stringify(data);
    headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    return new Promise(function(resolve, reject) {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      }).then(function(response) {
        var ok;
        ok = response.ok;
        if (ok) {
          return response.json().then(function(data) {
            forData(data, function(value, key, parent) {
              var timeStamp;
              if (/^\/Date\(\d+\)\/$/.test(value)) {
                value = value.slice(6, value.length - 2);
                timeStamp = parseInt(value);
                return parent[key] = new Date(timeStamp);
              }
            });
            return resolve(data);
          });
        } else {
          return response.json().then(function(error) {
            if ($catch) {
              $catch(error);
            }
            return reject(error);
          });
        }
      });
    });
  }
};

forData = function(tree, callback) {
  var forEach;
  forEach = function(node, key, parent) {
    var child, childKey, i, j, len1, results, results1, type;
    type = typeof node;
    if (type === 'boolean' || type === 'number' || type === 'string' || node instanceof Date) {
      return callback(node, key, parent);
    } else if (Array.isArray(node)) {
      results = [];
      for (i = j = 0, len1 = node.length; j < len1; i = ++j) {
        child = node[i];
        results.push(forEach(child, i, node));
      }
      return results;
    } else if (typeof node === 'object') {
      results1 = [];
      for (childKey in node) {
        child = node[childKey];
        results1.push(forEach(child, childKey, node));
      }
      return results1;
    }
  };
  return forEach(tree, null, null);
};
