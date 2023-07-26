// Fetch the JSON data and console log it
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  console.log(data);

  // Populate the dropdown with sample IDs
  var dropdown = d3.select("#selDataset");
  data.names.forEach(name => {
    dropdown.append("option").text(name).property("value", name);
  });

  // Draw the initial charts and display initial metadata
  optionChanged(data.names[0]);
});

// Function to draw charts and display metadata
function optionChanged(id) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    console.log(data);

    var sample = data.samples.filter(sample => sample.id === id)[0];
    var metadata = data.metadata.filter(meta => meta.id.toString() === id)[0];

    // Draw the bar chart
    var barTrace = {
      x: sample.sample_values.slice(0, 10).reverse(),
      y: sample.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text: sample.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };
    var barLayout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };
    Plotly.newPlot("bar", [barTrace], barLayout);

    // Draw the bubble chart
    var bubbleTrace = {
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: 'markers',
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids
      }
    };
    var bubbleLayout = {
      title: 'OTU ID',
      showlegend: false,
      height: 600,
      width: 1200
    };
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // Draw the gauge chart
    var gaugeData = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: metadata.wfreq,
          title: { text: "Belly Button Washing Frequency<br>Scrubs per Week", font: { size: 24 } },
          gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "aliceblue" },
              { range: [1, 2], color: "paleturquoise" },
              { range: [2, 3], color: "turquoise" },
              { range: [3, 4], color: "lightseagreen" },
              { range: [4, 5], color: "mediumaquamarine" },
              { range: [5, 6], color: "mediumseagreen" },
              { range: [6, 7], color: "seagreen" },
              { range: [7, 8], color: "forestgreen" },
              { range: [8, 9], color: "darkgreen" }
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: metadata.wfreq
            }
          }
        }
    ];
      
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

    // Display the metadata
    var infoPanel = d3.select("#sample-metadata");
    infoPanel.html("");
    Object.entries(metadata).forEach(([key, value]) => {
      infoPanel.append("h5").text(`${key}: ${value}`);
    });
  });
}
