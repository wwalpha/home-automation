const Request = require('request');
const Q = require('q');
const os = require('os');

function hostname() {
  os.hostname()
    .toLowerCase()
    .replace(/\..*$/, '')
    .replace(/[^a-z0-9]/g, '');
}

function authRequest(url, clientId, nickname, code) {
  const deferred = Q.defer();

  const headers = {};
  if (code !== undefined) {
    headers.Authorization = `Basic ${Buffer.from(`:${code}`).toString('base64')}`;
  }

  Request.post({
    method: 'POST',
    uri: `${url}/accessControl`,
    json: {
      id: 1,
      method: 'actRegister',
      version: '1.0',
      params: [
        {
          clientid: clientId,
          nickname,
          level: 'private',
        },
        [
          {
            value: 'yes',
            function: 'WOL',
          },
        ],
      ],
    },
    headers,
  }, (error, response) => {
    if (!error) {
      deferred.resolve(response);
    } else {
      deferred.reject(error);
    }
  });

  return deferred.promise;
}

function parseCookie(headers) {
  return headers['set-cookie'][0].split(';')[0];
}


class BraviaAuth {
  constructor(discovery) {
    this.discovery = discovery;
    this.clientId = '{hostname}:642a76ca-9102-11e6-ae22-56b6b6499611';
    this.nickname = 'node-bravia-androidtv ({hostname})';
  }

  getCookie(code) {
    const deferred = Q.defer();

    if (this.cookie) {
      deferred.resolve(this.cookie);
    } else {
      const self = this;
      console.log(this.discovery.getUrl());
      this.discovery.getUrl().then((url) => {
        const clientId = self.clientId.format({ hostname: hostname() });
        const nickname = self.nickname.format({ hostname: os.hostname() });
        authRequest(url, clientId, nickname, code).then((response) => {
          if (response.statusCode === 200) {
            const cookie = parseCookie(response.headers);
            self.cookie = cookie;
            deferred.resolve(cookie);
          } else if (response.statusCode === 401) {
            deferred.resolve();
          } else {
            deferred.reject(`Unexpected ${response.statusCode} response`);
          }
        }, deferred.reject);
      }, deferred.reject);
    }

    return deferred.promise;
  }

  clearCookie() {
    this.cookie = null;
  }
}

module.exports = BraviaAuth;
