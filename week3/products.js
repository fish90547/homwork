
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 建立modal
let productModal = null;
let delProductModal = null;

createApp({
  data(){
    return{
      api: 'https://vue3-course-api.hexschool.io/v2',
      path: 'austynfree',
      // 產品
      products: [],
      // 選擇暫存的資料 
      temp:{
        // 可以塞入小圖
        imagesUrl: [],
      },
      // 判斷uploadProducts 要新增還是更新產品
      isNew:false,
    } 
  },
  methods:{
    // 確認權限
    checkPermession(){
      // Vue 會把資料弄在同一層 可以直接this
      const url =`${this.api}/api/user/check`;
      axios.post(url)
      .then((res)=>{
        console.log(res, "checkResult");
        // 成功 執行找產品資料
        this.getProducts();
      })
      .catch((err)=>{
        alert(err.data.message)
        // 失敗 返回登入
        window.location = "login.html";
      })
    },
    // 找產品資料
    getProducts(){
      const url = `${this.api}/api/${this.path}/admin/products/all`;
      axios.get(url)
      .then((res)=>{
        // 把資料塞到 products裡
        //console.log(res, "products")
        //this.products = res.products; //少一層
        this.products = res.data.products;
      })
      .catch((err)=>{
        alert(err.data.message)
      })
    },
    // 新增或編輯一個產品
    updateProducts(){
      // 編輯產品的url
      let url = `${this.api}/api/${this.path}/admin/product/${this.temp.id}`;
      // 更新產品要用put
      let Http = "put";
      
      if(this.isNew){
        // 新增產品的url
        url = `${this.api}/api/${this.path}/admin/product/`;
        // 新增產品用 post
        Http = "post";
      }

      // 用法同axios.get || axios.post
      axios[Http](url, { data: this.temp })
      .then((res)=>{
        // 跳出成功訊息
        alert(res.data.message);
        // 隱藏編輯modal介面
        productModal.hide();
        // 重新載入產品頁面
        this.getProducts();
      })
      .catch((err)=>{
        alert(err.data.message);
      })
    },
    // 刪除一個產品
    deleteProduct(){
      const url = `${this.api}/api/${this.path}/admin/product/${this.temp.id}`;

      axios.delete(url)
      .then((res)=>{
        alert(res.data.message);
        delProductModal.hide();
        this.getProducts();
      })
      .catch((err)=>{
        console.log(err, "err");
        alert(err.data.message);
      })
    },
    openModal(status, product){
      //console.log("openModal");
      // 新增
      if(status == "new"){
        // 新產品要清空
        console.log("new");
        this.temp = {
          // 小圖也要清空
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      }
      // 更新
      else if(status == "update"){
        // 把資料帶入
        console.log("update");
        this.temp = { ...product };
        this.isNew = false;
        productModal.show();
      }
      // 刪除
      else if(status == "delete"){
        console.log("delete");
        this.temp = { ...product };
        //console.log(this.temp, "this.temp");
        this.isNew = false;
        delProductModal.show();
      }
    },
    // 如果都沒有附加多圖 建立暫存的Array 放多圖的網址
    createPictures(){
      this.temp.imagesUrl=[];
      // 推出一個空位填網址
      this.temp.imagesUrl.push("");
    }
  },
  // 生命週期 進來會先執行一次
  mounted() {
    // 連進來先確認權限
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    // 登入成功時，存下token
    //axios.defaults.headers.common["Authorization"] = token;

    this.checkPermession();

    // 產生產品編輯與新增的modal 看解答才知道的用法
    productModal = new bootstrap.Modal(document.getElementById('productModal'),{keyboard: false});

    // 產生刪除產品的modal
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'),{keyboard:false});


  }
}).mount('#app');
