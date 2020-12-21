
let dropItems = ['Bee Colonies','Pounds of Honey']
// let whatever = {'Bee Colonies':'tot_homeless','Pounds of Honey':'avg_income'}

dropItems.forEach(dropDownMenu => {
    d3.select("#selDataset")
    // option is the html element
    .append("option")
    .text(dropDownMenu)
    .property("value", dropDownMenu)
});

// listens for when there is a change to the selDataset, when there is a change then it runs function updateDisplay
d3.selectAll('#selDataset').on("change", handleSubmit); 


function handleSubmit() {
    // use this to prevent the page from refreshing... may or may not be necessary.
    d3.event.preventDefault();

    // select the value from the dropdown
    let selectedId = d3.select('#selDataset').node().value;

    //let selectedObj = whatever[selectedId] 
    console.log(selectedId);

    // build your plots
    buildMap(selectedId);
};

function buildMap(bee) {
// import flower with d3 and json and set dropdown menu to names array
    // bee = 'Pounds of Honey'
        const url = "/api/v1.0/honey";
        d3.json(url).then(function(response) {
            let honeyData = response;
            console.log(honeyData)
            let honeyByYear = {'state':[], 
                            'state_abbrev':[],
                            'year':[],
                            'lbs_of_honey':[]
                        };
    
            honeyData.forEach(function(flower) {
    
                honeyByYear.state.push(flower.state);
                honeyByYear.state_abbrev.push(flower.Code);
                honeyByYear.year.push(flower.year);
                honeyByYear.lbs_of_honey.push(flower.lbs_of_honey);  
            });  
    
            //console.log(state_abbrev);
            //console.log(rent_data);
            console.log(honeyByYear['lbs_of_honey']);
            //console.log(honeyByYear[bee]);
            
            
            var frames = []
            var slider_steps = []
          
            var n = 32;
            var num = 1987;
            for (var i = 0; i <= n; i++) {
              var z = honeyByYear.i.lbs_of_honey
              var locations = honeyByYear.i.state_abbrev
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
            }
            
            let choroData = [{
                type: 'choropleth',
                locationmode: 'USA-states',
                // locations: honeyByYear['state_abbrev'],
                // z: honeyByYear['lbs_of_honey'],
                locations: frames[0].data[0].locations,
                z: frames[0].data[0].z,
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
    
            Plotly.newPlot("choropleth", choroData, layout).then(function(){
                Plotly.addFrames("choropleth",frames);
            });
    
        console.log(honeyData);
        });
    };
//     else  {
//         const url2 = "/api/v1.0/col";
//         d3.json(url2).then(function(response) {
//             let colonyData = response;
//             let colonyByYear = {'state':[], 
//                             'state_abbrev':[],
//                             'year':[],
//                             'colonies':[]
//                         };
    
//             colonyData.forEach(function(buzz) {
    
//                 colonyByYear.state.push(buzz.state);
//                 colonyByYear.state_abbrev.push(buzz.Code);
//                 colonyByYear.year.push(buzz.year);
//                 colonyByYear.colonies.push(buzz.count_colonies);  
//             });  
    
//             console.log(colonyByYear['colonies']);
//             console.log(honeyByYear[buzz]);
    
            
//             let choroData = [{
//                 type: 'choropleth',
//                 locationmode: 'USA-states',
//                 locations: colonyByYear['state_abbrev'],
//                 z: colonyByYear['colonies'],
//                 //text: honeyByYear['state_name'],
//                 colorscale: 'solar',
//                 colorbar: {
//                     title: "Colonies",
//                     thickness: 10},
//                 marker: {
//                     line:{
//                         color: 'rgb(200,200,200)',
//                         width: 1}
//                 }
//             }];

//             var layout = {
//                 title: 'Colonies by State',
//                 geo:{
//                     scope: 'usa'
//                 },
//                 updatemenus: [{
//                     x: 0.1,
//                     y: 0,
//                     yanchor: "top",
//                     xanchor: "right",
//                     showactive: false,
//                     direction: "left",
//                     type: "buttons",
//                     pad: {"t": 87, "r": 10},
//                     buttons: [{
//                       method: "animate",
//                       args: [null, {
//                         fromcurrent: true,
//                         transition: {
//                           duration: 200,
//                         },
//                         frame: {
//                           duration: 500
//                         }
//                       }],
//                       label: "Play"
//                     }, {
//                       method: "animate",
//                       args: [
//                         [null],
//                         {
//                           mode: "immediate",
//                           transition: {
//                             duration: 0
//                           },
//                           frame: {
//                             duration: 0
//                           }
//                         }
//                       ],
//                       label: "Pause"
//                     }]
//                   }],
//                   sliders: [{
//                     active: 0,
//                     steps: slider_steps,
//                     x: 0.1,
//                     len: 0.9,
//                     xanchor: "left",
//                     y: 0,
//                     yanchor: "top",
//                     pad: {t: 50, b: 10},
//                     currentvalue: {
//                       visible: true,
//                       prefix: "Year:",
//                       xanchor: "right",
//                       font: {
//                         size: 20,
//                         color: "#666"
//                       }
//                     },
//                     transition: {
//                       duration: 300,
//                       easing: "cubic-in-out"
//                     }
//                   }]
            
//             };
    
//             Plotly.newPlot("choropleth", choroData, layout).then(function(){
//                 Plotly.addFrames("choropleth",frames);
//             });
    
//         console.log(honeyData);
//         });
//     };
// };









