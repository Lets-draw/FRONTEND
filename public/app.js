/*var app = (function () {
    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    var id = null;
    var id2 = document.querySelector('#ID');
    var stompClient = null;
    
    var pointMouse = function(){
        if (window.PointerEvent){
            canvas.addEventListener("pointerdown", event => {
                const pt = getMousePosition(event);
                addPointToCanvas(pt);
                //publicar el evento
                stompClient.send("/topic/newpoint", {}, JSON.stringify(pt));
            });
        }
        if( id2 ) input.addEventListener('change', setId);
        const eventCanvas = (window.PointerEvent)?'pointerdown':'mousedown';
        canvas.addEventListener(eventCanvas, eventClick);
    }
    
    var setId = function(event){
        id = event.target.value;
    }
    var eventClick = function (event){
        const pt = getMousePosition(event);
        addPointToCanvas(pt);
        if(id) stompClient.send(`/topic/newpoint.${id}`, {}, JSON.stringify(pt));
    }
    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };
    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/topic/newpoint.${id}`, function (eventbody) {
                var theObject = JSON.parse(eventbody.body);
                alert(theObject);
                addPointToCanvas(theObject);
            });
        });
    };
    
    
    return {
        init: function () {
            var can = document.getElementById("canvas");
            pointMouse();
            //websocket connection
            connectAndSubscribe();
        },
        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);
            //publicar el evento
             stompClient.send(`/topic/newpoint.${id}`, {}, JSON.stringify(pt));
        },
        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        },
        
        publishDrawing( currentId ){
            id = currentId;
            connectAndSubscribe();
        }
    };
})();*/
var numMessages = 0;
var numUsers=0;
var seconds = 60;
var time = true;
var timer = true;
var ctx = true;
var canvasImage = true;
var x = 0, y = 0, dibujando = false, color = 'black', grosor = 1;
async function myFunction() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const page_type = urlParams.get('id');
    document.getElementById("sala").innerText="ID sala : "+page_type;
    
    var response=    await  fetch(`https://lets-draw-back.herokuapp.com/getRoomInfo/`+page_type).then((res)=>{
      if (!res.ok) throw new Error("Response is NOT ok");
      return res.json();
  }
          
  );
  var str = response;
  numUsers=str.user.length;
   for(var i = 0;i<str.user.length;i++)
   {
       var nombre = str.user[i].nikname;
       var skin = str.user[i].skin;
       var points = str.user[i].points;
       var tblRow = "<tr><td><img class='icono' src='"+skin+"'/></td><td>"+nombre+"</td><td>"+points+"</td></tr>"
        /*var table = document.getElementById('userdata');
        var rowCount = table.rows.length;
        for (var i = 1; i < rowCount; i++) {
            table.deleteRow(i);
        } */
        $(tblRow).appendTo("#userdata tbody");
      //document.getElementById(i+1).textContent= string;

   }
   changeWord();
   /*
   var getPalabra=  await  fetch(`https://lets-draw-back.herokuapp.com/getWord/`+page_type+'/').then((rest)=>{
      if (!rest.ok) throw new Error("Response is NOT ok");
      return rest.json();
  }
  );
    //console.log(getPalabra);
    //console.log(getPalabra.name);
    document.getElementById("word").innerText = "Palabra : " + getPalabra.name;*/
    //window.setInterval (myFunction(), 1000);
    var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    var rect = canvas.getBoundingClientRect();
    
    
    
    canvas.addEventListener('mousedown', function (e) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        dibujando = true;
    });

    canvas.addEventListener('mousemove', function (e) {
        if (dibujando === true) {
            dibujar(x, y, e.clientX - rect.left, e.clientY - rect.top);
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

    });

    canvas.addEventListener('mouseup', function (e) {
        if (dibujando === true) {
            dibujar(x, y, e.clientX - rect.left, e.clientY - rect.top);
            x = 0;
            y = 0;
            dibujando = false;
        }
    });
    
    setInterval('getMessages()',1000);
    setInterval('getUsers()',1000);
    time = setInterval(showRemaining, 1000);
}
function dibujar(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}
function defcolor(c) {
    color = c;
}
function defgrosor(g) {
    grosor = g;
}
async function sendMessage() {
    const queryString = window.location.search;
     const urlParams = new URLSearchParams(queryString);
        const page_type = urlParams.get('id');
        var nombre =localStorage.getItem("usuario");
        var response=    await  fetch(`https://lets-draw-back.herokuapp.com/sendMessage/`+page_type+`/`+nombre+`/`+document.getElementById("message").value+`/`).then((res)=>{
            if (!res.ok) throw new Error("Response is NOT ok");
            return res;
        });
        document.getElementById("message").value="";
        var responseM=    await  fetch(`https://lets-draw-back.herokuapp.com/getMessages/`+page_type+`/`).then((res)=>{
            if (!res.ok) throw new Error("Response is NOT ok");
            return res.json();
        });
        if(numMessages < responseM.messages.length){
            drawMessages(responseM);
        }
}
async function getMessages() {
    const queryString = window.location.search;
     const urlParams = new URLSearchParams(queryString);
        const page_type = urlParams.get('id');
        var responseM=    await  fetch(`https://lets-draw-back.herokuapp.com/getMessages/`+page_type+`/`).then((res)=>{
            if (!res.ok) throw new Error("Response is NOT ok");
            return res.json();
        });
        if(numMessages < responseM.messages.length){
            drawMessages(responseM);
        }
        
}
function drawMessages(response){
    var str = response;
   for(var i = numMessages;i<str.messages.length;i++)
   {
       var nombre = str.messages[i].user;
       var message = str.messages[i].message;
       var node = document.createElement("label");
        var textnode = document.createTextNode(nombre+": " +message);
        node.appendChild(textnode);
        document.getElementById("mensajes").appendChild(node);
        var br = document.createElement("br");
        document.getElementById("mensajes").appendChild(br);
   }
   numMessages=str.messages.length;
}
async function getUsers() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page_type = urlParams.get('id');
    var response = await  fetch(`https://lets-draw-back.herokuapp.com/getRoomInfo/` + page_type).then((res) => {
        if (!res.ok)
            throw new Error("Response is NOT ok");
        return res.json();
    }
    );
    var str = response;
    //if(numUsers<str.user.length){
    var table = document.getElementById('userdata');
    //console.log(numUsers);
    for (var i = 0; i < numUsers; i++) {
        table.deleteRow(1);
    }
    for (var i = 0; i < str.user.length; i++)
    {
        var nombre = str.user[i].nikname;
        var skin = str.user[i].skin;
        var points = str.user[i].points;
        var tblRow = "<tr><td><img class='icono' src='" + skin + "'/></td><td>" + nombre + "</td><td>" + points + "</td></tr>";
        $(tblRow).appendTo("#userdata tbody");
        if (str.user[i].nikname === localStorage.getItem("usuario") && str.user[i].dibujante==="false") {
            canvasImage = setInterval('getCanvas()', 1000);
        }
        if (str.user[i].nikname === localStorage.getItem("usuario") && str.user[i].dibujante==="true") {
            canvasImage = setInterval('getImage()', 1000);
        }

    }
    numUsers = str.user.length;

}

   
async function showRemaining() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page_type = urlParams.get('id');
    var response = await  fetch(`https://lets-draw-back.herokuapp.com/getTimer/` + page_type + '/').then((res) => {
        return res.json();
    }
    );
    if (response.timer === "1") {
        document.getElementById('canvasDiv').removeChild(document.getElementById('canvasImg'));
        clearInterval(canvasImage);
        clearInterval(time);
        var stop = await  fetch(`https://lets-draw-back.herokuapp.com/stopTimer/` + page_type + '/').then((res) => {
            return res;
        }
        );
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
        timer = setInterval('start()', 3000);
    }
    document.getElementById('countdown').innerHTML = "Time: " + response.timer;
    changeWord();
}
async function changeWord() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page_type = urlParams.get('id');
    var getPalabra = await  fetch(`https://lets-draw-back.herokuapp.com/getWord/` + page_type + '/').then((rest) => {
        if (!rest.ok)
            throw new Error("Response is NOT ok");
        return rest.json();
    }
    );
     var response=    await  fetch(`https://lets-draw-back.herokuapp.com/getRoomInfo/`+page_type).then((res)=>{
      if (!res.ok) throw new Error("Response is NOT ok");
      return res.json();
  }
          
  );
    var palabra = "";
    for (var i = 0; i < getPalabra.name.length; i++) {
        palabra+="_ ";
    }
    for (var i = 0; i < response.user.length; i++)
    {
        if (response.user[i].nikname === localStorage.getItem("usuario") && response.user[i].dibujante==="true") {
            palabra = getPalabra.name;
        }
        if (response.user[i].nikname === localStorage.getItem("usuario") && response.user[i].dibujante==="false") {
            var canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    document.getElementById("word").innerText = "Palabra : " + palabra;

}
async function leave() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page_type = urlParams.get('id');
    var nombre =localStorage.getItem("usuario");
    var response = await  fetch(`https://lets-draw-back.herokuapp.com/delUser/`+nombre+'/' + page_type + '/').then((res) => {
        return res;
    }
    );
    window.location.replace("https://lets-draw-front.herokuapp.com/LetsDraw.html");
}
async function start() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page_type = urlParams.get('id');
    var start = await  fetch(`https://lets-draw-back.herokuapp.com/startTimer/` + page_type + '/').then((res) => {
        return res;
    }
    );
    clearInterval(timer);
    var canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    time = setInterval(showRemaining, 1000);
}
function getImage(){
    var canvas = document.getElementById('canvas');
    var dataURL = canvas.toDataURL();
    sendCanvas(dataURL);
}
function convertURIToImageData(URI) {
  return new Promise(function(resolve, reject) {
    if (URI === null) return reject();
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        image = new Image();
    image.addEventListener('load', function() {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(context.getImageData(0, 0, canvas.width, canvas.height));
    }, false);
    image.src = URI;
    document.getElementById('canvasDiv').removeChild(document.getElementById('canvasImg'));
    var img = document.createElement('img');
            img.src = URI;
            img.setAttribute('id','canvasImg');
            document.getElementById('canvasDiv').appendChild(img);
    
  });
}
async function sendCanvas(URI){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page_type = urlParams.get('id');
    var newUri=URI.substring(22);
    var buscar="/" ;
    var str =newUri.replace(new RegExp(buscar,"g") ,"ñ");
    //console.log("SET: "+str);
    var _data = {
        id: parseInt(page_type,10),
        board: newUri
    };
    const url = 'https://lets-draw-back.herokuapp.com/setBoard';
// request options
    const options = {
        method: 'POST',
        body: JSON.stringify(_data),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
            .then(res => res);
    //console.log(JSON.stringify(_data));
}
async function getCanvas(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page_type = urlParams.get('id');
    var start = await  fetch(`https://lets-draw-back.herokuapp.com/getBoard/` + page_type).then((res) => {
        return res.json();
    }
    );
    var url=start.board;
    /*
    var buscar="ñ" 
    var str=url.replace(new RegExp(buscar,"g") ,"/");
    console.log("data:image/png;base64,"+str);*/
    convertURIToImageData("data:image/png;base64,"+ url);
}
function clearCanvas(){
    var canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

      
