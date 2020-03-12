//==========================================================================================================//
//===========================================     Product  API     =========================================//
//==========================================================================================================//

const hostSrc = "https://api.appworks-school.tw/api/1.0/" ;
let orderList = [];  // for localStorage
let eachTotalList = [];
let subtotal = 0;
let freight = 0;
let total = 0;
let fbToken;
let headersAPI;




getStorageData();

function getStorageData(){

    let contentWrap = document.getElementById("contentWrap");
        contentWrap.innerHTML="";

    if ( localStorage.getItem("list") !== null ){   
        orderList = JSON.parse(localStorage.getItem("list"));
        
        for ( index in orderList ){
            productAPI(orderList[index].id, orderList[index])
        };
        amountOfCart();
     
    }else{
        localStorage.setItem("list", JSON.stringify(orderList));
        amountOfCart();            
    }


   
}




function productAPI(id, currentOrder){
 
    let ProductSrc=hostSrc+"products/details?id="+id;
    let orderDetail = {
        "name": currentOrder.name,
        "id": currentOrder.id,
        "color": currentOrder.color.name,
        "colorCode":currentOrder.color.code,
        "size": currentOrder.size,
        "qyt": currentOrder.qty,
        "eachPrice": currentOrder.price,
        "eachPriceTotal": (currentOrder.qty)*(currentOrder.price),
        "freightFee":60,
    }

    eachTotalList.push(orderDetail.eachPriceTotal);  

    (async ()=>{        
        await fetch( ProductSrc , {method: "get"}).then(function(response){
            return response.json();        
        }).then(function(resJson){
            // console.log(resJson);
           
            renderCart(orderDetail, resJson)             
        }).catch(function(e){
            console.log("product API error")
        })
    })();



}



function renderCart(orderDetail, resJson){

    let stock ;
    let sum=0;
    let data = resJson.data;
    let currentCheck = String(orderDetail.id) + orderDetail.colorCode + orderDetail.size;
    
    let contentWrap = document.getElementById("contentWrap");
    let totalPrice = document.getElementById("totalPrice");
    let finalPrice = document.getElementById("finalPrice");
    let freightFee = document.getElementById("freightFee");

    
        // productContent >>
    let productContent = document.createElement("div");
        productContent.className = "productContent"; 
        contentWrap.appendChild(productContent);
    
         // productContent >> productImg
    let productImg = document.createElement("div");
        productImg.className = "productImg"; 
        productImg.innerHTML = `<img src=${data.main_image} />`
        productContent.appendChild(productImg);
        

    //     /// productContent >> productInfo
    let productInfo = document.createElement("div");
        productInfo.className = "productInfo";    
        productContent.appendChild(productInfo);

    let productName = document.createElement("div");
        productName.className = "productName";
        productName.innerHTML = orderDetail.name;
        productInfo.appendChild(productName);

    let delImg = document.createElement("img");
        delImg.className ="delImg";
        delImg.src="images/cart-remove.png"
        delImg.setAttribute("onclick", `removeItem('${currentCheck}')`)
        productInfo.appendChild(delImg);

    let productID = document.createElement("div");
        productID.className="productID";
        productID.innerHTML = orderDetail.id;
        productInfo.appendChild(productID);


    let productColor = document.createElement("div");
        productColor.className="productColor";
        productColor.innerHTML = `<br/>顏色：${orderDetail.color}`
        productInfo.appendChild(productColor);

    let productSize = document.createElement("div");
        productSize.innerHTML = `尺寸：${orderDetail.size}`
        productSize.className="productSize";
        productInfo.appendChild(productSize);


    //     ///  productContent >> priceInfo

    let priceInfo = document.createElement("div");
        priceInfo.className="priceInfo";
        productContent.appendChild(priceInfo);


    //     ///  productContent >> priceInfo >> qtyBox

    let qtyBox = document.createElement("div");
        qtyBox.className = "qtyBox";
        priceInfo.appendChild(qtyBox);

    let qytSpan = document.createElement("span");
        qytSpan.innerHTML = "數量";    
        qtyBox.appendChild(qytSpan);

    let amountMenu = document.createElement("div");
        amountMenu.className="amountMenu"; 
        qtyBox.appendChild(amountMenu);


    let qtySelect = document.createElement("select");
        qtySelect.className = "qtySelect";
        qtySelect.name = currentCheck;
        qtySelect.id = currentCheck;
        qtySelect.setAttribute("onChange", `updateQty('${currentCheck}')`); // Once the qyt changes, call function  >>  ( <select> ).value
        amountMenu.appendChild(qtySelect);

    for( i in resJson.data.variants ){  // get current stock of product
        if ( (orderDetail.size === resJson.data.variants[i].size )&&(orderDetail.colorCode === resJson.data.variants[i].color_code)){
            stock = resJson.data.variants[i].stock;
        }
    }

   
    for( i=1; i<stock+1; i++){
        let stockOption = document.createElement("option");
        stockOption.innerHTML = i;
        if ( i === orderDetail.qyt){
            stockOption.setAttribute("selected","selected"); // default qyt     
        }
        qtySelect.appendChild(stockOption);
    }

    

    //     ///  productContent >> priceInfo >> eachPriceBox

    let eachPriceBox = document.createElement("div");
        eachPriceBox.className="eachPriceBox";
        priceInfo.appendChild(eachPriceBox);

    let eachPriceSpan = document.createElement("span");     
        eachPriceSpan.innerHTML = "單價";    
        eachPriceBox.appendChild(eachPriceSpan);


    let eachPrice = document.createElement("div");
        eachPrice.className = "eachPrice";
        eachPrice.innerHTML = `NT. ${orderDetail.eachPrice}`
        eachPriceBox.appendChild(eachPrice);

    //     ///  productContent >> priceInfo >> totalOfEachBox
    
    let totalOfEachBox = document.createElement("div");
        totalOfEachBox.className="totalOfEachBox";
        priceInfo.appendChild(totalOfEachBox);

    let totalOfEachBoxSpan = document.createElement("span");    
        totalOfEachBoxSpan.innerHTML = "小計";  
        totalOfEachBox.appendChild(totalOfEachBoxSpan);


    let totalOfEach = document.createElement("div");
        totalOfEach.className="totalOfEach";
        totalOfEach.setAttribute("id","totalOfEach");
        totalOfEach.innerHTML =  `NT. ${orderDetail.eachPriceTotal}`;
        totalOfEachBox.appendChild(totalOfEach);

    
    for ( i in eachTotalList ){
        sum+=eachTotalList[i]
    };
    

    subtotal = sum;
    freight = orderDetail.freightFee;
    total = (sum + orderDetail.freightFee);

    totalPrice.innerHTML = "NT. " + sum;
    freightFee.innerHTML = "NT. " + orderDetail.freightFee;
    finalPrice.innerHTML = "NT. " + (sum + orderDetail.freightFee);
    amountOfCart();



}




function amountOfCart(){
  
    let cartAmount = document.getElementById("cartAmount");
    let cartAmountMobile = document.getElementById("cartAmountMobile");

    cartAmount.innerHTML = orderList.length;
    cartAmountMobile.innerHTML = orderList.length;


    if (orderList.length === 0){  
        emptyCart()
    }

}




function updateQty(currentCheckProduct){
    let currentCheck = document.getElementById(`${currentCheckProduct}`).name;  
    let changedQty =  document.getElementById(`${currentCheckProduct}`).value;  //  [the latest qyt]    get the latest selected of <select>  value

    for( i in orderList){
        let orderListCheck = String(orderList[i].id) + orderList[i].color.code + orderList[i].size;
        if ( orderListCheck === currentCheck){
            orderList[i].qty = Number(changedQty);
        };
    }

    localStorage.removeItem("list");
    localStorage.setItem("list", JSON.stringify(orderList));
    eachTotalList = []
    getStorageData()

  
}
    



function removeItem(currentCheckProduct){

    let currentCheck = document.getElementById(`${currentCheckProduct}`).name;  

    for( i in orderList){
        let orderListCheck = String(orderList[i].id) + orderList[i].color.code + orderList[i].size;
        if ( orderListCheck === currentCheck){
            orderList.splice(i,1) // delete 1 from index[i]
        };
    }

    if ( orderList.length !== 0){
        localStorage.removeItem("list");
        localStorage.setItem("list", JSON.stringify(orderList));
    }else{
        localStorage.clear();  // It's necessary, otherwise the local storage will save [], not empty
    }

    subtotal = 0;
    freight = 0;
    total = 0;
    
    eachTotalList = [];
    getStorageData(); 
    
}



function emptyCart(){

    let contentWrap = document.getElementById("contentWrap");
    contentWrap.innerHTML="購物車內無商品";
    contentWrap.setAttribute("style", "text-align: center; padding: 100px 0 100px 0; font-size:16px") 

    document.getElementById("totalPrice").innerHTML = "NT. 0";
    document.getElementById("freightFee").innerHTML = "NT. 0";
    document.getElementById("finalPrice").innerHTML = "NT. 0";

}



// //==========================================================================================================//
// //=========================================     Check Data      ============================================//
// //==========================================================================================================//


function CheckData(){

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;
    let shipping =  document.getElementById("countrySelect").value;  //  choosing <select> can get <option> value automaticlly
    let payment =  document.getElementById("payMethodSelect").value;

                // !!!!!! method 1 : <RADIO> get value
    let time = document.querySelector('input[name="time"]:checked').value;
                // !!!!!! method 2 : <RADIO> get value
    // let timeSet = document.getElementsByName("time");  // return Set
    // for (i in timeSet){
    //     if (timeSet[i].checked){
    //         time = timeSet[i].value;
    //         break
    //     }
    // }

    if (subtotal === 0){
        alert("購物車目前無商品");
        return;
    }else if( name.trim().length === 0 ){
        alert("請輸入收件人名字");
        return;
    }else if( phone.trim().length === 0 ){
        alert("請輸入電話號碼");
        return;
    }else if( email.trim().length === 0 ){
        alert("請輸入mail");
        return;
    }else if( address.trim().length === 0 ){
        alert("請輸入地址");
        return;
    }
    
    let order= {

        "shipping": shipping,
        "payment": payment,
        "subtotal": subtotal,
        "freight": freight,
        "total": total,
        "recipient": {
                        "name": name,
                        "phone": phone,
                        "email": email,
                        "address": address,
                        "time": time
                     },
        "list": orderList 
    };

    onSubmit(event, order);
    document.getElementById("loading").style.display = "flex";
}

// //==========================================================================================================//
// //==============================================     TapPay      ===========================================//
// //==========================================================================================================//

TPDirect.setupSDK(12348, "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF", "sandbox");

// let payBtn = document.getElementById("paybtn");

TPDirect.card.setup({
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '後三碼'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '15px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '15px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '15px'
        },
        // style focus state
        ':focus': {
            'color': '#3f3a3a'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})




TPDirect.card.getTappayFieldsStatus()

function onSubmit(event,order) {

    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {

        alert("信用卡交易失敗，請重新輸入");
        console.log('can not get prime')
        return;
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {

            console.log('get prime error ' + result.msg);
            return
        };

        let prime = result.card.prime;
        // console.log('get prime 成功，prime: ' + result.card.prime)   

        let data = {
            "prime": prime,
            "order": order
        };

        CheckOutAPI(data);
    })
}


// //==========================================================================================================//
// //==========================================     Check Out API      ========================================//
// //==========================================================================================================//

function CheckOutAPI(data){

    let src = hostSrc + "order/checkout";
    
    if ( fbToken !== undefined ){
        headersAPI = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${fbToken}`
        }
    }else{
        headersAPI = {
            "Content-Type": "application/json"
        }
    };
    

    (async ()=>{

        await fetch( src, {

            method: "POST",
            headers: headersAPI,
            body:JSON.stringify(data),

        }).then(function(response){
            return response.json();
        
        }).then(function(resJson){
            // console.log(resJson);
            localStorage.removeItem("list");
            window.location = "thankPage.html?orderNumber="+resJson.data.number;

            // localStorage.setItem("orderNumber",JSON.stringify(resJson.data.number)); // this method needs to reload again in thankPage, or the orderNumber can not display
        }).catch(function(e){
            console.log("Check Out API error");
        })
    })();


    gtag('event', 'Sumit', {
        'event_category': 'Cart Page',
        'event_label': '購買商品'
      });
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
      
    FB.getLoginStatus(function (response) {  
        
        if (response.status === "connected") {
            
            fbToken = "";
            fbToken = response.authResponse.accessToken;

            FB.api('/me', {
                'fields': 'id,name,email,picture'
              }, function (response) {
    
                document.getElementById("memberIconM").src = `http://graph.facebook.com/${response.id}/picture?type=small`;
                document.getElementById("memberIconM").style = "border-radius: 50%";
                document.getElementById("memberIconW").src = `http://graph.facebook.com/${response.id}/picture?type=small`;
                document.getElementById("memberIconW").style = "border-radius: 50%; height: 38px; width: 38px";        
               
              });
        };      
      })          
  };


(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


function checkLoginState(){  // step 3 click event

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