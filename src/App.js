import React, { Component } from 'react';
import './App.css';
import Places from "./Places"
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //locations to locate on maps
      locations: [

        {
          'name': "Kapaleesvarar temple",
          'type': "place_of_worship",
          'latitude': 13.03376,
          'longitude': 80.269916,
          'Address': "Kapaleesvarar Sannadhi Street, Vinayaka Nagar Colony, Mylapore, Vinayaka Nagar Colony, Mylapore"
        },
        {
          'name': "Phoenix Mall",
          'type': "restaurant",
          'latitude': 12.991603,
          'longitude': 80.216859,
          'Address': " 142, Velachery Road, Indira Gandhi Nagar"
        },

        {

          'name': "Periyar Science center",
          'type': "Planetarium",
          'latitude': 13.011933,
          'longitude': 80.244037,
          'Address': "Gandhi Mandapam Rd, Duraisamy Nagar, Kotturpuram "
        },
        {

          'name': "Ratna cafe",
          'type': "restaurant",
          'latitude': 13.06003,
          'longitude': 80.274356,
          'Address': " No. 104, Triplicane High Rd, Ellis Puram, Padupakkam, Triplicane"
        },
        {

          'name': "St.George Cathedral",
          'type': "church",
          'latitude': 13.051384,
          'longitude': 80.251961,
          'Address': " Gopalapuram, Chennai"
        }, {
          'name': "Vadapalani Murugan Temple",
          'type': "amusement_park",
          'latitude': 13.052842,
          'longitude': 80.213521,
          'Address': " Palani Andavar Koil St, Vadapalani"
        }
      ],
      map: '',
      infowindow: ''
    };
    this.initMap = this.initMap.bind(this);
    this.populateInfoWindow = this.populateInfoWindow.bind(this);
  }
  componentDidMount() {
    window.initMap = this.initMap;
    loadMap("https://maps.googleapis.com/maps/api/js?key=AIzaSyBrOcU7ykHU1rWiGXUe871FeKpjdjz3SzM&v=3&callback=initMap");
  }
  initMap() {
    //styles for styling google map
    var styles = [{
        featureType: "water",
        stylers: [{
          color: "#b5cbe4"
        }]
      },
      {
        featureType: "landscape",
        stylers: [{
          color: "#efefef"
        }]
      },
      {
        featureType: "road.highway",
        stylers: [{
          color: "#83a5b0"
        }]
      }
    ];
    var call = this;
    var map;
    // Constructor for creating new map 
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 13.051384,
        lng: 80.251961
      },
      zoom: 12,
      mapTypeControl: false,
      styles: styles

    });
    //constructor for creating infowindow
    var largeInfowindow = new window.google.maps.InfoWindow();
    this.setState({
      map: map,
      infowindow: largeInfowindow
    });

    var locations1 = [];

    //assigning markers for every locations
    this.state.locations.forEach(function (location) {
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(location.latitude, location.longitude),
        animation: window.google.maps.Animation.DROP,
        map: map,
      });

      
      marker.addListener('click', function () {
        call.populateInfoWindow(marker);

      });


      location.marker = marker;
      location.display = true;
      locations1.push(location);

    })


    this.setState({
      locations: locations1
    });

  }
  //function for creating infowindow
  populateInfoWindow(marker) {
    var call = this;
    this.closeinfowindow(marker);
    let info = this.state.infowindow;
    if (info.marker !== marker) {
      info.marker = marker;
      info.open(this.state.map, marker);
      info.setContent('Loading Data...');
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout((function () {
        marker.setAnimation(null);
      }), 2000);
      info.addListener('closeclick', function () {
        call.closeinfowindow(marker)
      });
      this.getDetails(marker);
    }
    this.setState({
      infowindow: info
    });
  }
  //function to close infowindow
  closeinfowindow(marker) {
    var close = this.state.infowindow;
    close.marker = null;
    this.setState({
      infowindow: close
    });
  }
  //display informations in infowindow
  getDetails(marker) {
    var call = this;
    //foursqquare api is used for fetching informations
    var clientId = "F1CKEDRNW20PL2AUGX5UGQJXUGQ3IFYP3W3NV4U1TGNADZ1H";
    var clientSecret = "S0QVTQU0ZL3OEXUBQAS14HHDLA44NRHISAXWO0BG4SLNQALA";
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
    fetch(url)
      .then(
        function (response) {
          if (response.status !== 200) {
            call.state.infowindow.setContent("Data not loading... ");
            return;
          }
          //using response from foursquare we are placing informations in infowindow
          response.json().then(function (data) {
            var obtained_data = data.response.venues[0];
            var loc_name = '<b>Name : </b>' + (obtained_data.name) + '<br>';
            var loc_cat = '<b>category : </b>' + (obtained_data.categories[0].name) + '<br>';

            var readMore = '<a href="https://foursquare.com/v/' + obtained_data.id + '" target="_blank">View for Details</a>'
            call.state.infowindow.setContent(loc_name + loc_cat + readMore); 
          });
        }
      )
      .catch(function (err) {
        call.state.infowindow.setContent("Error happened in Data loading");
      });
  }
 
  render() {

    return (
      <div className="App">
      <header>
       <Places  locations={this.state.locations} infowindow={this.populateInfoWindow}/>  
        <h1 id="title">Chennai</h1>

      </header>
     <div id="map-container">
                <div id="map" role="application">

                </div>
            </div>

    </div>
    );
  }
}

export default App;

function loadMap(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("GOOGLE MAPS IS NOT LOADED!!");
  };
  ref.parentNode.insertBefore(script, ref);
}
