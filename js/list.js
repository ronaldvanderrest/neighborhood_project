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

var markers = []

// These are the initial locations for the application to be shown
var locations = [
    {title: 'Diergaarde Blijdorp', location: {lat: 51.92788645142215, lng: 4.445233869337291}},
    {title: 'Tennispark Aeolus Oledo', location: {lat: 51.92996436892242, lng: 4.450876329239069}},
    {title: 'Delftse Poort', location: {lat: 51.92380527384275, lng: 4.471525643229267}},
    {title: 'Guliano', location: {lat: 51.92358000080923, lng: 4.485203378547493}},
    {title: 'Bokaal', location: {lat: 51.92247410754488, lng: 4.488164449775141}}
];

// Making the titles of the locations into an Knockout observable
var Location = function(data){
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
};

var ViewModel = function() {
    var self = this;

    this.locationList = ko.observableArray([]);

    locations.forEach(function(item){
        self.locationList.push( new Location(item));
    });

    locations.forEach(function(location) {
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          map: map,
        	position: location.location,
          title: location.title,
          animation: google.maps.Animation.DROP
				});
				location.marker = marker;
    });
	};