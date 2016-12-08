var asiaplace= document.getElementsByClassName("st1");
var grayspace= document.getElementsByClassName("st0");

function changegray () {
  for(var i=0; i<grayspace.length;i++){
    grayspace[i].setAttribute("fill","#B3B3B3");
    grayspace[i].setAttribute("stroke","#FFFFFF");
    grayspace[i].setAttribute("stroke-width","0.25");
    grayspace[i].setAttribute("stroke-miterlimit","3.9937");

  }
}
 changegray();


function changegreen () {
   for(var i=0; i<asiaplace.length;i++){
     asiaplace[i].setAttribute("fill","#C5E68E");
     asiaplace[i].setAttribute("stroke","#FFFFFF");
     asiaplace[i].setAttribute("stroke-width","0.25");
     asiaplace[i].setAttribute("stroke-miterlimit","3.9937");
   }
 }
  changegreen();

function mouseoverchange () {
  for (var i=0; i<asiaplace.length; i++){
    asiaplace[i].addEventListener("mouseover", function(event){
      event.target.setAttribute("fill","rgb(74,179,110)");
      $(".tooltip").css("display","block");
      $(".tooltip").css("top",event.clientY);
      $(".tooltip").css("left",event.clientX)
      $(".tooltip").text(this.id);
    });
    asiaplace[i].addEventListener("mouseout", function(event){
      event.target.setAttribute("fill","#C5E68E");
      $(".tooltip").css("display","none");
    });
  }
}

mouseoverchange();
