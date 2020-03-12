let hostSrc = "https://api.appworks-school.tw/api/1.0/" ;
let currentColor = "";
let currentColorName = "";
let currentSize = "";
let currentStock = "";
let currentQty = 1;
let currentID = "";
let currentName = "";
let currentPrice = "";
let sameColorSizes = [];
let sameColorSizesOfStock = [];



//==========================================================================================================//
//==============================================    Query String      =====================================//
//==========================================================================================================//


//         /// use URLSearchParams API ------ IE doesn't support 

// let urlParams = new URLSearchParams(window.location.search);
// let id = urlParams.get("id")  
// productPageAPI(id)


let urlParams = window.location.search;
let id = urlParams.replace( "?id=", "" );
productPageAPI(id)


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
//==============================================     Product Page      =====================================//
//==========================================================================================================//


function productPageAPI(id){

   
   
    let ProductSrc=hostSrc+"products/details?id="+id
   


    ~async function(){

        await fetch( ProductSrc , { method: "get"}).then(function( response ){
            return response.json();
        }).then(function(resJson){



            // console.log(resJson)
            
            let data = resJson.data;
            
            currentColor = data.colors[0].code; // default currentColor

    
        
            if ( data.variants[0].stock === 0 ){ // default currentSize     
                currentSize = data.sizes[1];
                currentStock = data.variants[1].stock; // default currentStock  

           }else{
                currentSize = data.sizes[0];
                currentStock = data.variants[0].stock;
            }

            currentName = data.title;
            currentID = data.id;
            currentPrice = data.price;
            currentColorName = data.colors[0].name;

            initProductDetail(resJson)
           
            

        }).catch(function(e){
            console.log( "Product Page API error" )

            let products = document.getElementById("products"); // when user enter wrong id in url
            products.style.justifyContent = "center";
            products.innerHTML=" 搜尋結果 : 無相符商品 ";

        });

    }();

}


function initProductDetail(resJson){

    let data = resJson.data;


    for( let i=0; i<data.variants.length; i++){   // update currentProductDetail

        if ( data.variants[i].color_code === currentColor){
            
            sameColorSizes.push( data.variants[i].size );
            sameColorSizesOfStock.push( data.variants[i].stock )
        }

    }

    // console.log("初始庫存剩餘 : ",sameColorSizesOfStock)
    renderProductPage(resJson);      
    
}


function renderProductPage(resJson){

    for (i=0; i<sameColorSizes.length; i++){

        if ( sameColorSizesOfStock[i] !== 0){

            currentStock = sameColorSizesOfStock[i];
            currentSize = sameColorSizes[i]

            break
        }
    }

    
    let data = resJson.data;

    let products = document.getElementById("products");
        products.innerHTML="";

    let productImg = document.createElement("div");
        productImg.className="productImg";


    let productContent = document.createElement("div");
        productContent.className = "productContent";
    let itemName = document.createElement("div");
        itemName.className = "itemName";
        itemName.setAttribute("value",`${data.title}`)
       

    let productID = document.createElement("div");
        productID.className = "productID";
    let productPrice = document.createElement("div");
        productPrice.className = "productPrice";


    let productColor = document.createElement("div");
        productColor.className = "productColor";
    let colorStr = document.createElement("div");
        colorStr.className = "colorStr";
    let colorMenu = document.createElement("div");
        colorMenu.className = "colorMenu";

     for( let i=0; i<data.colors.length; i++){
        let colorEach = document.createElement("div");
        let colorEachBox = document.createElement("div");
            colorEach.className = "colorEach";
            colorEachBox.className = "colorEachBox";
            colorMenu.appendChild(colorEachBox);
            colorEachBox.appendChild(colorEach);
            colorEach.style.backgroundColor = "#" + data.colors[i].code;
            colorEachBox.name = data.colors[i].code;
            colorEachBox.title = data.colors[i].name;
            

            if (`${data.colors[i].code}` === currentColor){
                colorEachBox.className += " active";
            }        
    }   
 
    let productSize = document.createElement("div");
        productSize.className = "productSize";
    let sizeStr = document.createElement("div");
        sizeStr.className = "sizeStr";
    let sizeMenu = document.createElement("div");
        sizeMenu.className = "sizeMenu";
        sizeMenu.setAttribute("id","sizeMenu");
    
    for( let i=0; i<sameColorSizes.length; i++){
            let sizeEach = document.createElement("div");
                sizeEach.className = "sizeEach";
                sizeMenu.appendChild(sizeEach);
                sizeEach.innerHTML = `${data.sizes[i]}`;
                sizeEach.setAttribute("name",`${data.sizes[i]}`);
            if ( sameColorSizesOfStock[i] === 0){
                sizeEach.style.opacity=0.3;
                                   
            }

            if ( `${data.sizes[i]}` === currentSize){ 
                sizeEach.className += " active-Size";
            }

    }  

        
    let productQuantity = document.createElement("div");
        productQuantity.className = "productQuantity";
    let QuantityMenu = document.createElement("div");
        QuantityMenu.className = "QuantityMenu";
    let QuantityStr = document.createElement("div");
        QuantityStr.className = "QuantityStr";   
    let quanSub = document.createElement("button");
        quanSub.className = "quanSub";
    let quan = document.createElement("div");
        quan.className = "quan";
    
    let quanPlus = document.createElement("button");
        quanPlus.className = "quanPlus";
   

   
    let sizeBtn = document.createElement("button");
        sizeBtn.className = "sizeBtn";

    let descriptionWrap = document.createElement("div");
        descriptionWrap.className = "descriptionWrap";
    let descriptionTop = document.createElement("div");
    let descriptionMiddle = document.createElement("div");      
    let descriptionBottom = document.createElement("div");
    


    let productDetailWrap = document.createElement("div");
        productDetailWrap.className = "productDetailWrap"; 
    let productTitle = document.createElement("div");
        productTitle.className = "productTitle";
    let productStory = document.createElement("div");
        productStory.className = "productStory";
    let productImages = document.createElement("div");
        productImages.className = "productImages";



        // < products >
    products.appendChild(productImg);
    products.appendChild(productContent);
    products.appendChild(productDetailWrap);
    productImg.innerHTML = `<img src=${data.main_image} />`;



        // < productContent >
    productContent.appendChild(itemName); 
    productContent.appendChild(productID);    
    productContent.appendChild(productPrice);
    productContent.appendChild(productColor);
    productContent.appendChild(productSize);
    productContent.appendChild(productQuantity);
    productContent.appendChild(sizeBtn);
    productContent.appendChild(descriptionWrap);


    itemName.innerHTML = data.title;
    currentName = data.title;
    productID.innerHTML = data.id;
    currentID = data.id;
    productPrice.innerHTML = `TWD. ${data.price}`;
    currentPrice = data.price;
    sizeBtn.innerHTML = "加入購物車";
    sizeBtn.setAttribute("onclick","addToCart()")


        // < productsSize >
    productSize.appendChild(sizeStr);
    productSize.appendChild(sizeMenu);   
   
    sizeStr.innerHTML = "尺寸";



        // <productQuantity >
    productQuantity.appendChild(QuantityStr);
    productQuantity.appendChild(QuantityMenu);
    QuantityMenu.appendChild(quanSub);
    QuantityMenu.appendChild(quan);
    QuantityMenu.appendChild(quanPlus);
    


    quanSub.innerHTML = "-";
    quanPlus.innerHTML = "+";
    QuantityStr.innerHTML= "數量";




        // <  productColor >
    productColor.appendChild(colorStr);
    productColor.appendChild(colorMenu);

    colorStr.innerHTML = "顏色" ;




        // < descriptionWrap >
    descriptionWrap.appendChild(descriptionTop);
    descriptionWrap.appendChild(descriptionMiddle);
    descriptionWrap.appendChild(descriptionBottom);
     

    descriptionTop.innerHTML = `*${data.note}<br/><br/>${data.texture}<br/>`                       
    descriptionMiddle.innerHTML = data.description;
    descriptionMiddle.innerHTML = descriptionMiddle.innerHTML.replace(/\n/g,"<br>");
    descriptionBottom.innerHTML =  `<br/>清洗 : ${data.wash}</br>產地 : ${data.place}`;


        // < descriptionDetail >

    productDetailWrap.appendChild(productTitle);
    productDetailWrap.appendChild(productStory);
    productDetailWrap.appendChild(productImages);
      

    productTitle.innerHTML = "<strong>更多資訊</strong>";
    productStory.innerHTML = data.story;

    for (let i=0; i<data.images.length; i++){

        productImages.innerHTML += `<img src=${data.images[i]} />`

    }


    let cartAmount = document.getElementById("cartAmount");
    let cartAmountMobile = document.getElementById("cartAmountMobile");
    
    cartAmount.innerHTML = orderList.length;
    cartAmountMobile.innerHTML = orderList.length;
    
    currentColorClick(resJson)
    currentSizeClick(resJson)
    
}



//==========================================================================================================//
//==============================================     stock record      =====================================//
//==========================================================================================================//




function currentColorClick(resJson){
        // 1. Get the container element 
        // 2. Get all <div> with class="colorEachBox" inside the container
        // 3. Loop through the <div> and add the active class to the current/clicked <div>
        // 4.control current item === 1

        let colorMenu = document.querySelector(".colorMenu");     
        let colorEachBox = colorMenu.getElementsByClassName("colorEachBox"); 

        for (let i = 0; i < colorEachBox.length; i++) {  
            colorEachBox[i].addEventListener("click", function() {
               
                let current = document.getElementsByClassName(" active");
                if (current.length > 0){
                    current[0].className = current[0].className.replace(" active","");           
                }     
                
                this.className += " active";
                currentColor = this.name;         
                currentColorName =this.title

                sameColorSizes=[];
                sameColorSizesOfStock=[];
               

                for( let i=0; i<resJson.data.variants.length; i++){   // update currentProductDetail
                    if ( resJson.data.variants[i].color_code === currentColor){                   
                        sameColorSizes.push( resJson.data.variants[i].size );
                        sameColorSizesOfStock.push( resJson.data.variants[i].stock )
                    }    
                }

                

                renderProductPage(resJson)
                // console.log( "庫存剩餘 : " ,sameColorSizesOfStock)                
            })
        }
    }





function currentSizeClick(resJson){    


    let sizeMenu = document.querySelector(".sizeMenu"); 
    let sizeEach = sizeMenu.getElementsByClassName("sizeEach");

    
    for (let j = 0; j < sameColorSizes.length; j++) {

        sizeEach[j].addEventListener("click", function() {

            let current = document.getElementsByClassName(" active-Size");
            if (current.length > 0){
                current[0].className = current[0].className.replace(" active-Size","");           
            }     
            
           this.className += " active-Size";



           if (sizeEach[j].name !== currentSize){ // sizeEach[j].name:chose
                currentSize =  sameColorSizes[j];
                currentStock = sameColorSizesOfStock[j]

            }
            
            
            let quan = document.querySelector(".quan");
            if (currentStock === 0){ // currentStock === 0, order number = 0 immediately              
                currentQty = 0;
                quan.innerHTML = 0;
            }else{
                currentQty = 1;
                quan.innerHTML = 1; // initialize order number when user switch different size
            }
            
            
        });
    }   
    
    quantity()
}


function quantity(){


        //  quantity

    let quan = document.querySelector(".quan");
    let quanSub = document.querySelector(".quanSub");
    let quanPlus = document.querySelector(".quanPlus");
    let orderNumber = 1;
    
    


    quan.innerHTML = orderNumber
    quanSub.addEventListener("click", ()=>{
        orderNumber-=1;

        if(orderNumber < 1){
            orderNumber = 1
        }

        quan.innerHTML = orderNumber;
        currentQty = orderNumber;

    })

    quanPlus.addEventListener("click", ()=>{
        orderNumber+=1;

        if(orderNumber > currentStock ){
            orderNumber = currentStock
        }

        quan.innerHTML = orderNumber;
        currentQty = orderNumber;
    })


    
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



function addToCart(){   

   
    let list = 
    
        {

        "id": currentID,
        "name": currentName,
        "price": currentPrice,
        "color": {
        	"code": currentColor,
            "name": currentColorName,
        },
        "size": currentSize,
        "qty": currentQty

        }   
   
    
    if( currentStock !==0 ){

        if (orderList.length === 0){
            orderList.push(list);     
            localStorage.setItem( "list", JSON.stringify(orderList)) 
            alert("已加入購物車")
            // console.log(orderList)

        }else{
            checkDuplicateOrder()
        }        
    }else{
        alert("庫存不足")
    } 

    amountOfCart()   
} 


function checkDuplicateOrder(){ 

    let checkStock
    let isDuplicated=false;    
    let list = 
            {

            "id": currentID,
            "name": currentName,
            "price": currentPrice,
            "color": {
                "code": currentColor,
                "name": currentColorName,
            },
            "size": currentSize,
            "qty": currentQty

            }

    
    for (i=0; i<orderList.length; i++){ // check Duplicate
        
        if ( orderList[i].id===currentID && orderList[i].size===currentSize && orderList[i].color.code === currentColor){                            
            
            checkStock = orderList[i].qty+currentQty;
            isDuplicated=true;
           
            if ( checkStock > currentStock ){ // check Stock
             
                alert("庫存不足")                          

            }else{

                orderList[i].qty+=currentQty
                localStorage.setItem( "list", JSON.stringify(orderList)) 
                break
                
            }          
        }         
    }


    if ( isDuplicated === false){
        orderList.push(list);     
        localStorage.setItem( "list", JSON.stringify(orderList));      
        alert("已加入購物車");
    }

    isDuplicated === false;
    amountOfCart(); 
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