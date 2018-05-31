/*-----------------------------------------------------------------------------------
//GOOGLE MAPS API--------------------------------------------------------------------
//---------------------------------------------------------------------------------*/
function initMap(){    
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.3879876, lng: -122.0913282},
        zoom: 13
    });

    //Create an empty single info window, which can hold data
    //when any of the markers is clicked.
    infoWindow = new google.maps.InfoWindow({
        content: ""
    }); 
    
        //Display Mountain View related Wikipedia links
        var timeoutForWiki = setTimeout(function(){
            $wikiElem.text("failed to load wikipedia links");
            }, 5000);
    
        $wikiElem = $('#wiki');
        var wikiUrl =  'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + 'Mountain_View'+'California' + '&format=json&callback=wikiCallback';
        $.ajax({
            url: wikiUrl,
            dataType: "jsonp"})
    
        .done(function(response){
            var articleList = response[1];
            for (var i =0; i<articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            clearTimeout(timeoutForWiki);        
        });     
    
        //Code to fetch the local news using the NY times api
        var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
        'api-key': "0474825e99f649bba0c792f75354f963",
        'q': "Mountain View, California"
        });
    
        $.getJSON( url, function (data){
        articles_list = data.response.docs;
        articles_list.forEach(displayNews);
        }).error(displayError);
    
        function displayNews(item,index){
        var list_item_html = ('<li class = "news_item"> <a href =' + item.web_url + '>' + item.headline.main + '</a> <p>'+ item.snippet + '</p></li>');
        $("#nytimes-articles").append(list_item_html);
        };
    
        function displayError(){
        var error_msg = ('<h1>'+ 'The New York Times article could not be loaded' + '</h1>');
        $("#nytimes-articles").append(error_msg);
        }
}

//This function creates the marker
function createMarker(markerData){ 
    markerPosition = {lat: markerData.lat , lng: markerData.lng};
    var marker = new google.maps.Marker({
        position: markerPosition,
        map: map,
        title: markerData.name
    });      

    //Add a listener event to markers for animating when clicked          
    marker.addListener('click',function(){
        setCurrentLocation(markerData.name);
        highlightMarker(self.currentSelectedLocation); 
    });  
    return marker; 
}

//Display relevant markers based on the selected menu option -Ex.Restaurants
function displayRelevantListings(typeOfListing){
    infoWindow.close();
   
    locationList.forEach(function(markerItem){        
       if(typeOfListing == markerItem.locationType || typeOfListing =='All'){        
            markerItem.marker.setVisible(true);

            //If the location is not available in the listing, push it
            var index = self.listings.indexOf(markerItem.name);
            if(index == -1){
                self.listings.push(markerItem.name);
            }                                     
       }
       else{
            markerItem.marker.setVisible(false);

            //This location should not be displayed as it doesn't belong to the selected listing category
            //Hence remove it from the listings
            var index = self.listings.indexOf(markerItem.name);           
            if (index > -1) {
                self.listings.splice(index, 1);
            }
       }
    });
}

function highlightMarker(selectedLocation){
    //animate marker
    selectedLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () { selectedLocation.marker.setAnimation(null);}, 1400);

    //populate info window
    infoWindow.setContent(selectedLocation.name);
    infoWindow.open(map,selectedLocation.marker);
}

function setCurrentLocation(name){
    var index = locationList.findIndex(x => x.name==name);
    self.currentSelectedLocation = locationList[index];
}
