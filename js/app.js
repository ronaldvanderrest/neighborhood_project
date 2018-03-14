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

// This function populates the infowindow specified with information of the 
// clicked location
function populateInfoWindow(marker, infowindow) {
	// check if the infowindow is already opened at the clicked marker
	if (infowindow.marker != marker) {
		// put the infowindow at the clicked marker
		infowindow.marker = marker;
		// lat and lon values from the marker for foursquare api search
		var lat = marker.getPosition().lat();
		var lng = marker.getPosition().lng();
		// set credentials for foursquare API (better to do on server-side though)
		var clientID="LI40PW0QW52Y4FZH00KGHABEF1DYGC1XDXZQZPP1NWX040CH";
		var clientSecret="TOE0DA20IJWW0LSG544ULBTL1VVKWDCU3J14H3XVF2FJQ5TF";
		// set foursquare url for getting details
		fsVenueDetailsUrl='https://api.foursquare.com/v2/venues/search?ll=' + lat + ',' + lng + '&query=' + encodeURIComponent(marker.title) + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180312';
		// set html variables to be filled by the ajax requests
		var venueDetailsHtml;
		var venuePhoto;

		// perform AJAX request to get venue details
		$.getJSON(fsVenueDetailsUrl, function(data){
			var venue = data.response.venues[0];
			var venueName = venue.name;
			var venueId = venue.id;
			var venueCategory = venue.categories[0].name;

			var fsPhotosUrl='https://api.foursquare.com/v2/venues/' + venueId + '/photos?' + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180312';
			// doing a synchronous request to load photo within the initial asynchronous request.
			// this prevents race condition
			$.ajax({
				async: false,
				url: fsPhotosUrl
			}).done(function(data){
				var debug = data.response.photos.items[0].suffix;
				var photoPrefix = data.response.photos.items[0].prefix;
				var photoSuffix = data.response.photos.items[0].suffix;
				venuePhoto = photoPrefix +'height100'+photoSuffix;
			})
			.fail(function( jqxhr, textStatus, error ) {
				var err = textStatus + ", " + error;
				console.log( "Request Failed: " + err );
			});


			venueDetailsHtml = '<div><h3>' + venueName + '</h3>' + '<h4>' + venueCategory + '</h4><img src=' + venuePhoto + '></div>';
			infowindow.setContent(venueDetailsHtml);
		}).fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
			infowindow.setContent('<div><h5>Failed to request Foursquare</h5></div>');
		});
		// set content in the infowindow
		infowindow.open(map, marker);
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick',function(){
		  infowindow.setMarker = null;
		});
	  }
}

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
	this.marker = ko.observable
};


var ViewModel = function() {
	var self = this;

	// Create a boundary variable
	var bounds = new google.maps.LatLngBounds();

	// Create an infowindow for when you select a location
	var infoWindow = new google.maps.InfoWindow();

	// Create observable for the searchbox
	this.searchBox = ko.observable("");

	// create an empty observable array
	this.locationList = ko.observableArray([]);

	// fill the empty observable array with the items from the model
	locations.forEach(function(location){
		self.locationList.push( new Location(location));
	});

	// iterate over the locations and create a marker. Also including it in the model
	self.locationList().forEach(function(location) {
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: location.location(),
			title: location.title(),
			animation: google.maps.Animation.DROP
		});
		location.marker = marker;
		// extend the boundary if the marker is outside it
		bounds.extend(marker.position);
		marker.addListener('click', function() {
			populateInfoWindow(this, infoWindow);
			});
	});
	// Apply the boundary to the map after all markers are created and extended
	// the boundary
	map.fitBounds(bounds);

	// Function that is invoked to select a location from the list
	this.selectLocation = function(clickedLocation) {
		populateInfoWindow(clickedLocation.marker, infoWindow);
	};

	this.locationFilteredList = ko.computed(function(){
		result = [];
		for (i = 0; i < self.locationList().length; i++) {
			var locationTitle = self.locationList()[i].title;
			if (locationTitle().toUpperCase().includes(self.searchBox().toUpperCase())) {
				self.locationList()[i].marker.setVisible(true);
				result.push(self.locationList()[i]);
			} else {
				self.locationList()[i].marker.setVisible(false);
			}
		}
		return result;
	}, this);
};
