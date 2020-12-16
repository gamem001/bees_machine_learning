const declineUrl = '/api/v1.0/decline'

async function getData() {
  const response = await fetch(declineUrl);
  const data = await response.json();
  // console.log(data);
  data.forEach(event => {
    const state = event.state
    const year = event.year  
  });
}
getData().catch(err => console.log(err));