var util = require('util'),
    twitter = require('twitter'),
    fs = require('fs');

var twit = new twitter({
    consumer_key: 'fsq4YbjfXuQWJRs01XatGQ',
    consumer_secret: 'lzXoLOGzxGYeItJ327BGSLcNmZcmPft62x0tHuZYmac',
    access_token_key: '35870660-0250Io0UYm5NHG6QgM7bq7h9aChvA30FIBYV0j1ql',
    access_token_secret: 'RFabG3sgMgg9DlwoWRZrQRIizQZultYvo2Ek9C0Xo'
});

twit.geoSearch('filter', {
  track: 'oow13',
  locations: '-180,-90,180,90'
}, function(stream) {
    stream.on('data', function(data) {
      var coordinates = null;

      if (data.coordinates) {
        coordinates = data.coordinates.coordinates;
        console.log(data.user.screen_name+': '+data.text, coordinates);
      }
      else {
        console.log('(no location data)');
      }
    });
});


    