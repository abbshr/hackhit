// ajax版
function sign(id, pwd) {
    var info = "stuNumber=1120310617&password=19940126";
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "stulogin.action");
    ajax.onreadystatechange = function(e) {
        var result = JSON.parse(this.response);
        console.log(result, result.result);           
    };
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //ajax.setRequestHeader("Referer", "http://clop.hit.edu.cn/index");
    //ajax.setRequestHeader("Cookie", "JSESSIONID=537BB03106B1506C431352DFB613A02E");
    ajax.send(info);
}

// node版
var req = require('http').request({
    "host": "clop.hit.edu.cn",
    "method": "POST",
    "path": "/stulogin.action",
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "http://clop.hit.edu.cn/index"
    }
}, function(res) {
    var buffer = [];
    res.on('data', function(data) {
        buffer.push(data);
    });
    res.on('end', function(){
        buffer = Buffer.concat(buffer).toString();
        buffer = JSON.parse(buffer);
        console.log(buffer, buffer.result);
    });
});

req.write("stuNumber=1120310617&password=19940126");
req.end();

//test server
/*require('http').createServer(function(req, res) {
    var buf = [];
    req.on('data', function(data) {
        buf.push(data);
    });

    req.on('end', function(){
        buf = Buffer.concat(buf).toString();
        console.log(req.headers, buf);
    });
    res.end(buf.toString());
}).listen(3000);*/