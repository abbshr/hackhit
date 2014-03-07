var fs        = require('fs');
var url       = require('url');
var querystr  = require('querystring');
var Const     = require('./const.json');
var http      = require('http');
module.exports = router;

function router(req, res) {
    if (req.method === 'GET')
    switch (req.url) {
        case '/':
            go_to_index(req, res);
            break;
        case '/score1':
            get_page(req, res, 'FIRST');
            break;
        case '/score2':
            get_page(req, res, 'SECOND');
            break;
        case '/hang':
            get_page(req, res, 'HANG');
            break;
        case '/table':
            post_table(req, res);
            break; 
        case '/code.bmp':
            get_code(req, res);
            break;
        default:
            res.end('');
    }
    
    if (req.method === 'POST')
    if (req.headers['transfer-encoding'] || req.headers['content-length'])
        hacking(req, res);
}

function go_to_index(req, res) {
    readfile('./login.html', res, 'text/html', '');
}

function get_code(req, res) {
    http.get(Const.CODE_URI, function (hit_response) {
        var cookie = hit_response.headers['set-cookie'][0].split(';')[0];
        // get cookie
        var cookie = hit_response.headers['set-cookie'][0].split(';')[0];
        console.log('cookies got!');
        res.setHeader('Content-Type', 'image/bmp');
        res.setHeader('Set-Cookie', cookie);
        res.writeHead(200, 'OK');
        // get code.bmp
        hit_response.on('data', function (data) {
            res.write(data);
        });
        hit_response.on('end', function () {
            res.end();
            console.log("code image got!");
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
        console.log(cookie);
        Const.login_opt.headers['Cookie'] = cookie;
        // 向HIT Server发起登陆验证请求
        var proxy_req = http.request(Const.login_opt, function (proxy_res) {
            if (proxy_res.statusCode === 302) {
                console.log('Authenticate successful!');
                readfile('./index.html', res, 'text/html', cookie);
            } else {
                console.log('Authenticate failed!');
                res.end('Authenticate failed!');
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

function get_page(req, res, des) {
    var cookie = req.headers.cookie;
    console.log(des + ' :', cookie);
    var opt = {
        "host": "xscj.hit.edu.cn",
        "method": "GET",
        "path": "/hitjwgl/xs/cjcx/" + Const[des],
        "headers": {
            "Cookie": cookie
        }
    };  
    var proxy_req = http.request(opt, function (hit_response) {
        if (hit_response.statusCode === 200) {
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Set-Cookie', cookie);
            res.writeHead(200, 'OK');
            hit_response.on('data', function (data) {
                res.write(data);
            });
            hit_response.on('end', function () {
                res.end();
            });
        } else {
            console.log('Problem happens during authentication!');
            res.end('Problem happens during authentication!');
        }
    });
    proxy_req.end();
}

function post_table(req, res) {
    var cookie = req.headers.cookie;
    Const.table_opt.headers['Cookie'] = cookie;
    var proxy_req = http.request(Const.table_opt, function (proxy_res) {
        if (proxy_res.statusCode === 200) {
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Set-Cookie', cookie);
            res.writeHead(200, 'OK');
            proxy_res.on('data', function (data) {
                res.write(data);
            });
            proxy_res.on('end', function () {
                console.log('table.html got!');
                res.end();
            });
        } else {
            console.log('Problem happens during authentication!');
            res.end('Problem happens during authentication!');
        }
    });
    proxy_req.write("selectXQ=2014%B4%BA%BC%BE&Submit=%B2%E9%D1%AF");
    proxy_req.end();
}

function readfile(path, res, type, cookie) {
    fs.readFile(path, function (err, file) {
        res.setHeader('Content-Type', type);
        res.setHeader('Set-Cookie', cookie);
        res.writeHead(200, 'OK');
        res.end(file);
    });
}