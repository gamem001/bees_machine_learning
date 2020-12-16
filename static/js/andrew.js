const decline_url = '/api/v1.0/decline'

getData().catch(err => console.log(err));

async function getData() {
  const response = await fetch(decline_url);
  const data = await response.json();
  console.log(data);
}