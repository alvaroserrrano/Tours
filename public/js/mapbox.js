/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken =
  'pk.eyJ1IjoiYXNlcnJhbm8iLCJhIjoiY2swenl3ZHNzMDBkYjNicWlobXRnaDltOSJ9.DYtnUVGsoT4bzssmGcfIUA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/aserrano/ck0zz7mgh0dk91cpfpz6a0agn'
});
