// Creating map object
mapboxgl.accessToken = "pk.eyJ1IjoiY2FtcGJlbGxwYXR0ZXIiLCJhIjoiY2s0YWlzMHFrMDRlaDNlcnVsNDFkZTFqeiJ9.oimhst2_Ab58xGRdkK3wfw";
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-96.7, 38.5], // starting position [lng, lat]
  zoom: 3.5 // starting zoom
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

    d3.csv("../../csv_files/final_db.csv", function(d) {
      return {
        lat: d.Latitude,
        lng: d.Longitude,
        name: d.Name,
      };
    }, function(error, rows) {
  
      var newArray = rows.filter(function (el) {
        return el.lat <= (user_lat + 0.1) && 
        el.lat >= (user_lat - 0.2) &&
        el.lng <= (user_lng + 0.2) &&
        el.lng >= (user_lng - 0.2)
      });

      console.log(newArray);

      const values = Object.values(newArray);

      for (const course of values) {
        console.log(course);
        var popup = new mapboxgl.Popup({ offset: 25 }).setText(
          course.name
        );

        var marker = new mapboxgl.Marker()
        .setLngLat([course.lng,course.lat])
        .setPopup(popup)
        .addTo(map);
      }

    });

    map.flyTo({center: [user_lng, user_lat], zoom: 10})
  });



});
