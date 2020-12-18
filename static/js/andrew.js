const declineUrl = '/api/v1.0/decline'

async function getData() {
  const response = await fetch(declineUrl);
  const data = await response.json();
  // console.log(data);
  years = []
  states = []
  deadoutVals = []
  ccsynVals = []
  pestVals = []
  data.forEach(event => {
    years.push(event.year);
    states.push(event.state);
    deadoutVals.push(event.deadout);
    ccsynVals.push(event.cc_syn)
    pestVals.push(event.pesticides)
    console.log(event);
  });
}


getData().catch(err => console.log(err));