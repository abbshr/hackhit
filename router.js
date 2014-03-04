var fs        = require('fs');
var url       = require('url');
var querystr  = require('querystring');
var Const     = require('./const.json');
var http      = require('http');
module.exports = router;

function router(req, res) {
    if (req.method === 'GET')
    if (req.url === '/')
    go_to_index(req, res);
    else if (req.url === '/code.bmp')
    readfile('./code.bmp', res, 'image/bmp', 'code=code');
    
    if (req.method === 'POST')
    if (req.headers['transfer-encoding'] || req.headers['content-length'])
    hacking(req, res);
}

function go_to_index(req, res) {
    http.get(Const.CODE_URI, function (hit_response) {
        // get cookie
        var cookie = hit_response.headers['set-cookie'][0].split(';')[0];
        console.log('cookies got!');
            
        // get code.bmp
        var w_stream = fs.createWriteStream("./code.bmp");
            
        hit_response.on('data', function (data) {
            w_stream.write(data);
        });
        hit_response.on('end', function () {
            w_stream.end();
            console.log("code image got!");
            // 返回登陆页面
            readfile("./index.html", res, 'text/html', cookie);
        });
    });
}

function hacking(req, res) {
    var raw = [];
    req.on('data', function (byte_data) {
        raw.push(byte_data);
    });
    req.on('end', function () {
        raw = Buffer.concat(raw).toString();
        var user_data = querystr.parse(raw);
        console.log('user\'s informations got! now pushing to HIT Server');
        var cookie = req.headers.cookie;
        Const.table_opt.headers['Cookie'] = cookie;
        Const.login_opt.headers['Cookie'] = cookie;
        // 向HIT Server发起登陆验证请求
        var proxy_req = http.request(Const.login_opt, function (proxy_res) {
            if (proxy_res.statusCode === 302) {
                // 请求数据
                var proxy_req = http.request(Const.table_opt, function (proxy_res) {
                    var w_stream = fs.createWriteStream('./result.html');
                    proxy_res.on('data', function (data) {
                        w_stream.write(data);
                    });
                    proxy_res.on('end', function () {
                        w_stream.end();
                        readfile('./result.html', res, 'text/html', cookie);
                    });
                });
                proxy_req.write("selectXQ=2014%B4%BA%BC%BE&Submit=%B2%E9%D1%AF");
                proxy_req.end();
            } else {
                console.log('input wrong info!');
            }
        });
        proxy_req.write("uid=" + user_data['uid'] 
            + "&pwd=" + user_data['pwd'] 
            + "&captchacode=" + user_data['captchacode'] 
            + "&Submit2.x=33&Submit2.y=13&Submit2=%CC%E1%BD%BB"
        );
        proxy_req.end();
    });
}

function readfile(path, res, type, cookie) {
    fs.readFile(path, function (err, file) {
        res.setHeader('Content-Type', type);
        res.setHeader('Set-Cookie', cookie);
        res.writeHead(200, 'OK');
        res.end(file);
    });
}