//MVVM architecture------------------

function ViewModel(){   
    
    self = this;

    //Drop-down selection list
    self.availableListingOptions= ko.observableArray(['All','Restaurants', 'Coffee Shops','Transit Stations', 'Parks', 'Fitness Centres', 'Libraries']);
    self.selectedListing = ko.observable('All');
    self.listings = ko.observableArray([]);
    self.selectedLocationName = ko.observable();
    self.currentSelectedLocation = ko.observable();    

    //Initialize the app by displaying map and markers
    self.initializeApp = function(){
        //Initialize the map
        initMap();

        //Create location objects
        markersData.forEach(function(markerData){            
            locationList.push(new Location(markerData));

            //push the created location to the list to be displayed
            self.listings.push(markerData.name)
        });      
    }();     
   
    //Handle the menu selection
    self.handleMenuSelection = function(){
        displayRelevantListings(this.selectedListing());
    }

    //Handle the list item
    self.handleListItemClick = function(){      
        self.selectedLocationName = this;
        var index = locationList.findIndex(x => x.name==self.selectedLocationName);
        self.currentSelectedLocation = locationList[index];
        highlightMarker(self.currentSelectedLocation);       
    }    
}

//Callback from googleMap api script
function init(){
    var viewModelObj = new ViewModel();
    ko.applyBindings(viewModelObj);
}

