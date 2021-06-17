document.getElementById("pin_btn").addEventListener("click",findByPin);
document.getElementById("tab_map").addEventListener("click", displayMap)
var result = [];
var districts = []
var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();

    if(dd<10){
      dd = '0'+dd;
    }
    if(mm < 10){
      mm = '0'+mm;
    }

    date = dd+'-'+mm+'-'+yyyy;
function findByPin(){
    document.getElementById("map").style.display = "none";
    const pincode = document.getElementById("pin").value ;
    


    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode="+pincode+"&date="+date, requestOptions)
      .then(response => response.json())
      .then(result =>{
         result = result.sessions;
         document.getElementById("myTablePin").style.display = "block"
         document.getElementById("myTablePin").innerHTML = `<thead class="bg-info">
         <tr><th>
           Center-ID
         </th>
         <th>
          Name
         </th>
         <th>
          Address
         </th>
         <th>
           From-To
         </th>
         <th>
         Min. Age Limit
         </th>
         <th>
           Slots
         </th>
         <th>
           Vaccine
         </th>
         <th>
         Fee(in Rs.)
       </th>
       </tr></thead>`;
        for(var i=0;i<result.length;i++){

        
          $('#myTablePin').append("<tr>"+
          "<td class='table-info'>"+result[i].center_id+"</td>" +
          "<td class='table-info'>"+result[i].name+"</td>" +
          "<td class='table-info'>"+result[i].address+"</td>" +
          "<td class='table-info'>"+result[i].from+"-"+result[i].to+"</td>" +
          "<td class='table-info'>"+result[i].min_age_limit+"</td>" +
          "<td class='table-info'>"+result[i].slots+"</td>" +
          "<td class='table-info'>"+result[i].vaccine+"</td>" +
          "<td class='table-info'>"+result[i].fee+"</td>" +
          "</tr>"
          );
        }
      } )
      .catch(error => console.log('error', error));
     

            
}

function fetch_states(){
  fetch("states.json")
  .then(response => response.json())
  .then(result =>{
    for(i=0;i<result.states.length;i++){
      $('#states').append(
        "<option>"+result.states[i].state_name+"</option>"
      )
     
    }
  })
  .catch(error => console.log(error))
}

function fetch_district(){
  document.getElementById("map").style.display = "none";
  var state = document.getElementById("states").value ;
  
  fetch("states.json")
  .then(response => response.json())
  .then(result =>{
    for(i=0;i<result.states.length;i++){
    if(result.states[i].state_name == state){
      var state_id = result.states[i].state_id;
      break;
    }
    }
 

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("https://cdn-api.co-vin.in/api/v2/admin/location/districts/"+state_id, requestOptions)
      .then(response => response.json())
      .then(result => 
        {
          districts = result.districts;
          document.getElementById("district").innerHTML = `
          <select id="district"  class="form-control">
                          <option>Select..</option>
                        </select>  
          `;
          for(i=0;i<result.districts.length;i++){
            $('#district').append(
              "<option>"+result.districts[i].district_name+"</option>"
            )
          }
        })
      .catch(error => console.log('error', error));
  })
  .catch(error => console.log(error))
}

function findByDistrict(){
  var district = document.getElementById("district").value ;
  for(i=0;i<districts.length;i++){
    if(districts[i].district_name == district){
      var district_id = districts[i].district_id
    }
  }
  console.log(district_id)

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id="+district_id+"&date="+date, requestOptions)
    .then(response => response.json())
    .then(result => {
      document.getElementById("myTableDistrict").style.display = "block"
      document.getElementById("myTableDistrict").innerHTML = `<thead class="bg-info">
      <tr><th>
        Center-ID
      </th>
      <th>
       Name
      </th>
      <th>
       Address
      </th>
      <th>
        From-To
      </th>
      <th>
      Min. Age Limit
      </th>
      <th>
        Slots
      </th>
      <th>
        Vaccine
      </th>
      <th>
      Fee(in Rs.)
    </th>
    </tr></thead>`;
     for(var i=0;i<result.sessions.length;i++){

     
       $('#myTableDistrict').append("<tr class='table-info'>"+
       "<td>"+result.sessions[i].center_id+"</td>" +
       "<td>"+result.sessions[i].name+"</td>" +
       "<td>"+result.sessions[i].address+"</td>" +
       "<td>"+result.sessions[i].from+"-"+result.sessions[i].to+"</td>" +
       "<td>"+result.sessions[i].min_age_limit+"</td>" +
       "<td>"+result.sessions[i].slots+"</td>" +
       "<td>"+result.sessions[i].vaccine+"</td>" +
       "<td>"+result.sessions[i].fee+"</td>" +
       "</tr>"
       );
     }
    })
    .catch(error => console.log('error', error));
}

function displayMap(){
  console.log("bhu");

  var lat,long;
  getLocation()
  function getLocation() {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  x.innerHTML = "Geolocation is not supported by this browser.";
}
}

function showPosition(position) {
  document.getElementById("map").style.display = "block";
lat = position.coords.latitude 
long = position.coords.longitude;

var requestOptions = {
method: 'GET',
redirect: 'follow'
};

fetch("https://cdn-api.co-vin.in/api/v2/appointment/centers/public/findByLatLong?lat="+lat+"&long="+long, requestOptions)
.then(response => response.json())
.then(result =>{
  console.log(result)

  var map = new MapmyIndia.Map("map", {
 center: [result.centers[0].lat,result.centers[0].long],
 zoomControl: true,
 hybrid: true,
 search: true,
 location: true
});


for(i=0;i<result.centers.length;i++){
new L.marker([result.centers[i].lat,result.centers[i].long]).bindPopup(result.centers[i].name+","+result.centers[i].location).addTo(map);
}
    


 
} )
.catch(error => console.log(""));


}
}



