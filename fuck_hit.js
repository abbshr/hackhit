/* fuck HIT Server-Proxy */
/*      beta v0.1.1      */

var http   = require('http');
var router = require('./router.js');

http.createServer(router).listen(3000);