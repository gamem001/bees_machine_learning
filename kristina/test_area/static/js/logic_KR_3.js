const url = "/api/v1.0/honey";
Plotly.d3.json(url), function(err, rows){

    console.log(rows)
    
  function filter_and_unpack(rows, key, year) {
  return rows.filter(row => row['year'] == year).map(row => row[key])
  }
  var n = 32;
  var num = 1987;
  for (var i = 0; i <= n; i++) {
    var z = filter_and_unpack(rows, 'lbs_of_honey', num)
    var locations = filter_and_unpack(rows, 'Code', num)
    frames[i] = {data: [{z: z, locations: locations, text: locations}], name: num}
    slider_steps.push ({
        label: num.toString(),
        method: "animate",
        args: [[num], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300}
          }
        ]
      })
    num = num + 1
  };

  let choroData = [{
    type: 'choropleth',
    locationmode: 'USA-states',
    locations: honeyByYear['state_abbrev'],
    z: honeyByYear['lbs_of_honey'],
    //text: honeyByYear['state_name'],
    colorscale: 'solar',
    colorbar: {
        title: 'lbs of honey',
        thickness: 10},
    marker: {
        line:{
            color: 'rgb(200,200,200)',
            width: 1}
    }
}];

var layout = {
    title: 'Production of Honey',
    geo:{
        scope: 'usa'
    },
    updatemenus: [{
        x: 0.1,
        y: 0,
        yanchor: "top",
        xanchor: "right",
        showactive: false,
        direction: "left",
        type: "buttons",
        pad: {"t": 87, "r": 10},
        buttons: [{
          method: "animate",
          args: [null, {
            fromcurrent: true,
            transition: {
              duration: 200,
            },
            frame: {
              duration: 500
            }
          }],
          label: "Play"
        }, {
          method: "animate",
          args: [
            [null],
            {
              mode: "immediate",
              transition: {
                duration: 0
              },
              frame: {
                duration: 0
              }
            }
          ],
          label: "Pause"
        }]
      }],
      sliders: [{
        active: 0,
        steps: slider_steps,
        x: 0.1,
        len: 0.9,
        xanchor: "left",
        y: 0,
        yanchor: "top",
        pad: {t: 50, b: 10},
        currentvalue: {
          visible: true,
          prefix: "Year:",
          xanchor: "right",
          font: {
            size: 20,
            color: "#666"
          }
        },
        transition: {
          duration: 300,
          easing: "cubic-in-out"
        }
      }]

};

Plotly.newPlot("myDiv", choroData, layout).then(function(){
    Plotly.addFrames("myDiv",frames);
});

console.log(honeyData);
};
