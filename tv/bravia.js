const Request = require('request');
const Q = require('q');
const BraviaDiscovery = require('./braviaDiscovery');
const BraviaAuth = require('./braviaAuth');

const Bravia = (ip, mac, filter) => {
  this.discovery = new BraviaDiscovery(ip, mac, filter);
  this.auth = new BraviaAuth(this.discovery);
};

const jsonRequest = (url, json, cookie, auth) => {
  const deferred = Q.defer();

  Request.post({
    method: 'POST',
    uri: url,
    json,
    headers: {
      Cookie: cookie,
    },
  }, (error, response, body) => {
    if (!error) {
      if (response.statusCode === 200) {
        deferred.resolve(body);
      } else if (response.statusCode === 403) {
        auth.clearCookie();
        deferred.reject(error);
      } else {
        deferred.reject(error);
      }
    } else {
      deferred.reject(error);
    }
  });

  return deferred.promise;
};

Bravia.prototype.discover = () => this.discovery.getIp();

Bravia.prototype.authenticate = code => this.auth.getCookie(code);

Bravia.prototype.getPowerStatus = () => {
  const deferred = Q.defer();

  const self = this;
  this.discovery.getUrl().then((url) => {
    self.auth.getCookie().then((cookie) => {
      const json = {
        id: 2,
        method: 'getPowerStatus',
        version: '1.0',
        params: [],
      };
      jsonRequest(`${url}/system`, json, cookie, self.auth).then((response) => {
        if (response.result !== undefined) {
          deferred.resolve(response.result[0].status);
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getPowerSavingMode = () => {
  const deferred = Q.defer();

  const self = this;
  this.discovery.getUrl().then((url) => {
    self.auth.getCookie().then((cookie) => {
      const json = {
        id: 2,
        method: 'getPowerSavingMode',
        version: '1.0',
        params: [],
      };
      jsonRequest(`${url}/system`, json, cookie, self.auth).then((response) => {
        if (response.result !== undefined) {
          deferred.resolve(response.result[0].mode);
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.setPowerSavingMode = (mode) => {
  const deferred = Q.defer();

  const self = this;
  this.discovery.getUrl().then((url) => {
    self.auth.getCookie().then((cookie) => {
      const json = {
        id: 2,
        method: 'setPowerSavingMode',
        version: '1.0',
        params: [{
          mode, // "off" (for display on) or "pictureOff" (for display off)
        }],
      };
      jsonRequest(`${url}/system`, json, cookie, self.auth).then((response) => {
        if (response.result !== undefined) {
          deferred.resolve();
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getPlayingContentInfo = () => {
  const deferred = Q.defer();

  const self = this;
  this.discovery.getUrl().then((url) => {
    self.auth.getCookie().then((cookie) => {
      const json = {
        id: 2,
        method: 'getPlayingContentInfo',
        version: '1.0',
        params: [],
      };
      jsonRequest(`${url}/avContent`, json, cookie, self.auth).then((response) => {
        if (response.result !== undefined) {
          deferred.resolve(response.result[0]);
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getApplicationList = () => {
  const deferred = Q.defer();

  const self = this;
  this.discovery.getUrl().then((url) => {
    self.auth.getCookie().then((cookie) => {
      const json = {
        id: 2,
        method: 'getApplicationList',
        version: '1.0',
        params: [],
      };
      jsonRequest(`${url}/appControl`, json, cookie, self.auth).then((response) => {
        if (response.result !== undefined) {
          deferred.resolve(response.result[0]);
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.setActiveApp = (appUri) => {
  const deferred = Q.defer();

  const self = this;
  this.discovery.getUrl().then((url) => {
    self.auth.getCookie().then((cookie) => {
      const json = {
        id: 2,
        method: 'setActiveApp',
        version: '1.0',
        params: [{
          uri: appUri,
        }],
      };
      jsonRequest(`${url}/appControl`, json, cookie, self.auth).then((response) => {
        if (response.result !== undefined) {
          deferred.resolve();
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getVolumeInformation = () => {
  const deferred = Q.defer();

  const self = this;
  this.discovery.getUrl().then((url) => {
    self.auth.getCookie().then((cookie) => {
      const json = {
        id: 2,
        method: 'getVolumeInformation',
        version: '1.0',
        params: [],
      };

      jsonRequest(`${url}/audio`, json, cookie, self.auth).then((response) => {
        if (response.result !== undefined) {
          deferred.resolve(response.result[0].find(info => info.target === 'speaker'));
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.setAudioMute = (mute) => {
  const deferred = Q.defer();

  const self = this;
  this.discovery.getUrl().then((url) => {
    self.auth.getCookie().then((cookie) => {
      const json = {
        id: 2,
        method: 'setAudioMute',
        version: '1.0',
        params: [{
          status: mute,
        }],
      };
      jsonRequest(`${url}/audio`, json, cookie, self.auth).then((response) => {
        if (response.result !== undefined) {
          deferred.resolve();
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.setAudioVolume = (volume) => {
  const deferred = Q.defer();

  const self = this;
  this.discovery.getUrl().then((url) => {
    self.auth.getCookie().then((cookie) => {
      const json = {
        id: 2,
        method: 'setAudioVolume',
        version: '1.0',
        params: [{
          target: 'speaker',
          volume: volume.toString(),
        }],
      };
      jsonRequest(`${url}/audio`, json, cookie, self.auth).then((response) => {
        if (response.result !== undefined) {
          deferred.resolve();
        } else {
          deferred.reject(response.error);
        }
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};

Bravia.prototype.getCommands = () => {
  const deferred = Q.defer();

  if (this.commands) {
    deferred.resolve(this.commands);
  } else {
    const self = this;
    this.discovery.getUrl().then((url) => {
      self.auth.getCookie().then((cookie) => {
        const json = {
          id: 2,
          method: 'getRemoteControllerInfo',
          version: '1.0',
          params: [],
        };
        jsonRequest(`${url}/system`, json, cookie, self.auth).then((response) => {
          if (response && response.result !== undefined) {
            self.commands = response.result[1].reduce((commands, command) => {
              /* eslint-disable */
              commands[command.name] = command.value;
              /* eslint-enable */
              return commands;
            }, {});
            deferred.resolve(self.commands);
          } else {
            deferred.reject(`Unexpected response: ${JSON.stringify(response)}`);
          }
        }, deferred.reject);
      }, deferred.reject);
    }, deferred.reject);
  }

  return deferred.promise;
};


function sendCommandCode(url, cookie, code, auth) {
  const deferred = Q.defer();

  const body = '<?xml version="1.0"?>'
    + '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">'
    + '<s:Body>'
    + '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">'
    + '<IRCCCode>{code}</IRCCCode>'
    + '</u:X_SendIRCC>'
    + '</s:Body>'
    + '</s:Envelope>';

  Request.post({
    method: 'POST',
    uri: `${url}/IRCC`,
    body: body.format({ code }),
    headers: {
      'Content-Type': 'text/xml; charset=UTF-8',
      SOAPACTION: '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
      Cookie: cookie,
    },
  }, (error, response) => {
    if (!error) {
      if (response.statusCode === 200) {
        deferred.resolve();
      } else if (response.statusCode === 403) {
        auth.clearCookie();
        deferred.reject(error);
      } else {
        deferred.reject(error);
      }
    } else {
      deferred.reject(error);
    }
  });

  return deferred.promise;
}


Bravia.prototype.sendCommand = (command) => {
  const deferred = Q.defer();

  const self = this;
  this.getCommands().then((commands) => {
    self.discovery.getUrl().then((url) => {
      self.auth.getCookie().then((cookie) => {
        const code = commands[command];
        sendCommandCode(url, cookie, code, self.auth)
          .then(deferred.resolve, deferred.reject);
      }, deferred.reject);
    }, deferred.reject);
  }, deferred.reject);

  return deferred.promise;
};


module.exports = Bravia;
