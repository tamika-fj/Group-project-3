//Creating the map object
let myMap = L.map("map").setView([0, 0], 2);

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
let geoData = "http://127.0.0.1:5000/api/v1.0/world_smoking_stats_2000";

// Get the data with d3.
d3.json(geoData).then(function(data) {

  console.log(data, {});
  // Create a new choropleth layer.
  let geojson = L.choropleth(data, {

      // Define which property in the features to use.
      valueProperty: "Percentage Total",

      // Set the color scale.
      scale: ["#ffeda0", "#f03b20"],

      // The number of breaks in the step range, this means the number of colors in the shade range
      steps: 5,

      // q for quartile, e for equidistant, k for k-means, this is how the colors are assigned
      mode: "q",
      style: {
          // Border color
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8
      },

      // Binding a popup to each layer
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<strong>" + feature.properties.CountryName + "</strong><br /><br />Percentage of population that are smokers: " +
              feature.properties.PercentageTotal + "<br /><br />Percentage of smokers that are male: $" + feature.properties.PercentageMale +
              "<br /><br />Percentage of smokers that are female: $" + feature.properties.PercentageFemale);
      }
  }).addTo(myMap);

  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let limits = geojson.options.limits;
      let colors = geojson.options.colors;
      let labels = [];

      // Add the minimum and maximum.
      let legendInfo = "<h1>Percentage of population that are smokers</h1>" +
          "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);

});



