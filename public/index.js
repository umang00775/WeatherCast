let lat = 0,long=0, successCode=0;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, showError);
}
function successFunction(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    console.log('Your latitude is :'+lat+' and longitude is '+long);
    document.getElementById("lat").value = lat;
    document.getElementById("long").value = long;
    document.getElementById("code").value = 100;
}

function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        document.getElementById('error').innerHTML = "User denied the request for Geolocation."
        document.getElementById("code").value = 200;
        break;
      case error.POSITION_UNAVAILABLE:
        document.getElementById('error').innerHTML = "Location information is unavailable."
        document.getElementById("code").value = 200;
        break;
      case error.TIMEOUT:
        document.getElementById('error').innerHTML = "The request to get user location timed out."
        document.getElementById("code").value = 200;
        break;
      case error.UNKNOWN_ERROR:
        document.getElementById('error').innerHTML = "An unknown error occurred."
        document.getElementById("code").value = 200;
        break;
    }
  }