var map;
// Create a new blank array for all the listing markers.
var markers = [];

// Initialise the map
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13,
    mapTypeControl: true
  });
};