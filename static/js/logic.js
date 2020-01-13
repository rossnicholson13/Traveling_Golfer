// Creating map object
mapboxgl.accessToken = "pk.eyJ1IjoiY2FtcGJlbGxwYXR0ZXIiLCJhIjoiY2s0YWlzMHFrMDRlaDNlcnVsNDFkZTFqeiJ9.oimhst2_Ab58xGRdkK3wfw";
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-96.7, 38.5], // starting position [lng, lat]
  zoom: 3.5, // starting zoom
  pitch: 45,
  bearing: 0
});

// Creating url to Google Maps based on event from user submitting address, pulling user latlng
var button = d3.select("#enter-address");
var inputField = d3.select("#input-address");

inputField.on("change", function() {

  //value from address box
  var input_address = d3.event.target.value;

  //parsing input into google happy url
  var address = input_address.split(" ");
  var search_address = "";
  for (x in address) {
    search_address += address[x] + "+";
  }
  search_address = search_address.substring(0, search_address.length - 1)

  //geocode call
  var g_baseURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${search_address}&key=${G_API_KEY}`;

  //getting user latlng to center map
  d3.json(g_baseURL, function(data) {
    var user_lat = data.results[0].geometry.location.lat;
    var user_lng = data.results[0].geometry.location.lng;

    //pulling relevant database headers
    d3.csv("../../csv_files/course_db.csv", function(d) {
      return {
        lat: d.Latitude,
        lng: d.Longitude,
        name: d.Name,
        info: d.Info

      };

    }, function(error, rows) {
  
      //filtering by nearby lat lngs
      var newArray = rows.filter(function (el) {
        return el.lat <= (user_lat + 0.1) && 
        el.lat >= (user_lat - 0.4) &&
        el.lng <= (user_lng + 0.4) &&
        el.lng >= (user_lng - 0.4)
      });

      console.log(newArray);

      //placing markers in a for loop
      const values = Object.values(newArray);
      for (const course of values) {

        var course_info = '{ ' + course.info.slice(1, course.info.length)
        .replace("Women\'s", "Mens")
        .replace("Men\'s", "Mens")
        .replace(/'/g, "\"");

        var info_json = JSON.parse(course_info);

        console.log(info_json);

        var description = '<p> <strong>' + course.name + '</strong> <br> <table class="table table-dark"> <thead> <tr> <th scope="col">Gender</th> <th scope="col">Teebox</th> <th scope="col">USGA Rating</th> <th scope="col">Bogey Rating</th> <th scope="col">Slope</th> </tr> </thead> <tbody>';
        var count = 0
        for (const tee of info_json.Tee) {
          description += '<tr> <td>' + info_json.Gender[count] + '</td> <td>' + info_json.Tee[count] + '</td> <td>' + info_json.USGA_Rating[count] + '</td> <td>' + info_json.Bogey_Rating[count] + '</td> <td>' + info_json.Slope_Rating[count] +'</td> </tr>';
          count += 1;
        }

        description += '</tbody> </table> </p>';

        var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(description)
          

        var marker = new mapboxgl.Marker()
        .setPopup(popup)
        .setLngLat([course.lng,course.lat])
        .addTo(map);
      }
      
      

    });

    map.flyTo({center: [user_lng, user_lat], zoom: 10})

  });

});
