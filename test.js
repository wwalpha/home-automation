const SsdpClient = require('node-ssdp').Client;
const Q = require('q');
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

const ssdpDiscover = (ssdpClient, st, filter) => {
  const deferred = Q.defer();
  let timer = null;

  ssdpClient.on('response', (headers, statusCode, rinfo) => {
    console.log(33333);
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

  ssdpClient.search('urn:dial-multiscreen-org:service:dial:1');

  console.log(8777);
  timer = setTimeout(() => {
    deferred.reject('Discovery timeout');
    console.log(9999);
    ssdpClient.stop();
  }, 4000);

  return deferred.promise;
};

const ssdpClient = new SsdpClient();
const st = 'urn:schemas-sony-com:service:IRCC:1';

ssdpDiscover(ssdpClient, st);
