
var pageURL = $(location).attr("href");
var biosampleId = null;
emptyUrl = window.location.href.indexOf('?')
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

$checkurl = function () {
	if (emptyUrl == -1) {

	}  else {

		

parts = pageURL.split("?")[1].split("#");
parts = parts[0].split("&");
biosampleId = parts[0].split("=")[1];
timestamp = parts[1].split("=")[1];
signature = parts[2].split("=")[1];
		$('#biosample').append(biosampleId);
	} 
}

$clearFields = function () {
  $('input, textarea').each(function() {

		var default_value = this.value;

		$(this).focus(function(){
				if(this.value == default_value) {
						this.value = '';
				}
		});

		$(this).blur(function(){
				if(this.value == '') {
						this.value = default_value;
				}
    });
  });
}

$(function () {

  $checkOwner();

  $clearFields();
});
