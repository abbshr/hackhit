/* fuck HIT Server-Proxy */
/*      beta v0.0.1      */

var http      = require('http');
var router    = require('./router.js')

http.createServer(router).listen(8888);