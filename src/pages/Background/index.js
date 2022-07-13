
const md5 = require('md5')
const apiUrl = "https://www.smartersvpn.com/members/includes/vpnapi/api.php"
var Server = chrome.runtime;
var Store = chrome.storage.local;
let apikey = "DbM3694x2dAz"
let salt = "Njh0&$@ZH098GP"
let randomNum = Math.floor(Math.random() * 100000000);
makeMD5 = (email, salt, apikey, randomNum) => {
  let tempsc = email + "*" + salt + "-" + apikey + "-" + randomNum + "-"
  sc = md5(tempsc)
  return sc
}
function getDatafromStorage(str) {
  return new Promise((resolve, reject) => {
    Store.get(str, (res) => {
      if (res[str]) {
        resolve(res[str]);
      } else {
        resolve(null);
      }
    });
  });
}


var email, sc, userid;
async function getUserData() {
  email = await getDatafromStorage("email");
  sc = makeMD5(email, salt, apikey, randomNum)
  userid = await getDatafromStorage("userid");
  console.log('background.js1', email, sc, userid);
  return { email, sc, userid };
}

chrome.webRequest.onAuthRequired.addListener(
  function (details, callbackFn) {
    console.log("onAuthRequired!", details, callbackFn);
    callbackFn({
      authCredentials: { username: "1", password: "__TestUser" }
    });
  },
  { urls: ["<all_urls>"] }
);
chrome.proxy.onProxyError.addListener(
  function (details) {
    console.log("onProxyError!", details);
  }
);

Server.onMessage.addListener(function (resp, sender, sendResponse) {
  console.log('background.js', email, sc, userid);
  var opt = new URLSearchParams();
  opt.append("a", apikey);
  opt.append("r", randomNum);
  switch (resp.type) {
    case 'login':
      let sc = makeMD5(resp.email, salt, apikey, randomNum)
      opt.append("action", "ValidateLogin");
      opt.append("e", resp.email);
      opt.append("p", resp.password);
      opt.append("sc", sc);
      global.sc = sc;
      global.email = resp.email;
      Store.set({
        email: resp.email,
        password: resp.password,
        sc: sc
      });
      serverRequest(opt, sendResponse);
      break;
    case 'getServersGroup':
      getUserData().then(data => {
        opt.append("sc", data.sc);
        opt.append("u", data.userid);
        opt.append("action", "getservergroups");
        opt.append("e", data.email);
        serverRequest(opt, sendResponse);
      });
      break;
    case 'getServer':
      getUserData().then(data => {
        opt.append("sc", data.sc);
        opt.append("u", data.userid);
        opt.append("action", "getserverbygroup");
        opt.append("e", data.email);
        opt.append("servergid", resp.servergid);
        serverRequest(opt, sendResponse);
      });
    case 'connect':
      //curl --proxy socks5://bob:hello@144.126.216.185:1080 --url  https://www.google.com
      let host = "212.47.228.149"
      let port = 64143
      config = {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: 'socks5',
            host: host,
            port: port
          }
        }
      };
      console.log("connecting", config)
      chrome.proxy.settings.set(
        { value: config, scope: 'regular' },
        function () { }
      );
      break;
    case 'disconnect':
      console.log('disconnect');
      var config = {
        mode: "direct",
      };
      chrome.proxy.settings.set(
        { value: config, scope: "regular" },
        function () { }
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
  fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .then(result => { console.log(result); callback(result); })
    .catch(error => { console.error('myerror', error); callback(error); });

}

// token 34a55a69a1a7544f6d9fa96be34aef42a6f10c44
