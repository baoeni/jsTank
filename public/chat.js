
window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });
        }
    };


    var Tank = function(){
        var tank = document.querySelector('.tank');
        var $tank = $(tank);
        var $tankCenter = $('.tank-center',tank);
        var $cannon = $('.cannon',$tank);

        var maxWidth = document.documentElement.offsetWidth;
        var maxHeight = document.documentElement.offsetHeight;
        var maxWH = Math.max(maxWidth, maxHeight) + 20 ;
        var g_top = tank.offsetTop, g_left = tank.offsetLeft, g_deg = 0;

        var tankObj = {
     
        'up': function(){
            g_top = Math.max(0, (parseInt(tank.offsetTop) - 20)) ;
            tank.style.top = g_top + 'px';
        },
        'down': function(){
            g_top = Math.max(0, (parseInt(tank.offsetTop) + 20)) ;
            tank.style.top = g_top + 'px';
        },
        'left': function(){
            g_left = Math.max(0,(parseInt(tank.offsetLeft) - 20));
            tank.style.left =  g_left + 'px';
        },
        'right': function(){
            g_left = Math.max(0,(parseInt(tank.offsetLeft) + 20));
            tank.style.left =  g_left + 'px';
        },
        'shoot': function(){
            //shoot
            var bullet = $('<div class="bullet"></div>').appendTo(document.body);
            var itop = g_top - 30;
            var transforms = [];
            transforms.push(' rotate('+ g_deg +'deg)');
            bullet.css({top: itop, left: g_left + 30, transform: transforms.join(' ')});

//            transforms.push('scale(4,4) ');
//            transforms.push('rotate(180deg) ');

            setTimeout(function(){
                transforms.push(' translateY(-'+ maxWH +'px)');
                bullet.css({transform: transforms.join(' ')});
                bullet.addClass('bullet-transition');
            },1);

            setTimeout(function(){
//                bullet.remove();
            },2200)
        },
        'rotateCannon': function(pageX, pageY){
            
            var ioffset = $tankCenter.offset() ;
            var itop = g_top + 15, ileft = g_left + 25;
            var deltaX = pageX - ileft;
            var deltaY = itop - pageY;
            var tan = deltaX/deltaY; 
            var deg =  parseInt(Math.atan(tan)/Math.PI*180);
            if(deltaY < 0){
                deg += 180;
            }
            //console.info( tan,deg);
            $cannon.css({transform: 'rotate('+deg+'deg)'});
            g_deg = deg;
        },
        'end':''
        
        }


      function keyContrl(){
            document.addEventListener('keydown',function(e){
                var evt = e || window.event;
                var tgt = evt.target || evt.srcElement;
                if(e.keyCode == 38){
                    //up 
                    tankObj.up();
                }else if(e.keyCode == 40){
                  //down
                    tankObj.down();
                }else if(e.keyCode == 37){
                  //left
                    tankObj.left();
                }else if(e.keyCode == 39){
                  //right
                    tankObj.right();
                }else if(e.keyCode == 32){
                  //right
                    tankObj.shoot();
                }
            },false);
            $(document.body).click(function(){
                tankObj.shoot();
            })
            $(document.body).mousemove(function(event){
                //console.info(event);
                tankObj.rotateCannon(event.pageX, event.pageY);
            })
        }
        keyContrl();
        return tankObj;
    }

    var tank = new Tank();

  

}

