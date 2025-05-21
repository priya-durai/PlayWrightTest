export class APIUtils{
     apiContext: any;
     loginPayload: String;

    constructor(apiContext:any,loginPayload:String){
        this.apiContext=apiContext;
        this.loginPayload=loginPayload;
    }

    async getToken(){
        const loginResponse=await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",{data:this.loginPayload});
        const loginJsonResponse=await loginResponse.json();
        const token=loginJsonResponse.token;
        console.log(token);
        return token;
    }

    async createOrder(createOrderAPIPayload){
        let response={token:'',orderId:''};
        response.token=await this.getToken();
        const orderResponse=await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",{data:createOrderAPIPayload,
            headers:{
            'Authorization':response.token,
            'Content-Type':'Application/json'
           }
           });
           const orderJSONResponse=await orderResponse.json();
           const orderId=orderJSONResponse.orders[0];
           console.log(orderId);
           response.orderId=orderId;
           return response;
    }
}

module.exports={APIUtils};

