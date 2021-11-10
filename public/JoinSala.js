
async function JoinSala() {
     
  var response=   document.getElementById('Nombre').value;
    console.log(response);
    var skin = localStorage.getItem("skin");
    var nombre =localStorage.getItem("usuario");
    var response2 = await  fetch(`http://localhost:8081/addUser/` + nombre + '/' + skin+'/'+response).then((res) => {
        if (!res.ok)
            throw new Error("Response is NOT ok");
        console.log(res);
        //return res.json();
        return res;
    }
    );
    console.log(response2);
    window.location.replace("http://localhost:3000/partida.html?id="+response);
}

