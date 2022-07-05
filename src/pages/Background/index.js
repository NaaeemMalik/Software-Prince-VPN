console.log('This is the background page.');
console.log('Put the background scripts here.');

var Server = chrome.runtime;
var Store = chrome.storage.local;

Server.onMessage.addListener(function (resp, sender, sendResponse) {
  switch (resp.type) {
    case 'login':
      var opt = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          r: "1232177", action: "ValidateLogin", a: "demo-ge343n30vn",

          username: resp.email, password: resp.password
        }),
      };
      serverRequest('/api/auth/authorize', opt, sendResponse);
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

function serverRequest(endpoint, options, callback) {
  fetch(`https://www.smartersvpn.com/members/includes/vpnapi/api.php`, options)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(JSON.stringify(res));
      callback(res);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

// token 34a55a69a1a7544f6d9fa96be34aef42a6f10c44
