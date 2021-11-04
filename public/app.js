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
async function myFunction() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const page_type = urlParams.get('id');
    document.getElementById("sala").innerText="ID sala : "+page_type;
    console.log(page_type);
    
    var response=    await  fetch(`http://localhost:8081/getRoomInfo/`+page_type).then((res)=>{
      if (!res.ok) throw new Error("Response is NOT ok");
      return res.json();
  }
  );
  var str = response;
  console.log(response);
    for(var i = 0;i<str.user.length;i++)
   {
       console.log(str.user[i].nikname);
       console.log(document.getElementById(i+1));
      document.getElementById(i+1).textContent= str.user[i].nikname;

   }
}