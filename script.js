"strict";

const input_ip = document.querySelector(".ip_input");
const search_btn = document.querySelector(".search_btn");
const ip_output = document.querySelector(".ip");
const loc_output = document.querySelector(".loc");
const timezone = document.querySelector(".timezone");
const isp_output = document.querySelector(".isp");
var mymap = L.map("mapid").setView([51.505, -0.09], 13);
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoia3Jpc3RpcW4xMjQiLCJhIjoiY2t0dmc5bno3MGtubzJubXAzZmhrY3NzbiJ9.9LjY7JM_75AuAdER0Gp_DA",
  }
).addTo(mymap);
async function searchMapIp(ip) {
  let response = await fetch(
    `https://geo.ipify.org/api/v1?apiKey=at_PZ1qhbxULJc5rGL3YXYruVzt1SW2k&ipAddress=${ip}`
  );
  let data = await response.json();
  return data;
}

async function getUserIp() {
  let response = await fetch("https://api.ipify.org?format=json");
  let data = await response.json();
  return data;
}
getUserIp().then((data) => {
  let marker, latlng;
  let ip = data.ip;
  let iconOptions = {
    iconUrl: "/images/icon-location.svg",
    iconSize: [40, 50],
  };
  let customIcon = L.icon(iconOptions);
  var markerOptions = {
    title: "Location",
    clickable: false,
    draggable: false,
    icon: customIcon,
  };

  searchMapIp(ip).then((data) => {
    latlng = L.latLng(data.location.lat, data.location.lng);
    marker = L.marker(latlng, markerOptions).addTo(mymap);
    console.log(data);
    mymap.setView(latlng, 9);
    uiOutput(data);
  });

  search_btn.addEventListener("click", () => {
    ip = input_ip.value;
    searchMapIp(ip).then((data) => {
      latlng = L.latLng(data.location.lat, data.location.lng);
      marker.setLatLng(latlng);
      console.log(data);
      mymap.setView(latlng, 9);
      uiOutput(data);
    });
    input_ip.value = "";
  });
});
function uiOutput(data) {
  ip_output.textContent = data.ip;
  loc_output.textContent = `${data.location.city}, ${data.location.country}, ${data.location.postalCode}`;
  timezone.textContent = `UTC-${data.location.timezone}`;
  isp_output.textContent = data.isp;
}
