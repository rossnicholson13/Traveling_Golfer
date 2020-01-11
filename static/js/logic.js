// Creating map object
mapboxgl.accessToken = M_API_KEY
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9 // starting zoom
  });


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
  var address = input_address.split(" ");
  var search_address = "";
  for (x in address) {
    search_address += address[x] + "+";
  }
  search_address = search_address.substring(0, search_address.length - 1)
  var g_baseURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${search_address}&key=${G_API_KEY}`;

  d3.json(g_baseURL, function(data) {
    var user_lat = data.results[0].geometry.location.lat;
    var user_lng = data.results[0].geometry.location.lng;
    console.log(user_lat);
    console.log(user_lng);

    map.flyTo({center: [user_lat, user_lng], zoom: 11})

  });

});



// // Grab the data with d3
// d3.json(url, function(response) {

//   // Create a new marker cluster group
//   var markers = L.markerClusterGroup();

//   // Loop through data
//   for (var i = 0; i < response.length; i++) {

//     // Set the data location property to a variable
//     var location = response[i].location;

//     // Check for location property
//     if (location) {

//       // Add a new marker to the cluster group and bind a pop-up
//       markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
//         .bindPopup(response[i].descriptor));
//     }

//   }

//   // Add our marker cluster layer to the map
//   myMap.addLayer(markers);

// });
