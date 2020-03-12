let orderList = [];  // for localStorage
let facebookData = [];

getStorageData();

function getStorageData(){
    
    if ( localStorage.getItem("list") !== null ){ 
        orderList = JSON.parse(localStorage.getItem("list"));
        amountOfCart();
    
    }else{
        localStorage.setItem("list", JSON.stringify(orderList));
        amountOfCart();            
    }   
}


function amountOfCart(){
  
    let cartAmount = document.getElementById("cartAmount");
    let cartAmountMobile = document.getElementById("cartAmountMobile");

    cartAmount.innerHTML = orderList.length;
    cartAmountMobile.innerHTML = orderList.length;

}


function renderProfile(){

  let picture = document.getElementById("picture");
  let name = document.getElementById("name");
  let email = document.getElementById("email");

  if (facebookData.length === 0){

    picture.innerHTML = "<img src='images/unknown.png' style='height:50px; width:50px'>";
    name.innerHTML =  "未登錄會員";     
  
  }else{

    picture.innerHTML = `<img src=http://graph.facebook.com/${facebookData.id}/picture?type=normal>`;
    name.innerHTML =  facebookData.name;     
    email.innerHTML =  facebookData.email;

    document.getElementById("memberIconM").src = `http://graph.facebook.com/${facebookData.id}/picture?type=small`;
    document.getElementById("memberIconM").style = "border-radius: 50%";
    document.getElementById("memberIconW").src = `http://graph.facebook.com/${facebookData.id}/picture?type=small`;
    document.getElementById("memberIconW").style = "border-radius: 50%; height: 38px; width: 38px";
  }
}



//==========================================================================================================//
//============================================     Facebook      ===========================================//
//==========================================================================================================//



(function(d, s, id){  // step 1 set up FB SDK
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


window.fbAsyncInit = function() {  // step 2 init
    FB.init({
      appId      : '488997631721121',
      cookie     : true,
      xfbml      : true,
      version    : 'v5.0'
    });

    FB.getLoginStatus(function (response) {   // check login or not
      if (response.status === "connected") {
        FB.api('/me', {
          'fields': 'id,name,email,picture'
        }, function (response) {
          facebookData = response;         
          renderProfile();
        });
      };
      renderProfile()    
    });
  };



function checkLoginState(){  // step 3 click event

  FB.getLoginStatus(function (response) { 
    if(response.status === 'connected'){
      // console.log(response);
    }else{

      FB.login(function(response) {
        // console.log(response);

        if (response.status === "connected") {
            FB.api('/me', {
              'fields': 'id,name,email,picture'
            }, function (response) {
            facebookData = response;
            renderProfile();           
            });
        } 
      }, {scope: 'public_profile,email'});
      // renderProfile();
    }    
    // renderProfile()

  });
}













//==========================================================================================================//
//============================================     Search      ===========================================//
//==========================================================================================================//

window.onload=enterSumit;

function enterSumit(){
    let keywordElementW=document.getElementById("searchValueW");
    let keywordElementM=document.getElementById("searchValueM")

    keywordElementW.addEventListener("keyup", function(event){
        
        if (event.keyCode === 13){
            event.preventDefault();
            document.getElementById("webSeacrhBtn").click();      
        }
    })
    
    keywordElementM.addEventListener("keyup", function(event){
        
        if (event.keyCode === 13){
            event.preventDefault();
            document.getElementById("mobileSeacrhBtn").click();          
        }
    })
}


function mobileSearch(){ 
    let mobileSearch = document.getElementById("mobileSearchIcon");
    let mobileSearchBar = document.getElementById("mobileSearchBar");

    mobileSearch.style.display="none";
    mobileSearchBar.style.display="block";
}


function searchProductMobile(){ 
      
    let keywordElement=document.getElementById("searchValueM");
    let key=encodeURIComponent(keywordElement.value);

    if (key.trim().length === 0){
        alert("親，請輸入有效字元")
    }else{
        window.location = "index.html?key="+key;    
    }   
}


function searchProductWeb(){ 
    
    let keywordElement=document.getElementById("searchValueW"); 
    let key=keywordElement.value;
   
    if (key.trim().length === 0){
        alert("親，請輸入有效字元")
    }else{
        window.location = "index.html?key="+key;   
    }

}