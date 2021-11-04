async function getRooms() 
{
    //Roomsjson() ;
    var response=    await  fetch(`http://localhost:8081/rooms`).then((res)=>{
      if (!res.ok) throw new Error("Response is NOT ok");
      return res.json();
  }
  );
    console.log(response);
  //var response = localStorage.getItem("room");
  var str = response;
  console.log(str);
  //let datas = await response.json()
  //console.log(res);
  for(var i = 0;i<str.person.length;i++)
  {
      //console.log(str.person[i].id);
      var tblRow = "<tr onclick='myFunction("+str.person[i].id +")'>" + "<td>" + str.person[i].id + "</td>" +
           "<td>" + str.person[i].name + "</td>" + "<td>" + str.person[i].users+ "</td>" + "<td>" + str.person[i].lenguaje + "</td>" + "<td>" + str.person[i].priv + "</td>" + "</tr>"
           $(tblRow).appendTo("#userdata tbody");
  }
  /*
  $.getJSON( json , function(data) {
       $.each(data.person, function(i, f) {
          
     });

   });*/
   
  
}
async function Roomsjson() 
{
  var response=    await  fetch(`http://localhost:8081/rooms`).then((res)=>{
      if (!res.ok) throw new Error("Response is NOT ok");
      return res.json();
  }
  );
  localStorage.setItem("room",response);
}

async function myFunction(x) {
    var skin = localStorage.getItem("skin");
    var nombre =localStorage.getItem("usuario");
    var response2 = await  fetch(`http://localhost:8081/addUser/` + nombre + '/' + skin+'/'+x).then((res) => {
        if (!res.ok)
            throw new Error("Response is NOT ok");
        console.log(res);
        //return res.json();
        return res;
    }
    );
  window.location.replace("http://localhost:3000/partida.html?id="+x);
}

