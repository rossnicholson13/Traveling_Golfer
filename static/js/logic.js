// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: M_API_KEY
}).addTo(myMap);

// Store API query variables
var baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
var date = "$where=created_date between'2016-01-10T12:00:00' and '2017-01-01T14:00:00'";
var complaint = "&complaint_type=Rodent";
var limit = "&$limit=10000";

// Assemble API query URL
var url = baseURL + date + complaint + limit;

d3.csv("../../csv_files/course_details_geocoding.csv", function(d) {
  return {
    lat: d.Latitude,
    lng: d.Longitude,
  };
}, function(error, rows) {
  console.log(rows);
});

// Creating url to Google Maps based on event from user submitting address, pulling user latlng
var button = d3.select("#enter-address");
var inputField = d3.select("#input-address");

inputField.on("change", function() {
  var input_address = d3.event.target.value;
  console.log(input_address);
  var address = input_address.split(" ");
  var search_address = "";
  for (x in address) {
    search_address += address[x] + "+";
  }
  search_address = search_address.substring(0, search_address.length - 1)
  console.log(search_address);
  var g_baseURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${search_address}&key=${G_API_KEY}`;
  console.log(g_baseURL)

  d3.json(g_baseURL, function(data) {
    console.log(data);
  });
});



// Grab the data with d3
d3.json(url, function(response) {

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.length; i++) {

    // Set the data location property to a variable
    var location = response[i].location;

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
        .bindPopup(response[i].descriptor));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});
