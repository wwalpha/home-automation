const SsdpClient = require('node-ssdp').Client;
const Q = require('q');
const wol = require('wake_on_lan');
const Request = require('request');
const { parseString } = require('xml2js');

const validateDescription = (body, filter, successAction) => {
  parseString(body, (err, result) => {
    if (!err) {
      if (filter !== undefined) {
        if (filter(result.root.device[0])) {
          successAction();
        }
      } else {
        successAction();
      }
    }
  });
};


const getDescription = (loc, filter, successAction) => {
  Request.get({
    method: 'GET',
    uri: loc,
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      validateDescription(body, filter, successAction);
    }
  });
};


const wakeOnLan = (mac) => {
  const deferred = Q.defer();

  wol.wake(mac, (error) => {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
};

const ssdpDiscover = (ssdpClient, st, filter) => {
  const deferred = Q.defer();
  let timer = null;

  ssdpClient.on('response', (headers, statusCode, rinfo) => {
    if (statusCode === 200) {
      getDescription(headers.LOCATION, filter, () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        ssdpClient.stop();
        deferred.resolve(rinfo.address);
      });
    }
  });

  ssdpClient.search(st);

  timer = setTimeout(() => {
    deferred.reject('Discovery timeout');
    ssdpClient.stop();
  }, 4000);

  return deferred.promise;
};

class BraviaDiscovery {
  constructor(ip, mac, filter) {
    this.ssdpClient = new SsdpClient();
    this.st = 'urn:schemas-sony-com:service:IRCC:1';
    this.url = `http://${ip}/sony`;

    this.ip = ip;
    this.mac = mac;
    this.filter = filter;
  }

  getUrl() {
    const deferred = Q.defer();

    const self = this;
    this.getIp().then((ip) => {
      deferred.resolve(self.url(ip));
    }, deferred.reject);

    return deferred.promise;
  }

  getIp() {
    const deferred = Q.defer();

    if (this.ip) {
      deferred.resolve(this.ip);
    } else {
      const self = this;
      const discover = () => {
        ssdpDiscover(self.ssdpClient, self.st, self.filter).then((ip) => {
          self.ip = ip;
          deferred.resolve(ip);
        }, deferred.reject);
      };

      if (this.mac) {
        wakeOnLan(this.mac).delay(1000).fin(discover);
      } else {
        discover();
      }
    }

    return deferred.promise;
  }
}

module.exports = BraviaDiscovery;
