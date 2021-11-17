
async function CreateSala() {
     
  var response=    await  fetch(`https://lets-draw-back.herokuapp.com/addRoom/`+document.getElementById('Nombre').value+'/'+document.getElementById('Lenguaje').value+'/'+document.getElementById('priv').checked+'/'+document.getElementById('numJ').value+'/').then((res)=>{
      if (!res.ok) throw new Error("Response is NOT ok");
      return res.json();
  }
  );
    console.log(response);
    var skin = localStorage.getItem("skin");
    var nombre =localStorage.getItem("usuario");
    var response2 = await  fetch(`https://lets-draw-back.herokuapp.com/addUser/` + nombre + '/' + skin+'/'+response).then((res) => {
        if (!res.ok)
            throw new Error("Response is NOT ok");
        console.log(res);
        //return res.json();
        return res;
    }
    );
    console.log(response2);
    window.location.replace("https://lets-draw-front.herokuapp.com/Partida.html?id="+response);
}
