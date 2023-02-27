

import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'austynfree';


// 表單驗證引用 定義規則
// 讀取外部的資源
// Activate the locale
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});


// 做出產品modal的元件
const productModal = {
    // 用props 當ID接收到外層來的 變動取的遠端資料，呈現modal
    props:["id", "addToCart", "openModal"],
    data(){
        return{
            modal:{},
            tempProduct:{},
            qty: 1,
        }
    },
    template:'#userProductModal',
    // 利用watch 監聽ID變動 變動就把modal打開
    watch:{
        id(){
            //console.log("producModal", this.id);
            // 取得單一產品資料
            // 如果有ID才要去找資料
            if(this.id){
                axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
                .then(res => {
                    //console.log("單一產品列表",res.data.product);
                    this.tempProduct = res.data.product;
                    this.modal.show();
                })
            }
        }
    },
    methods:{
        // 把modal關掉(讓外層用ref呼叫)
        hide(){
            this.modal.hide();
        },
    },
    mounted(){
        // 產生產品的modal 利用refs也可用ID
        this.modal = new bootstrap.Modal(this.$refs.modal);
        // 監聽得方法 如果modal被關掉了 要把watch 的ID 清空 
        this.$refs.modal.addEventListener("hidden.bs.modal", (event) =>{
            //console.log("modal關閉");
            // 內層不能直接改外層的id 要叫外層改id 
            //把openModal塞到modal裡面 讓外面的openModal把ID清空
            this.openModal("");

        });
    }

}

// VUE起手
const app = createApp({
    data(){
        return{
            products:[],
            productId:"",
            cart:{},
            // 存ID 操作的時候 要暫停
            loadingItem :"",
            // 表單驗證資料
            user: {
                name: "",
                email: "",
                tel: "",
                address: "",
            },
            message: "",
        }
    },
    methods:{
        // 找到所有的產品列表
        getProducts(){
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
            .then(res => {
                //console.log("全部的產品列表",res);
                this.products = res.data.products;
            })
        },
        // 若點擊個多資料 > ID變動從外傳到modal元件 > modal要打開
        openModal(id){
            this.productId = id;
            //console.log("最外面帶入的ID:", id);
        },
        // 加入購物車
        addToCart(product_id, qty = 1){
            const data = {
                product_id,
                qty,
            };
            // 把產品加入購務車
            axios.post(`${apiUrl}/api/${apiPath}/cart`, {data})
            .then(res => {
                //console.log("加入購物車",res.data);
                // 利用ref呼叫modal裡面的hide關掉modal
                this.$refs.productModal.hide();
                // 每次加入購物車都要觸發
                this.getCarts();
            })
        },
        getCarts(){
            // 取得所有購物車產品資料
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
            .then(res => {
                //console.log("購物車",res.data);
                this.cart = res.data.data;
            })
        },
        // 更新購物車數量 購物車ID 產品ID
        updateCartItem(item){
            const data = {
                product_id : item.product.id,
                qty: item.qty,
            };
            //console.log(data,item.id);
            // 更新的時候先存ID 如果頁面被更換就比對ID
            this.loadingItem = item.id;
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, {data})
            .then(res => {
                //console.log("更新購物車",res.data);
                // 每次更新購物車都要觸發
                this.getCarts();
                // 處理完就清空
                this.loadingItem = "";
            })
        },
        // 刪除品項
        deleteItem(item){
            this.loadingItem = item.id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${item.id}`)
            .then(res => {
                //console.log("刪除購物車",res.data);
                // 刪除購物車都要觸發
                this.getCarts();
                // 處理完就清空
                this.loadingItem = "";
            })
        },
        // 電話驗證
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/;
            return phoneNumber.test(value) ? true : '需要正確的手機號碼';
        },
        // 表單驗證
        onSubmit() {
            const data = {
                user: this.user,
                message: this.message,
            };
            axios.post(`${apiUrl}/api/${apiPath}/order`, { data })
            .then((res) => {
                alert(res.data.message);
                this.$refs.form.resetForm();
                this.getCarts();
            })
            .catch((err) => {
                alert(err.data.message);
            });
        },
    },
    // 區域註冊元件
    components:{ 
        productModal,
    },
    mounted(){
        this.getProducts();
        this.getCarts();

    }
});

// 表單驗證 全域註冊
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

// 掛載於畫面
app.mount('#app');