async function getRooms() 
{
  let response = await      fetch(`http://localhost:8081/rooms`);
  console.log(response);
  let datas = await response.json()
  console.log(datas);
  $.getJSON( datas , function(data) {
       $.each(data.person, function(i, f) {
          var tblRow = "<tr>" + "<td>" + f.id + "</td>" +
           "<td>" + f.name + "</td>" + "<td>" + f.users + "</td>" + "<td>" + f.priv + "</td>" + "</tr>"
           $(tblRow).appendTo("#userdata tbody");
     });

   });
   
  return datas;
}

