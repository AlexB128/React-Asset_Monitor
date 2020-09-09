const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const { text } = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const data = fs.readFileSync('./apiserver.json');
const conf = JSON.parse(data);

//----------------------------------------------------------------------
const dev = {
  url: conf.dev.url,
  headers: conf.dev.headers
}
const staging = {
  url: conf.staging.url,
  headers: conf.staging.headers
}
//----------------------------------------------------------------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//----------------------------------------------------------------------
// sumitomo-dev/api/assets
//----------------------------------------------------------------------
app.get('/api/assets', (req, res) => {
  
  let assets = [];

  fetch(dev.url + 'assets?query=' + '{"FILTERS": [[{"EQ": [{"type": "tank_car"}]}]], "SORT":[{"ASC":"id"}]}', { method: 'GET', headers: dev.headers})
  //fetch(dev.url + 'assets', { method: 'GET', headers: dev.headers})
    .then(res => res.json())
	  .then(json => {
      json.DATA.map(asset => {
        // console.log(asset);
        assets.push({
          id: asset.id,
          label: asset.label,
          lat: asset.latitude,
          lng: asset.longitude,
          custom_data: JSON.parse(asset.custom_data)
        })
      })
      res.send(assets)
    })
    .catch(err => {
      console.log(err);
    });
});

//----------------------------------------------------------------------
// sumitomo-dev/api/areas
//----------------------------------------------------------------------
app.get('/api/areas', (req, res) => {
  
  let areas = [];

  fetch(dev.url + 'areas', { method: 'GET', headers: dev.headers})
    .then(res => res.json())
	  .then(json => {
      json.DATA.map(area => {
        // console.log(area);
        areas.push({
          id: area.id,
          label: area.label,
          lat: area.latitude,
          lng: area.longitude,
          polygon: JSON.parse(area.polygon)
        })
      })
      res.send(areas)
    })
    .catch(err => {
      console.log(err);
    });
});

//----------------------------------------------------------------------
// sumitomo-staging/device_1_temperatures
//----------------------------------------------------------------------
app.get('/api/device_1_temperatures', (req, res) => {
// app.get('/api/device_1_temperatures', (req, res) => {
  
  let plotData = [];

  fetch(staging.url + 'device_1_temperatures?query=' + '{ "PAGESIZE" : 200, "SORT":[{"DESC":"timestamp"}] }', { method: 'GET', headers: staging.headers })
    .then(res => res.json())
	  .then(json => {
      json.DATA.reverse().forEach(t => {
        plotData.push({
          timestamp: t.timestamp,
          temperature: t.temperature,
        })
      })
      res.send(plotData)
    })
    .catch(err => {
      console.log(err);
    });
});

//----------------------------------------------------------------------
// sumitomo-dev/demo1 (code)
//----------------------------------------------------------------------
app.post('/api/assets/:asset_id', (req, res) => {
  let movex = req.body.movex;
  let movey = req.body.movey;
  let lng = req.body.lng;
  let lat = req.body.lat;
  let asset_id = req.params.asset_id;

  let headers = dev.headers;
  headers['Content-Type'] = 'application/json';
  let body = JSON.stringify({ 
    asset_id: asset_id, 
    movex: parseFloat(movex),
    movey: parseFloat(movey), 
    lng: parseFloat(lng),
    lat: parseFloat(lat) 
  });
  let url = dev.url.replace('collection', 'code') + 'demo1';
  // console.log(body);
  // console.log(url);

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body
  };
  fetch(url, requestOptions)
    .then(response => response.json())
    .then(json => {
      res.send(json)
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/api/messages', (req, res) => {
  let topic = req.body.topic;
  let msg = req.body.msg;

  let headers = staging.headers;
  headers['Content-Type'] = 'application/json';
  let body = JSON.stringify({ 
    topic: topic, 
    body: msg
  });
  let url = staging.url.replace('collection', 'message') + 'publish';
  // console.log(body);
  // console.log(url);

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body
  };
  fetch(url, requestOptions)
    .then(response => response )  //response.json())
    .then(text => {
      res.send(text)
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
