
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
        var iClass = iClass || '', iBClass = iBClass || '';
        var tank = $('<div class="tank '+iClass+'"><div class="tank-life"></div><div class="tank-center"></div><div class="cannon"></div></div>').appendTo(document.body);
        tank = tank.get(0);
        var $tank = $(tank);
        var tankWidth = $tank.outerWidth(false);
        var tankHeight = $tank.outerHeight(false);
        var $tankCenter = $('.tank-center',tank);
        tankCenter = $tankCenter.get(0);
        var $cannon = $('.cannon',$tank);
        var cannonOffsetTop = $cannon.get(0).offsetTop;
        var cannonHeight = $cannon.outerHeight();
        var $life = $('.tank-life',$tank);
        var tankBorder = 10;
        var g_top = tank.offsetTop, g_left = tank.offsetLeft, g_deg = 0;
        var distance = 50;
        var moveTime = 500;
        var life = 4;

        var tankObj = {
        'tank':tank,
        'reducelife': function(){
            if(--life == 0){
                $tank.remove();
            }else{
                $life.css({width: (life*25)+'%'}) ;
            }
        },

        'vpos': function(newPos){
            return  Math.min(maxHeight - tankHeight, Math.max(tankBorder, newPos)) ;
        },
        'hpos': function(newPos){
            return  Math.min(maxWidth - tankWidth, Math.max(tankBorder, newPos)) ;
        },
        'up': function(idistance){
            var idistance = idistance || distance ;
            g_top = this.vpos(parseInt(tank.offsetTop) - idistance) ;
            $tank.stop(true).animate({top:g_top},moveTime);
//            tankObj.style.top = g_top + 'px';
        },
        'down': function(idistance){
            var idistance = idistance || distance ;
            g_top = this.vpos(parseInt(tank.offsetTop) + idistance) ;
            $tank.stop(true).animate({top:g_top},moveTime);
        },
        'left': function(idistance){
            var idistance = idistance || distance ;
            g_left = this.hpos(parseInt(tank.offsetLeft) - idistance) ;
            $tank.stop(true).animate({left:g_left},moveTime);
        },
        'right': function(idistance){
            var idistance = idistance || distance ;
            g_left = this.hpos(parseInt(tank.offsetLeft) + idistance) ;
            $tank.stop(true).animate({left:g_left},moveTime);
        },
        'shoot': function(){
            //shoot
            var $bullet = $('<div class="bullet '+iBClass+'"></div>').appendTo(document.body);
            var bullet = $bullet.get(0);
            var transforms = [];
            transforms.push(' rotate('+ g_deg +'deg)');
            var g_top = tank.offsetTop + cannonOffsetTop , g_left = tank.offsetLeft + tankWidth/2 - 5;
            $bullet.css({top: g_top  , left: g_left , transform: transforms.join(' ')});
            var shootTime = 10000;

//            transforms.push('scale(4,4) ');
//            transforms.push('rotate(180deg) ');

            /*
             // animate
            console.info(g_deg);
            $bullet.animate({top:bullet.offsetTop - maxWH*Math.cos(g_deg/180*Math.PI),left:bullet.offsetLeft + maxWH*Math.sin(g_deg/180*Math.PI)},10000);
            */
            
            
            setTimeout(function(){
                //$bullet.css({transition: 'transform '+ shootTime/1000 +'s'})
                transforms.push(' translateY(-'+ maxWH +'px)');
                $bullet.css({transform: transforms.join(' ')});
                $bullet.addClass('bullet-transition');
            },1);

            var start = new Date();
            var radians = g_deg/180*Math.PI;
            var topDelta = Math.cos(radians);
            var leftDelta = Math.sin(radians);
            var bulletTop = bullet.offsetTop -  cannonHeight * ( topDelta - 1);
            var bulletLeft = bullet.offsetLeft + cannonHeight * leftDelta;
            
            //$('<div class="dots" style="top:'+bulletTop+'px;left:'+bulletLeft+'px"></div>').appendTo(document.body);
            //console.info(cannonHeight,topDelta,leftDelta,bulletTop,bulletLeft);
            
            setTimeout(function(){
            var interID = setInterval(function(){
                var then = new Date();
                var h = maxWH*(then - start)/shootTime;
                var top = bulletTop - h * topDelta,left = bulletLeft + h * leftDelta;
                if((top<0 || top > maxHeight) || (left<0 || left> maxWidth )){
                    clearInterval(interID);
                    clearTimeout(timeoutID);
                    $bullet.remove();
                }
                var elm = document.elementFromPoint(left,top); 
                //$('<div class="dots" style="top:'+top+'px;left:'+left+'px"></div>').appendTo(document.body);
                if(elm && (elm != document.body) ){
                    
                    $bullet.remove();
                    clearInterval(interID);
                    clearTimeout(timeoutID);
                    var tO = $(elm).closest('.tank').data('tankObj');
                    if(tO){
                        tO.reducelife();
                    }

                    console.info(top,left, elm,tO);
                }
            },shootTime/30)
            },shootTime/30);

            
            
            var timeoutID = setTimeout(function(){
                clearInterval(interID);
                $bullet.remove();
            },shootTime);
            
        },
        'rotateCannon': function(deg){
            
            //console.info( tan,deg);
            $cannon.css({transform: 'rotate('+deg+'deg)'});
            g_deg = deg;
        },
        'end':''
        
        }

        $tank.css({top:tankObj.hpos(itop),left:tankObj.vpos(ileft)});
        $tank.data('tankObj',tankObj);

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
                    var itop = g_top + tankHeight/2, ileft = g_left + tankWidth/2;
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

