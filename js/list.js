// These are the initial locations for the application to be shown
var initialLocations = [
    {title: 'Diergaarde Blijdorp', location: {lat: 51.92788645142215, lng: 4.445233869337291}},
    {title: 'Tennispark Aeolus Oledo', location: {lat: 51.92996436892242, lng: 4.450876329239069}},
    {title: 'Delftse Poort', location: {lat: 51.92380527384275, lng: 4.471525643229267}},
    {title: 'Guliano', location: {lat: 51.92358000080923, lng: 4.485203378547493}},
    {title: 'Bokaal', location: {lat: 51.92247410754488, lng: 4.488164449775141}}
];

// Making the titles of the locations into an Knockout observable
var Location = function(data){
    this.title = ko.observable(data.title);
    this.location = data.location;
};

var ViewModel = function() {
    var self = this;

    this.locationList = ko.observableArray([]);

    initialLocations.forEach(function(item){
        self.locationList.push( new Location(item));
    });

    // this.currentCat = ko.observable( this.catList()[0]);

    // this.incrementCounter = function() {
    //     this.clickCount(this.clickCount() + 1);
    // };
    // this.selectCat = function(clickedCat) {
    //     self.currentCat(clickedCat);
    // }
}

ko.applyBindings(new ViewModel())