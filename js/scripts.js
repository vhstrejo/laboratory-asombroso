
var pageURL = $(location).attr("href");
var biosampleId = null;
emptyUrl = window.location.href.indexOf('?')

/**
 * Checks if the provided biosample ID already exists.
 */
$checkOwner = async function (biosampleId) {
    await fetch(`https://app.genobank.io/biosamples/${biosampleId}`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.data.owner) { // already exists
          // TODO
        } else { // continue
          $('#invalidError').modal('show');
        }
      })
      .catch((error) => {
        alert('Error:', error);
        console.error('Error:', error);
      });
	}

$checkurl = function () {
	if (emptyUrl == -1) {
		$('#invalidError').modal('show');
	}  else {
		$('#invalidError').modal('hide');

    parts = pageURL.split("?")[1].split("#");
    parts = parts[0].split("&");
    biosampleId = parts[0].split("=")[1];
    timestamp = parts[1].split("=")[1];
    signature = parts[2].split("=")[1];
		$('#biosample').append(biosampleId);
	} 
}

$(function () {

  // Parse querystring and its parameters.
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const biosampleId = urlParams.get('biosampleId');

  $checkOwner(biosampleId);
  $checkurl();

});
