let hostSrc = "https://api.appworks-school.tw/api/1.0/" ;
let initPage = 0 ;
let initCategories = "";
let loadingStatus=false;
let initIndex=0; // for slideEffect()
let urlParams = window.location.search;
let keyParams;
let redirectionCatalog;


// init function //

redirection();
campaigns();
window.onload=enterSumit; // should be onloaded first because of 'addEventListener' of null ( first: JS >> last: render)


//==========================================================================================================//
//========================================    Product API     ===============================================//
//==========================================================================================================//



    // step.1  Connect API //


        //* 【 async/await + fetch 】 只有在 async 內才會處理非同步

function mainPageAPI( categories, index=0){ 
     
    let src= hostSrc+"products/"+categories+"?paging="+index;
   
    ~async function(){  

        await fetch(src, {method: "get"}).then(function(response){
                return response.json();

            }).then(function(resJson){  

                renderMainPage(resJson);
                
           
                
                if( resJson.next_paging != undefined  ){
                    initPage = resJson.next_paging;
                    loadingStatus=true;
                    initCategories= `${categories}`;
                    

                }else{
                    // console.log(" 只有一頁 ");
                    initPage = 0;
                    initCategories= "";  
                }


            }).catch(function(e){
                console.log( "mainPageAPI error" )           
        })                    
    }();   
} ;




// step2. render homePage //



function renderMainPage(resJson){
    let data=resJson.data;
    let products = document.getElementById("products");
    let productSrc = "productPage.html?id=";

    
    

    for(i=0;i<data.length;i++){

        // I. createElement

        let product = document.createElement("div");
        product.className="product";
        let pic = document.createElement("a");
        pic.className="pic";
        pic.href = productSrc + data[i].id;
        let text = document.createElement("div");
        text.className="text";
        let colorBox = document.createElement("div");
        colorBox.className="colorBox";
        let productName = document.createElement("div");
        productName.className="productName";
        let price = document.createElement("div");
        price.className="price";
       


        for(j=0;j<data[i].colors.length;j++){

            let eachColor = document.createElement("div");
            eachColor.className="eachColor";
            
            eachColor.style.backgroundColor="#"+data[i].colors[j].code;
            colorBox.appendChild(eachColor);
        }



        

        // II. fill content

        pic.innerHTML=`<img src="${data[i].main_image}"/>`;
        productName.innerHTML=data[i].title;
        price.innerHTML="TWD."+data[i].price;
        
        
     

        // III.  appendChild

        text.appendChild(colorBox);
        text.appendChild(productName);
        text.appendChild(price);
        product.appendChild(pic);
        product.appendChild(text);
        products.appendChild(product);
  
    }

    amountOfCart()
}




//===========================================================================================================//
//=========================================    loading next page    =========================================//
//===========================================================================================================//       
        // 1. 設置判斷開始條件: scroll event
        // 2. 綁定物件: getBoundingClientRect() method.
        // 3. 可在全域狀態增加 當前頁面 當前目錄 載入狀態 !!!!!!!!!!!!!!!!!!!!!!!



window.onscroll = function(){ loadingNextPage()}

function loadingNextPage( ){
  
    let mainPageProducts=document.getElementById("products"); 
    let mainPageRect=mainPageProducts.getBoundingClientRect();
    let viewed = window.scrollY+window.innerHeight;
    let lastSpace=mainPageRect.bottom+700;
   
    if ( viewed >= lastSpace && loadingStatus === true){
        loadingStatus=false;
        mainPageAPI( initCategories,  initPage )
        
    }
  
}






//==========================================================================================================//
//==============================================     Search API      =======================================//
//==========================================================================================================//



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
    let key=keywordElement.value;

    if (key.trim().length === 0){
        alert("親，請輸入有效字元")
    }else{
        searchAPI(key)
       
    }   
}


function searchProductWeb(){ 
    
    let keywordElement=document.getElementById("searchValueW");    
    let key=keywordElement.value;


    if (key.trim().length === 0){
        alert("親，請輸入有效字元")
    }else{
        searchAPI(key)     
    }

}




function searchAPI(key){

    let src = hostSrc+"products/search?keyword="+key;
    document.getElementById("products").innerHTML="";
    
   
   ~async function(){  

            await fetch(src, {method: "get"}).then(function(response){
                    return response.json();

                }).then(function(resJson){  
                    // console.log(resJson);
                    renderMainPage(resJson);      
                    if(resJson.data.length === 0){
                        products.innerHTML=" 搜尋結果 : 無相符商品 "
                    }
                }).catch(function(){
                    console.log(" searchM API error")           
            })                    
        }();
}



//==========================================================================================================//
//=========================================     Marketing Campaigns     =====================================/
//==========================================================================================================//





function campaigns(){

    let src=hostSrc+"marketing/campaigns";

    ~ async function(){

        await fetch (src ,{method:"get"}).then(function(response){
            return response.json()
        }).then(function(resJsonCampaigns){

            // console.log(resJsonCampaigns);
            renderCampaigns(resJsonCampaigns);
        

        }).catch(function(e){
            console.log(" campaigns API error")
        })

    }()
}



function renderCampaigns(resJsonCampaigns){

    let bannerWrap =  document.getElementById("bannerWrap");
    let srcProduct="https://api.appworks-school.tw/product.html?id=";
   
  
    for (let i=0; i<resJsonCampaigns.data.length; i++){

        let bannerLink = document.createElement("a");
        bannerLink.className ="bannerLink"+i;
        bannerLink.id="bannerLink"+i;
        let bannerImg = document.createElement("div");
        bannerImg.className="bannerImg";    
        let bannerStory = document.createElement("div");
        bannerStory.className = "bannerStory";

        let bannerIndexBox= document.createElement("div");
        bannerIndexBox.className = " bannerIndexBox";
        let bannerIndex0 = document.createElement("div");
        bannerIndex0.className = "bannerIndex0"+i;
        let bannerIndex1 = document.createElement("div");
        bannerIndex1.className = "bannerIndex1"+i;
        let bannerIndex2 = document.createElement("div");
        bannerIndex2.className = "bannerIndex2"+i;



        bannerLink.href = srcProduct + resJsonCampaigns.data[i].product_id;       
        bannerLink.href = "productPage.html?id=" + resJsonCampaigns.data[i].product_id;  
        bannerImg.innerHTML = "<img src=https://api.appworks-school.tw"+resJsonCampaigns.data[i].picture+">";
        bannerStory.innerHTML = resJsonCampaigns.data[i].story;
        
        bannerStory.innerHTML = bannerStory.innerHTML.replace( /\n/g, "<br/>"); // 換行字元(\r\n)替換成html的換行標籤(<br/>
        
        bannerIndexBox.appendChild(bannerIndex0);
        bannerIndexBox.appendChild(bannerIndex1);
        bannerIndexBox.appendChild(bannerIndex2);
      

        bannerLink.appendChild(bannerStory);
        bannerLink.appendChild(bannerImg);
        bannerLink.appendChild(bannerIndexBox);
        bannerWrap.appendChild(bannerLink);

     }

    slideEffect()

    }


//==========================================================================================================//
//========================================    Slide Effect     =============================================//
//==========================================================================================================//



function slideEffect(){   

   
    let banner0 = document.getElementById("bannerLink0");
    let banner1 = document.getElementById("bannerLink1");
    let banner2 = document.getElementById("bannerLink2");
 
 
    banner = [ banner0, banner1, banner2 ];

    for ( let i=0; i<banner.length; i++){ // all display: none
        banner[i].style.display="none";   
    }


    initIndex++;

    if ( initIndex === banner.length){
        initIndex=0
    }

    banner[initIndex].style.display="flex"; // control by initIndex
    banner[initIndex].classList.add("fadeTime")


}

setInterval(slideEffect, 5000)  // setInterval: loop ;  setTimeout: once




function allProductAPI(){
    products.innerHTML="";
    mainPageAPI("all");
    gtag('event', 'Click', {
        'event_category': 'Main Page',
        'event_label': '進入全部商品'
      });

};

function womenProductAPI(){
    products.innerHTML="";
    mainPageAPI("women");
    gtag('event', 'Click', {
        'event_category': 'Main Page',
        'event_label': '進入女裝點擊'
      });

};

function menProductAPI(){
    products.innerHTML="";
    mainPageAPI("men");
    gtag('event', 'Click', {
        'event_category': 'Main Page',
        'event_label': '進入男裝點擊'
      });

};

function accessoriesAPI(){
    products.innerHTML="";
    mainPageAPI("accessories");
    gtag('event', 'Click', {
        'event_category': 'Main Page',
        'event_label': '進入配件點擊'
      });

}

//==========================================================================================================//
//====================================     Shopping Cart Implementation      ===============================//
//==========================================================================================================//




let orderList = [];
if ( localStorage.getItem("list") !== null ){       
    orderList = JSON.parse(localStorage.getItem("list"))
}else{
    // console.log("cart is empty")  // if there is no [ data ] in localStorage, assign a empty [] !!!
    localStorage.setItem("list", JSON.stringify(orderList)) 
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



// window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '488997631721121',
//       cookie     : true,
//       xfbml      : true,
//       version    : 'v5.0'
//     });

//   };


// (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "https://connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));




// function checkLoginState(){

//     FB.getLoginStatus(function (response) {  
//         if(response.status === 'connected'){
//             window.location = "profilePage.html";

//         }else{
//             FB.login(function(response) {
//                 // console.log(response);          
//                 if (response.status === "connected") {
//                     window.location = "profilePage.html";   
//                   }                      
//             }, {scope: 'public_profile,email'});
//         }
//       });
// }





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

function redirection(){
 
    if ( urlParams.match("key") !== null){  //encodeURIComponent : decodeURIComponent

        keyParams = decodeURIComponent(urlParams);
        key = keyParams.replace( "?key=","" );
        searchAPI(key);
        return
    }

    redirectionCatalog =  urlParams.replace( "?catalog=","" );

        if ( redirectionCatalog === "women" ){
            womenProductAPI();          
        }else if( redirectionCatalog ==="men" ){
            menProductAPI();        
        }else if( redirectionCatalog === "accessories" ){
            accessoriesAPI();        
        }else{             
            mainPageAPI("all"); // 預設載入首頁，需以字串傳入   
        }
}
