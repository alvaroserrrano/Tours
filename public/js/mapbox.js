/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYXNlcnJhbm8iLCJhIjoiY2swenl3ZHNzMDBkYjNicWlobXRnaDltOSJ9.DYtnUVGsoT4bzssmGcfIUA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/aserrano/ck0zz7mgh0dk91cpfpz6a0agn',
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();
locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(
      `<p class=popup> <strong>Day ${loc.day}:</strong> ${loc.description}</p>`
    )
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
