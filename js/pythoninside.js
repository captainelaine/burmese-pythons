var topskinlayer=document.getElementsByClassName("fenjie");
var writing=document.getElementById("fenjie3");


topskinlayer[3].addEventListener("click",function(e){
  if(e.target.style.left="44%"){
    topskinlayer[1].style.left = "10%";
    topskinlayer[3].style.display = "none";
    document.getElementById("fenjie3").style.display="block";
  }

  // if(e.target.style.style = "10%") {
  //   topskinlayer[1].style.left="30.8";
  //   // document.getElementById("fenjie3").style.display="none";
  // }

})

topskinlayer[1].addEventListener("click",function(e){
  if(e.target.style.left="54%") {
    topskinlayer[1].style.left="30.8%";
    topskinlayer[3].style.display = "block";
    document.getElementById("fenjie3").style.display="none";
  }
})
