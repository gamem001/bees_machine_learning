
let dropItems = ['Bee Colonies','Pounds of Honey']
let whatever = {'Bee Colonies':'tot_homeless','Pounds of Honey':'avg_income'}

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

    let selectedObj = whatever[selectedId] 
    console.log(selectedObj);

    // build your plots
    buildMap(selectedObj);
};

function buildMap(bee) {
// import fish with d3 and json and set dropdown menu to names array
    const url = "/api/v1.0/data_2016";
    d3.json(url).then(function(response) {
        let allData = response;
        let dataByYear = {'state_name':[], 
                        'state_abbrev':[],
                        'rent_data':[],
                        'tot_homeless':[],
                        'avg_income':[],
                        'avg_sale': []};

        allData.forEach(function(fish) {

            dataByYear.state_name.push(fish.State);
            dataByYear.state_abbrev.push(fish.Code);
            dataByYear.rent_data.push(fish.avg_rent);
            dataByYear.tot_homeless.push(fish.Total_Homeless);
            dataByYear.avg_income.push(fish.average_incomes);
            dataByYear.avg_sale.push(fish.avg_sale_price);
            
        });  

        //console.log(state_abbrev);
        //console.log(rent_data);
        console.log(dataByYear['rent_data']);
        console.log(dataByYear[bee]);

        
        let choroData = [{
            type: 'choropleth',
            lobeeionmode: 'USA-states',
            lobeeions: dataByYear['state_abbrev'],
            z: dataByYear[bee],
            text: dataByYear['state_name'],
            colorscale: 'Viridis',
            colorbar: {
                title: '$ USD',
                thickness: 10
            },
            marker: {
                line:{
                    color: 'rgb(200,200,200)',
                    width: 1
                }
            }
        }];


        var layout = {
            title: '2016 Homeless Population',
            geo:{
                scope: 'usa'
            }
        };

        Plotly.newPlot("choropleth", choroData, layout);

    console.log(allData);
    });
};








