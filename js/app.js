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
	
  ko.applyBindings(new ViewModel())
};

// Model
// These are the initial locations for the application to be shown
var locations = [
    {title: 'Diergaarde Blijdorp', location: {lat: 51.92788645142215, lng: 4.445233869337291}},
    {title: 'Tennispark Aeolus Oledo', location: {lat: 51.92996436892242, lng: 4.450876329239069}},
    {title: 'Delftse Poort', location: {lat: 51.92380527384275, lng: 4.471525643229267}},
    {title: 'Guliano', location: {lat: 51.92358000080923, lng: 4.485203378547493}},
    {title: 'Bokaal', location: {lat: 51.92247410754488, lng: 4.488164449775141}}
];

// Template to make Locations into an observable
var Location = function(data){
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};


var ViewModel = function() {
	var self = this;

	// Create a boundary variable
	var bounds = new google.maps.LatLngBounds();

	// create an empty observable array
	this.locationList = ko.observableArray([]);

	// fill the empty observable array with the items from the model
	locations.forEach(function(item){
			self.locationList.push( new Location(item));
	});

	// iterate over the locations and create a marker. Also including it in the model
	locations.forEach(function(location) {
			// Create a marker per location, and put into markers array.
			var marker = new google.maps.Marker({
				map: map,
				position: location.location,
				title: location.title,
				animation: google.maps.Animation.DROP
			});
			location.marker = marker;
			// extend the boundary if the marker is outside it
			bounds.extend(marker.position);
	});
	// Apply the boundary to the map
  map.fitBounds(bounds);
};