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
async function myFunction() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const page_type = urlParams.get('id');
    document.getElementById("sala").innerText="ID sala : "+page_type;
    console.log(page_type);
    
    var response=    await  fetch(`https://lets-draw-back.herokuapp.com/getRoomInfo/`+page_type).then((res)=>{
      if (!res.ok) throw new Error("Response is NOT ok");
      return res.json();
  }
          
  );
  var str = response;
  console.log(response);
  numUsers=str.user.length;
   for(var i = 0;i<str.user.length;i++)
   {
       console.log(str.user[i].nikname);
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
   var getPalabra=  await  fetch(`https://lets-draw-back.herokuapp.com/getWord/`+page_type+'/').then((rest)=>{
      if (!rest.ok) throw new Error("Response is NOT ok");
      return rest.json();
  }
  );
    //console.log(getPalabra);
    //console.log(getPalabra.name);
    document.getElementById("word").innerText = "Palabra : " + getPalabra.name;
    //window.setInterval (myFunction(), 1000);
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var rect = canvas.getBoundingClientRect();
    var x = 0, y = 0, dibujando = false, color = 'black', grosor = 1;
    function defcolor(c) {
        color = c;
    }
    function defgrosor(g) {
        grosor = g;
    }
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
    function dibujar(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = grosor;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }
    setInterval('getMessages()',1000);
    setInterval('getUsers()',1000);
    setInterval(showRemaining, 1000);
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
  //console.log(response);
   for(var i = numMessages;i<str.messages.length;i++)
   {
       //console.log(str.messages[i].user);
       //console.log(str.messages[i].message);
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
async function getUsers(response){
     const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page_type = urlParams.get('id');
   var response=    await  fetch(`https://lets-draw-back.herokuapp.com/getRoomInfo/`+page_type).then((res)=>{
      if (!res.ok) throw new Error("Response is NOT ok");
      return res.json();
  }
          
  );
  var str = response;
  if(numUsers<str.user.length){
        console.log(response);
        for (var i = numUsers; i < str.user.length; i++)
        {
            console.log(str.user[i].nikname);
            var nombre = str.user[i].nikname;
            var skin = str.user[i].skin;
            var points = str.user[i].points;
            var tblRow = "<tr><td><img class='icono' src='" + skin + "'/></td><td>" + nombre + "</td><td>" + points + "</td></tr>"
            /*var table = document.getElementById('userdata');
             var rowCount = table.rows.length;
             for (var i = 1; i < rowCount; i++) {
             table.deleteRow(i);
             } */
            $(tblRow).appendTo("#userdata tbody");
            //document.getElementById(i+1).textContent= string;

        }
        numUsers=str.user.length;
  }
  
}
    
    //var timer;

    async function showRemaining() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const page_type = urlParams.get('id');
        var response =  await  fetch(`https://lets-draw-back.herokuapp.com/getTimer/` + page_type +'/').then((res) => {
        return res.json();
        }

        );
        console.log(response.timer);
        document.getElementById('countdown').innerHTML = "Time: "+response.timer;
        //if (response.timer==="1") {
            changeWord();
        //}
    }
    async function changeWord() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const page_type = urlParams.get('id');
        var getPalabra=  await  fetch(`https://lets-draw-back.herokuapp.com/getWord/`+page_type+'/').then((rest)=>{
      if (!rest.ok) throw new Error("Response is NOT ok");
      return rest.json();
  }
  );
    //console.log(getPalabra);
    //console.log(getPalabra.name);
    document.getElementById("word").innerText = "Palabra : " + getPalabra.name;

    }

    //timer = setInterval(showRemaining, 1000);
/*
var wage = document.getElementById("message");
wage.addEventListener("keydown", function (e) {
    if (e.code === 13) {  //checks whether the pressed key is "Enter"
        getMessages();
    }
});*/

