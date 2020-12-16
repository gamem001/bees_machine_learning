const decline_url = '/api/v1.0/decline'

fetch(decline_url)

    .then(response => response.json())
    .then((data) => {
      let allData = JSON.parse(data);

      console.log(allData)
})
.catch(err => console.log(err));