/* fuck HIT Server-Proxy */
/*      beta v0.1.2      */
var argv = process.argv;
var http   = require('http');
var router = require('./router.js');
if (argv[2] == '--web')
    router = require('./router.js');
if (argv[2] == '--ios')
    router = require('./for_ios_client.js');
http.createServer(router).listen(3000);