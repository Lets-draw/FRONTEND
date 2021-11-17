var nombreF="";
function setName(x) {
  nombreF=x;
  document.getElementById('boton').disabled =false;
  document.getElementById('boton').hidden=false; 
}
async function CreateUser() {
  console.log(nombreF);
  console.log(document.getElementById('Nombre').value);
  localStorage.setItem("skin",nombreF);
  localStorage.setItem("usuario",document.getElementById('Nombre').value);
  /*var response=    await  fetch(`http://localhost:8081/addUser/`+document.getElementById('Numbre').value+'/'+nombreF).then((res)=>{
      if (!res.ok) throw new Error("Response is NOT ok");
      return res.json();
  }
  );
    console.log(response);
    window.location.replace("http://localhost:3000/LetsDraw.html");*/
    window.location.replace("https://lets-draw-front.herokuapp.com/LetsDraw.html");
}