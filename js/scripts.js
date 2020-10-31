


var pageURL = $(location).attr("href");
var biosampleId = null;
parts = pageURL.split("?")[1].split("#");
parts = parts[0].split("&");
biosampleId = parts[0].split("=")[1];
timestamp = parts[1].split("=")[1];
signature = parts[2].split("=")[1];

$checkOwner = async function () {
    await fetch(`https://app.genobank.io/biosamples/`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.owner) { // already exists
            
        } else { // continue
             $('#invalidKit').modal('show');
        }
      })
      .catch((error) => {
        alert('Error:', error);
        console.error('Error:', error);
      });
	}

$(function () {

$checkOwner();
$('#biosample').append(biosampleId);

});
