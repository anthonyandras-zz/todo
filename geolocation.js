function createGeolocationSpan() {
  navigator.geolocation.getCurrentPosition(displayLocation);
}

function displayLocation(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  console.log(latitude, longitude);
}
