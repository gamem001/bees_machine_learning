const declineUrl = '/api/v1.0/decline'

getData().catch(err => console.log(err));

async function getData() {
  const response = await fetch(declineUrl);
  const data = await response.json();
  console.log(data);
}