let orderList = [];  // for localStorage
let urlParams = window.location.search;
let orderNumber = urlParams.replace( "?orderNumber=","" );

getStorageData();
showOrderNumber(orderNumber);

function getStorageData(){
    
    if ( localStorage.getItem("list") !== null ){ 
        orderList = JSON.parse(localStorage.getItem("list"));      
        amountOfCart();
    
    }else{
        localStorage.setItem("list", JSON.stringify(orderList));
        amountOfCart();            
    }  
}

function showOrderNumber(orderNumber){
    
    document.getElementById("bookingNumber").innerHTML = `訂單號碼&nbsp&nbsp:&nbsp&nbsp${orderNumber}`;
  
}

function amountOfCart(){
  
    let cartAmount = document.getElementById("cartAmount");
    let cartAmountMobile = document.getElementById("cartAmountMobile");

    cartAmount.innerHTML = orderList.length;
    cartAmountMobile.innerHTML = orderList.length;
}


//==========================================================================================================//
//============================================     Facebook      ===========================================//
//==========================================================================================================//



window.fbAsyncInit = function() {
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

        document.getElementById("memberIconM").src = `http://graph.facebook.com/${response.id}/picture?type=small`;
        document.getElementById("memberIconM").style = "border-radius: 50%";
        document.getElementById("memberIconW").src = `http://graph.facebook.com/${response.id}/picture?type=small`;
        document.getElementById("memberIconW").style = "border-radius: 50%; height: 38px; width: 38px";        
       
      });
    };
    
  });

};


(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


function checkLoginState(){

  FB.getLoginStatus(function (response) {  
      if(response.status === 'connected'){
          window.location = "profilePage.html";

      }else{
          FB.login(function(response) {
              // console.log(response);          
              if (response.status === "connected") {
                  window.location = "profilePage.html";   
                }                      
          }, {scope: 'public_profile,email'});
      }
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