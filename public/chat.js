
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


    var maxWidth = document.documentElement.offsetWidth;
    var maxHeight = document.documentElement.offsetHeight;
var maxWH = Math.max(maxWidth, maxHeight)*1.414 + 20 ;


    var Tank = function(isMyTank,itop,ileft, iClass, iBClass){
        var tank = $('<div class="tank '+iClass+'"><div class="tank-center"></div><div class="cannon"></div></div>').appendTo(document.body);
        tank = tank.get(0);
        var $tank = $(tank);
        var tankWidth = $tank.outerWidth(true);
        var tankHeight = $tank.outerHeight(true);
        var $tankCenter = $('.tank-center',tank);
        var $cannon = $('.cannon',$tank);
        var tankBorder = 10;
        

        var g_top = tank.offsetTop, g_left = tank.offsetLeft, g_deg = 0;
        var distance = 50;
        var moveTime = 500;

        var tankObj = {

        'vpos': function(newPos){
            return  Math.min(maxHeight - tankHeight, Math.max(tankBorder, newPos)) ;
        },
        'hpos': function(newPos){
            return  Math.min(maxWidth - tankWidth, Math.max(tankBorder, newPos)) ;
        },
        'up': function(idistance){
            var jdistance = distance ;
            if((typeof(idistance) == 'number' )&& !isNaN(idistance)){
                jdistance = idistance;
            }
            g_top = this.vpos(parseInt(tank.offsetTop) - jdistance) ;
            $tank.stop(true).animate({top:g_top},moveTime);
//            tankObj.style.top = g_top + 'px';
        },
        'down': function(idistance){
            var jdistance = distance ;
            if((typeof(idistance) == 'number' )&& !isNaN(idistance)){
                jdistance = idistance;
            }
            g_top = this.vpos(parseInt(tank.offsetTop) + jdistance) ;
            $tank.stop(true).animate({top:g_top},moveTime);
        },
        'left': function(idistance){
            var jdistance = distance ;
            if((typeof(idistance) == 'number' )&& !isNaN(idistance)){
                jdistance = idistance;
            }
            g_left = this.hpos(parseInt(tank.offsetLeft) - jdistance) ;
            $tank.stop(true).animate({left:g_left},moveTime);
        },
        'right': function(idistance){
            var jdistance = distance ;
            if((typeof(idistance) == 'number' )&& !isNaN(idistance)){
                jdistance = idistance;
            }
            g_left = this.hpos(parseInt(tank.offsetLeft) + jdistance) ;
            $tank.stop(true).animate({left:g_left},moveTime);
        },
        'shoot': function(){
            //shoot
            var bullet = $('<div class="bullet '+iBClass+'"></div>').appendTo(document.body);
            var transforms = [];
            transforms.push(' rotate('+ g_deg +'deg)');
            var g_top = tank.offsetTop, g_left = tank.offsetLeft;
            bullet.css({top: g_top - 30, left: g_left + 30, transform: transforms.join(' ')});

//            transforms.push('scale(4,4) ');
//            transforms.push('rotate(180deg) ');

            setTimeout(function(){
                transforms.push(' translateY(-'+ maxWH +'px)');
                bullet.css({transform: transforms.join(' ')});
                bullet.addClass('bullet-transition');
            },1);

            setTimeout(function(){
                bullet.remove();
            },2200);
        },
        'rotateCannon': function(deg){
            
            //console.info( tan,deg);
            $cannon.css({transform: 'rotate('+deg+'deg)'});
            g_deg = deg;
        },
        'end':''
        
        }

        $tank.css({top:tankObj.hpos(itop),left:tankObj.vpos(ileft)});

        if(isMyTank){
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
                    var itop = g_top + 15, ileft = g_left + 25;
                    var deltaX = event.pageX - ileft;
                    var deltaY = itop - event.pageY;
                    var tan = deltaX/deltaY; 
                    var deg =  parseInt(Math.atan(tan)/Math.PI*180);
                    if(deltaY < 0){
                        deg += 180;
                    }
                    tankObj.rotateCannon(deg);
                })
            }
            keyContrl();
        }else{
            $cannon.addClass('cannon-transition');
        
        }
        return tankObj;
    }

    var tank = new Tank(true);

    var left = ((Math.random()*maxWidth).toFixed(0));
    var top = ((Math.random()*maxHeight).toFixed(0));
    var tankc1 = new Tank(false, top, left, 'tankc tankc1', 'bullet-special');
    setInterval(function(){
    
        var rand = parseInt((Math.random()*4).toFixed(0));
        var deg = ((Math.random()).toFixed(2))*360;
        if(deg > 180){
            deg = 180 - deg;
        }

        switch(rand){
            case 1:
                tankc1.left();
                break;
            case 2:
                tankc1.right();
                break;
            case 3:
                tankc1.up();
                break;
            case 4:
                tankc1.down();
                break;
        }
        tankc1.rotateCannon(deg);
        setTimeout(tankc1.shoot,1600);
    },2000);
    

  

}

