const ssdp = require('node-upnp-ssdp');
const UPnPDeviceClient = require('upnp-device-client');

ssdp.on('DeviceFound', (info) => {
  console.log(33333);
  const client = new UPnPDeviceClient(info.location);
  client.getDeviceDescription((err, device) => {
    if (!err) {
      console.log(`UPnP: Device ${device.friendlyName} found`);
    } else {
      console.error(`UPnP: ${err}`);
    }
  });
});

// ssdp.mSearch('upnp:rootdevice');
// ssdp.mSearch('ssdp:all');
ssdp.mSearch('urn:schemas-sony-com:service:IRCC:1');
