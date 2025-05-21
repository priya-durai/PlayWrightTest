const {test,expect,request} =require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');
const apiLoginPayload={"userEmail":"anshika@gmail.com","userPassword":"Iamking@000"};
const createOrderAPIPayload={orders: [{country: "India", productOrderedId: "67a8dde5c0d3e6622a297cc8"}]};
const fakeResponsePayload={data:[],message:"No Orders"};

let response;
test.beforeAll(async () => {
    const apiContext=await request.newContext();
    const apiUtils=new APIUtils(apiContext,apiLoginPayload);
    response=await apiUtils.createOrder(createOrderAPIPayload);
    //Create Order via Api
});

test.beforeEach(()=>{

});


test('API test for login',async ({page})=>{
   page.addInitScript(value=>{
    window.localStorage.setItem('token',value);
   },response.token);
   const productName="ZARA COAT 3";
   //const email="";
   await page.goto("https://rahulshettyacademy.com/client/");
   const products=await page.locator(".card-body");
   console.log(await expect(products).toHaveCount(9));
   const titles=await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const count=await products.count();
    console.log(count);
    //await page.pause();
    for(let i=0;i<count;i++){
        const text=await products.nth(i).locator('b').textContent();
        console.log(text);
        //await page.pause();
        if(text==productName){          
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    
    await page.locator("button[routerlink='/dashboard/cart']").click();
    await expect(page.locator("div.cart h3")).toHaveText('ZARA COAT 3');
    await page.locator('button.btn-primary').filter({hasText:'Checkout'}).click();
    await expect(page.locator('div.payment__type--cc')).toBeVisible();
    await page.locator("div.payment__cc div.title+input").nth(1).fill('666');
    await page.locator("div.payment__cc div.title+input").nth(2).fill('Priya');
    await page.getByPlaceholder('Select Country').pressSequentially("Ind");

    const countryResults=await page.locator("section.ta-results");
    await countryResults.waitFor();
    const optionsCount=await countryResults.locator("button").count();
    //console.log(optionsCount);
    for(let i=0;i<optionsCount;i++){
        console.log(await countryResults.locator("button").nth(i).textContent());
        if(await countryResults.locator("button").nth(i).textContent()===' India'){
            console.log("clicked India");
            await countryResults.locator("button").nth(i).click();
            break;
        }
    }
    await page.locator("div.payment__cc div.title+input").nth(3).fill('rahulshettyacademy');
    await page.locator("div.payment__cc div.title+input").nth(3).fill('rahulshettyacademy');
    await page.locator("")
    await page.locator("div.small button").click();
    await expect(page.locator("p.ng-star-inserted")).toBeVisible();
    //await expect(page.locator("p.ng-star-inserted")).toHaveText("* Coupon Applied");
    await page.locator("a.action__submit").click();
    response.orderId=await page.locator("label.ng-star-inserted").textContent();
    await page.locator("button[routerlink='/dashboard/myorders']").click();
    const listOfOrders=await page.locator("tbody tr");
    for(let j=0;j<await listOfOrders.count();j++){
       if(await listOfOrders.locator('th').nth(j).textContent()===response.orderId){
        await listOfOrders.locator("td button").nth(j).click();
        break;
       }
    }
});

test('Order created with API and searched in order history page',async ({page})=>{
   await page.goto("https://rahulshettyacademy.com/client/dashboard/myorders");
   const listOfOrders=await page.locator("tbody tr");
    for(let j=0;j<await listOfOrders.count();j++){
       if(await listOfOrders.locator('th').nth(j).textContent()===response.orderId){
        await listOfOrders.locator("td button").nth(j).click();
        break;
       }
    }
});

test.only('Order history page with no orders in it',async ({page})=>{
   page.addInitScript(value=>{
    window.localStorage.setItem('token',value);
   },response.token);
   await page.goto("https://rahulshettyacademy.com/client/");
   await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
   async route=>{
    const body=JSON.stringify(fakeResponsePayload);
    const response=await page.request.fetch(route.request());
    route.fulfill({
      response,
        body
    });
   });
   await page.locator("button[routerlink='/dashboard/myorders']").click();
   await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
   console.log(await page.locator(".mt-4").textContent());
});