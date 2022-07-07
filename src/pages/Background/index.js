const md5 = require('md5')
var Server = chrome.runtime;
var Store = chrome.storage.local;
let apikey = "DbM3694x2dAz"
let salt = "Njh0&$@ZH098GP"
let randomNum = Math.floor(Math.random() * 100000000);

Server.onMessage.addListener(function (resp, sender, sendResponse) {
  var opt = new URLSearchParams();
  opt.append("a", apikey);
  opt.append("r", randomNum);
  switch (resp.type) {
    case 'login':
      let tempsc = resp.email + "*" + salt + "-" + apikey + "-" + randomNum + "-"
      let sc = md5(tempsc)
      opt.append("action", "ValidateLogin");
      opt.append("e", resp.email);
      opt.append("p", resp.password);
      opt.append("sc", sc);
      serverRequest(opt, sendResponse);
      break;
    case 'logout':
      var opt = {
        method: 'POST',
        headers: {
          Authorization: `Token ${resp.token}`,
          'Content-Type': 'application/json',
        },
      };
      serverRequest('/api/auth/deauthorize', opt, sendResponse);
      break;
    case 'serp':
      var results = resp.results;
      console.log(JSON.stringify(results));
      var opt = {
        method: 'POST',
        headers: {
          Authorization: `Token ${resp.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results),
      };
      serverRequest(
        '/api/serp/search/submit-external-search',
        opt,
        sendResponse
      );
      break;
    case 'getData':
      var opt = {
        method: 'GET',
        headers: {
          Authorization: `Token ${resp.token}`,
          'Content-Type': 'application/json',
        },
      };
      serverRequest(
        `/api/serp/search/${resp.searchID}/get-domain-report`,
        opt,
        sendResponse
      );
      break;
    default:
      console.log('No such type');
  }
  return true;
});

function serverRequest(urlencoded, callback) {
  console.log('serverRequest', urlencoded);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded
  };
  fetch("https://www.smartersvpn.com/members/includes/vpnapi/api.php", requestOptions)
    .then(response => response.json())
    .then(result => { console.log(result); callback(result); })
    .catch(error => { console.error('myerror', error); callback(error); });

}

// token 34a55a69a1a7544f6d9fa96be34aef42a6f10c44
