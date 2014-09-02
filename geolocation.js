function createGeolocationSpan() {
  navigator.geolocation.getCurrentPosition(displayLocation);
}

function displayLocation(position) {
  var latitude = position.coords.latitude,
      longitude = position.coords.longitude;

  console.log(latitude, longitude);
  return 0;
}

