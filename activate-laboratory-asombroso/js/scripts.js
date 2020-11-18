// Global variables
const wallet = ethers.Wallet.createRandom();
generatePhrase = wallet.mnemonic.phrase;
generatePrivatekey = wallet.privateKey;
generateAddress = wallet.address;

arrayPhrase = generatePhrase.split(" ");

arr1 = arrayPhrase;
arr2 = [];

var pageURL = $(location).attr("href");

var biosampleId = null;
var permiteeId = null;
var biosampleSecret = null;

// todays date
var d = new Date();

var month = d.getMonth()+1;
var day = d.getDate();

var signatureDate = 
  ((''+month).length<2 ? '0' : '') + month + '/' +
  ((''+day).length<2 ? '0' : '') + day + '/' +
  d.getFullYear();

// grab url query data
emptyUrl = window.location.href.indexOf('?')
checklabID = function () {
	if (emptyUrl == -1) {
		$('#randomVisitor').modal('hide');
		$('#invalidError').modal('show');
	}  else {
		$('#randomVisitor').modal('hide');
		$('#invalidError').modal('hide');
		
		var parts = pageURL.split("?")[1].split("#");
		biosampleSecret = parts[1];
		parts = parts[0].split("&");
        biosampleId = parts[0].split("=")[1];
		permiteeId = parts[1].split("=")[1];
		$('.btn-gotoConsent').append(' <span class="xxs gbid">#' + biosampleId +'</span>');
	}
}

/**
 * Sign consent data.
 * @param wallet Wallet instance (ethers).
 * @param data Arbitrary JSON object.
 */
async function signJSON(wallet, json) {
  const claimData = `0x${stringToHex(JSON.stringify(json))}`;
  const data = ethers.utils.keccak256(claimData);
  const dataArray = ethers.utils.arrayify(data);
  const signature = await wallet.signMessage(dataArray);
  return signature;
}

/**
 * Retrieves consent form data.
 */
function getConsentData() {
  return {
    fullName: $("#donor-name").val(),
    signatureImage: document.getElementById("jq-signature-canvas-1").toDataURL("image/png"),
    signatureDate: $("#signatureDate").val(),
    birthDate: $("#yob").val(),
    agreed: $("#agree").val(),
  }
}

/**
 * Uploads user's consent to the cloud.
 * 
 * @param pubKey User's wallet address.
 * @param data Consent data as JSON.
 */
async function uploadConsent(pubKey, data) {
	await fetch(`https://api-staging.genobank.io/documents/${pubKey}`, {
		method: 'POST',
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		},
		body: JSON.stringify(data, null, 2),
	}).then((res) => {
		return res.json();
	});
}

function leftPad(input, chars, sign, prefix) {
  const hasPrefix = prefix === undefined ? /^0x/i.test(input) || typeof input === 'number' : prefix;
  input = input.toString(16).replace(/^0x/i, '');
  const padding = (chars - input.length + 1 >= 0) ? chars - input.length + 1 : 0;

  return (hasPrefix ? '0x' : '') + new Array(padding).join(sign ? sign : '0') + input;
}

function stringToHex(input) {
  return unescape(encodeURIComponent(input))
  .split('').map(function(v){
    return v.charCodeAt(0).toString(16)
  }).join('');
}

async function claimBiosample() {
	const account = generateAddress;
  const biosampleIdHex = leftPad(parseInt(biosampleId), 12, '0', false);
  const permitteeIdHex = leftPad(parseInt(permiteeId), 12, '0', false);
  const tokenID = `0x${biosampleIdHex}${permitteeIdHex}${account.substr(2)}`;
  const seed = leftPad(new Date().getTime(), 64, '0', false);
  const claimData = `0x${stringToHex('io.genobank.test.create')}${tokenID.substring(2)}${seed}`;
  const data = ethers.utils.keccak256(claimData);
  const dataArray = ethers.utils.arrayify(data);
  const signature = await wallet.signMessage(dataArray);

	const response = await fetch(`https://api-staging.genobank.io/claim/${tokenID.substring(2)}`, {
		method: 'POST',
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		},
		body: JSON.stringify({
      biosampleSecret,
      signature,
      seed,
      signatureKind: 1
    }),
  });
  return response.json()
}

$.fn.shuffle = function () {
	return this.each(function () {
		var items = $(this).children().clone(true);
		return (items.length) ? $(this).html($.shuffle(items)) : this;
	});
}

$.shuffle = function (arr) {
	for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
	return arr;
}

$('.murl a').attr('href', function (i, v) {
	return v + $('#mid').text();
});
var counter = 0;

const rollSound = new Audio("./assets/audio/dice.mp3");

//Count
$count = function () {
	counter++;
}

//GeneratePhrase+ Validate Phrase
$activatePhrase = function () {
	arrayPhrase = generatePhrase.split(" ");
	$('.randomphrase').empty();

	$(arrayPhrase).each(function (i, e) {
		$('.step3 .randomphrase').append('<li> <p class="btn-reorder"><span class="category xs mx-2 ">' + arrayPhrase[i] + '</span></p></li>');
	});
	$('.step3 .randomphrase').shuffle();
	
	$(arrayPhrase).each(function (i, e) {
		$('.step2 .passphrase').append('<li> <p ><span class="category xs mx-2 ">' + arrayPhrase[i] + '</span></p></li>');
	});
}

$rotateLottiePhone = function () {
	let iconSkipForward = document.querySelector('.lottie-phone');

	let animationSkipForward = bodymovin.loadAnimation({
		container: iconSkipForward,
		renderer: 'svg',
		loop: true,
		autoplay: true,
		path: "js/phone.json"
	});
}

//lottie functions
let params = {
	container: document.querySelector('.lottie-bar'),
		renderer: 'svg',
		loop: false,
		autoplay: false,
		path: "js/loadbar.json"
	}
let animationSkipForward2 =  bodymovin.loadAnimation(params);

let params3 = {
	container: document.querySelector('.lottie-bar2'),
	renderer: 'svg',
	loop: false,
	autoplay: false,
	path: "js/loadbar.json"
}
let animationSkipForward4 = bodymovin.loadAnimation(params3);

let params2 = {
	container: document.querySelector('.lottie-success'),
	renderer: 'svg',
	loop: false,
	autoplay: false,
	path: "js/success.json"
}
let animationSkipForward3 = bodymovin.loadAnimation(params2);

//Rotate Phhone to generate phhrase
$readDeviceOrientation = function () {
		
	$(window).on("orientationchange", function () {
		
		if (Math.abs(window.orientation) === 90) {
			// Landscape
			$count();
			rollSound.play();
			$activatePhrase();
	
			animationSkipForward2.playSegments([0,59], true);

		} else {
			// Portrait
			$count();
			rollSound.play();
			$activatePhrase();
		
		}
		$checkCounter();
	});
}
//Check counter
$checkCounter = function () {
	if (counter >= 2) {

		$('.step1').hide();
		$('.step2').fadeIn();
		$(this).off();
		$(".btn-reorder").one("click", $handler1);

	}
}
//toggle passphrase buttons 
$handler1 = function () {
	$(this).closest('li').addClass('remove');
	$('.step3 .empty li:empty:first').append($(this));


	$(this).one("click", $handler2);
}

$handler2 = function () {
	$('.step3 .scramble li.remove').remove();

	$('.scramble').append($("<li>"));
	$(this).appendTo('.step3 .scramble li:last-child');
	$(this).one("click", $handler1);

}
	

clearInput = function () {

	$('input[type=text], textarea').each(function() {

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

	

//jQuery Timeline
$(function () {
	$('#signatureDate').val(signatureDate);
	$('.js-signature').jqSignature();
	$(".consent input").prop('required',true);
	clearInput();
	$('#randomVisitor').modal('show');
	checklabID();
	//Home - privacy scroll
	$('.sliding-link').on("click", function (e){
		e.preventDefault();
		var aid = $(this).attr('href');
		$('html,body').animate({ scrollTop: $(aid).offset().top }, 'slow');
	});

	$('.btn-gotoConsent').on("click", async function () {
    await fetch(`https://api-staging.genobank.io/biosamples/${biosampleId}`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.data) { // already exists
          $('#invalidKit').modal('show');
        } else { // continue
          $('.home').hide();
          $('.consent').fadeIn();
        }
      })
      .catch((error) => {
       $('#invalidKit').modal('show');
        console.error('Error:', error);
      });
	});

	$('.btn-gotostep0').on("click", async function () { // agree with terms
    const data = getConsentData(); // get conset form data
    const signature = await signJSON(wallet, data); // sign form data
    uploadConsent(generateAddress, { // upload consent to the cloud
      signature,
      ...data,
    }).then(() => { // continue
      $('.consent').hide();
      $('.step0').fadeIn();
      document.body.requestFullscreen();
    }).catch((e) => { // unexpected error
      console.error("Error:", e);
    });
	});


	$('.btn-gotostep1').on("click", function () {
		$('.step0').hide();
		$('.step1').fadeIn();

		//rotate 2 times to go next stepr
		$rotateLottiePhone();
		$readDeviceOrientation();

	});

	//Step1 - create phras
	$('.btn-gotostep2').on("click", function () {
		$('.step1').hide();
		$('.step2').fadeIn();

	});
	 //Step2 - put passphrase in order
	$('.btn-gotostep3').on("click", function () {
		$('.step2').hide();
		$('.step3').fadeIn()
	});

	//Step3 - Chcekcing passphrase order and send message to blockchain
	$(".btn-gotostep4").on("click", async function () {
	
		//Validates order of  array
		arr1 = arrayPhrase;
		arr2 = [];

		$(async function () {
			$('.validatephrase li span').each(function () {
				arr2.push($(this).text());
			});

			//var $matchArray = $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
			var $matchArray = arr1.length == arr2.length && arr1.every(function (element, index) {
				return element === arr2[index];
			});
			if ($matchArray) {
			
				console.log(" match ");
				$('.step3').hide();
      	$('.step4').fadeIn();
      
				//Signing a message to blockcahin

        const data = await claimBiosample();
        if (data.data) {
          const txHash1 = data.data[0].transactionHash;
          const txHash2 = data.data[1].transactionHash;
          
          animationSkipForward4.playSegments([0, 118], true);
        
          setTimeout(
            async function () {
              animationSkipForward3.playSegments([0, 29], true);	
              $('#tx').html(
                ` <h3>Success! Kit is Activated</h3>
                  <p>Do not lose your 12 word passphrase. It controls access to your biosample</p>
                  <p class="text-center mt-3 mb-0"> View Transactions:  </p> 
                  <a id="txLink" href="https://rinkeby.etherscan.io/tx/${txHash1}" target="_blank">    
                    <p class="text-center mb-3 tansaction">
                     ${txHash1}
                    </p>
                  </a>
                  <a id="txLink" href="https://rinkeby.etherscan.io/tx/${txHash2}" target="_blank">    
                    <p class="text-center mb-3 tansaction">
                     ${txHash2}
                    </p>
				  </a>
					<div class="row justify-content-center">
                        <div class="col-12 my-2">
                            <a href="../index.html?biosampleId=12345678&timestamp=1603919060&signature=0x10872409387409" id="addBlockchain"
                               target="_blank" class=" btn btn-primary  btn-shadow btn-gotostep4">Continue</a>
                        </div>
                    </div>
                `
              );
            },
            2000);

        } else {
       $('#invalidKit').modal('show');
        }
      

			} else {

				$('#invalidKit').modal('show');
			}
		});
	});

});
