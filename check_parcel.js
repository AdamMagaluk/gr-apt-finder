var request = require('request');
var url = require('url');
/*
  'https://accessmygov.com/ASSG_SiteSearch/LoadContent?SearchFocus=All%20Records&SearchCategory=Name&SearchText=ashbrook&uid=115&PageIndex=1&ReferenceKey=41-18-20-401-012&ReferenceType=0&SearchOrigin=0&RecordKey=41-18-20-401-012&RecordKeyType=0&_=1458252986232' -H 'Pragma: no-cache' -H 'DNT: 1' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36' -H 'Accept: text/html, *\/*; q=0.01' -H 'Referer: https://accessmygov.com/SiteSearch/SiteSearchDetails?SearchFocus=All+Records&SearchCategory=Name&SearchText=ashbrook&uid=115&PageIndex=1&ReferenceKey=41-18-20-401-012&ReferenceType=0&SortBy=&SearchOrigin=0&RecordKey=1%3d41-18-20-401-012%3a%3a4%3d41-18-20-401-012%3a%3a13%3d85217%3a%3a13%3d85218%3a%3a13%3d85219%3a%3a13%3d143226%3a%3a13%3d64491&RecordKeyType=1%3d0%3a%3a4%3d0%3a%3a13%3d1%3a%3a13%3d1%3a%3a13%3d1%3a%3a13%3d1%3a%3a13%3d1' -H 'X-Requested-With: XMLHttpRequest' -H 'Cookie: showMobileView=; user_collapseVerticalNav=; IsWeb=FBDF7B90BB5C760F5FF0BFEDDE7992C1C3E5634F11A8C75126770404FF561E43499DBD0A842AF66602E2D896E28D193EC37A45F0D12E3B6F0DC4018DBD91AC9E37D5360F8081A18C602DA031267D86C10E5E1D154DC88953CB3FB952B392BB215C01E818769D9EE3CB061B6C36F894F1D3BEBEB09F6C2A4766E8BA4B806462EF829989A360C1BBA5D8CFD005BCEAE7AF5242220F226A083A823A32EEBC2B762E3F0556244780C1B15794DE7E95DF29866E207047; ASP.NET_SessionId=ucapoftxqo0dph5xrn2zqw2a; user_showAdvAddrSearchCheckbox=false; user_useAdvAddrSearch=false; sFocus=Tax; sCategory=Parcel Number' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed

*/

//var orig = 'https://accessmygov.com/ASSG_SiteSearch/LoadContent?SearchFocus=All%20Records&SearchCategory=Name&SearchText=ashbrook&uid=115&PageIndex=1&ReferenceKey=41-18-20-401-012&ReferenceType=0&SearchOrigin=0&RecordKey=41-18-20-401-012&RecordKeyType=0&_=1458252986232';

var KEY = 'C_APT APARTMENT';
var BASE = 'https://accessmygov.com/ASSG_SiteSearch/LoadContent?SearchFocus=All%20Records&SearchCategory=Name&SearchText=ashbrook&uid=115&PageIndex=1&ReferenceKey=41-18-20-401-018&ReferenceType=0&SearchOrigin=0&RecordKey=41-18-20-401-018&RecordKeyType=0&_=1458258551390';

var parsed = url.parse(BASE, true);
delete parsed.search;

var Checker = module.exports = function() {
  this.jar = request.jar();
};

Checker.prototype.check = function(parcelId, callback) {

  parsed.query.ReferenceKey = parsed.query.RecordKey = parcelId;
  
  request.get(url.format(parsed), { jar : this.jar }, function(err, res, body) {
    if (err) {
      return callback(err);
    }

    if (res.statusCode !== 200) {
      return callback(new Error('Not 200 status code'));
    }

    if ((body.indexOf(KEY) === -1)) {
      return callback(null, false);
    }

    var start = body.indexOf('<th>Owner</th>');
    var sIdx = body.indexOf('<td>', start);
    var eIdx = body.indexOf('</td>', start);
    
    var owner = body.substr(sIdx+4, eIdx-sIdx-4).replace(/<br\/>/g, '\n');

    var start = body.indexOf('<th>Taxpayer</th>');
    var sIdx = body.indexOf('<td>', start);
    var eIdx = body.indexOf('</td>', start);
    
    var taxpayer = body.substr(sIdx+4, eIdx-sIdx-4).replace(/<br\/>/g, '\n');

    return callback(null, { parcelId: parcelId, owner: owner, taxpayer: taxpayer });
  });
};




