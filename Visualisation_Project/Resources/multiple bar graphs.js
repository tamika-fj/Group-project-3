// Save the URL as a constant variable
const url = "http://127.0.0.1:5000/api/v1.0/socioeconomic_2012";

// Function to read data and create the scatter plot
function createBarChart(selectedFactor) {
  // Use D3 library to read in data from the API
  d3.json(url).then(function (data) {
    console.log(data); // Verify that data is loaded correctly

      // Sort the data based on the selected socioeconomic factor
      data.sort((a, b) => b[selectedFactor] - a[selectedFactor]);

      // Select the top 10 items from the sorted data
      const top10Data = data.slice(0, 10);
      const bottom10Data = data.slice(-10);


    // Create a dropdown menu with the socioeconomic factors as options
    let dropdownMenu = d3.select("#selDataset");
    let factors = Object.keys(top10Data[0]).filter((key) => key !== "Country");
    dropdownMenu.selectAll("option").remove(); // Remove existing options
    factors.forEach((factor) => {
      dropdownMenu.append("option").text(factor).property("value", factor);
    });

  // Initialize and update the top 10 and bottom 10 bar charts
  updatePlotly("top10-bar", top10Data, selectedFactor, "Top 10");
  updatePlotly("bottom10-bar", bottom10Data, selectedFactor, "Bottom 10");
});
}

// Function called by DOM changes
function getData() {
  let dropdownMenu = d3.select("#selDataset");
  let selectedFactor = dropdownMenu.property("value");

  // Use D3 to fetch the data
  d3.json(url).then(function (data) {
    // Extract the selected socioeconomic factor values (y-axis)
    let xValues = data.map((entry) => entry["Country"]);
    let y1Values = data.map((entry) => entry[selectedFactor]);
    let y2Values = data.map((entry) => entry["Percentage Total"]);

    // Create the barchart data
    let barData = [
      {
        x: xValues,
        y: y1Values,
        type: "bar",
        name: selectedFactor,
        marker: { colour: "blue" }
      },
      {
        x: xValues,
        y: y2Values,
        type: "bar",
        name: "Percentage Total",
        marker: { colour: "orange" },
        yaxis: "y2", // Use the secondary y-axis
      },
    ];
    
    // Update the plot with the new data
    updatePlotly(barData, selectedFactor);

    // Determine which chart is being updated based on the selectedFactor
    if (selectedFactor === "GDP per capita") {
      updatePlotly("top10-bar", barData.slice(0, 10), selectedFactor, "Top 10");
      updatePlotly("bottom10-bar", barData.slice(-10), selectedFactor, "Bottom 10");
    } else if (selectedFactor === "Health Expenditure") {
      // Update for another socioeconomic factor if needed
    } else if (selectedFactor === "Unemployment") {
      // Update for another socioeconomic factor if needed
    }
  });
}

// Initialize the page with a default factor
createBarChart("GDP per capita");

// Event listener for changes to the dropdown
d3.select("#selDataset").on("change", getData);

// Function to update the plot
function updatePlotly(chartDivId, data, selectedFactor, chartTitle) {
  // If the plot doesn't exist, create it with initial data
  Plotly.newPlot(chartDivId, data, {
    xaxis: { title: "Country" }, // Set the x-axis label
    yaxis: { title: selectedFactor }, // Set the y-axis label
    yaxis2: {
      title: "Percentage of Population who smoke",
      overlaying: "y",
      side: "right",
    },
    title: chartTitle,
  });
}

