export default{
    // 利用 props 把內層定義一個page 把參數與方法 從外層傳進來
    props:['pages', 'getProducts'],
    template: 
    `<nav aria-label="Page navigation example">
    {{page}}
    <ul class="pagination">

      <li class="page-item"
        :class = "{ disabled: !pages.has_pre }">
        <a class="page-link" href="#" aria-label="Previous"
        @click.prevent="getProducts(pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item"
        :class = "{ active: page === pages.current_page }"
        v-for="page in pages.total_pages" :key="page + 'page'">
        <a class="page-link" href="#"
        @click.prevent="getProducts(page)">{{ page }}</a>
      </li>

      <li class="page-item"
        :class = "{ disabled: !pages.has_next }">
        <a class="page-link" href="#" aria-label="Next"
        @click.prevent="getProducts(pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

    </ul>
  </nav>`
}


// <!-- 往前一頁按鈕功能 -->
// <li class="page-item"
//   <!-- 藉由has_pre把它加上class disabled 來防止按鈕往前一頁 -->
//   :class = "{ disabled: !pages.has_pre }">
//   <a class="page-link" href="#" aria-label="Previous"
//   <!-- 在a標籤增加點擊事件功能 getProducts 可以把現有的頁面current_page抓出來減一頁 -->
//   @click.prevent="getProducts(pages.current_page - 1)">
//     <span aria-hidden="true">&laquo;</span>
//   </a>
// </li>

// <!-- 往點擊前往某頁按鈕功能 -->
// <li class="page-item"
//   <!-- 藉由current_page把它加上class active 來呈現藍色加強提示 -->
//   :class = "{ active: page === pages.current_page }"
//   <!-- 利用迴圈 把有的page讀出來 要展開幾頁 -->
//   v-for="page in pages.total_pages" :key="page + 'page'">
//   <a class="page-link" href="#"
//   <!-- 在a標籤增加點擊事件功能 getProducts 可以抓取第幾頁的商品data -->
//   @click.prevent="getProducts(page)">{{ page }}</a>
//   <!-- $emit寫法 @click.prevent="$emit('change-page', page)" -->
// </li>

// <!-- 往後一頁按鈕功能 -->
// <li class="page-item"
//   <!-- 藉由has_next把它加上class disabled 來防止按鈕往後一頁 -->
//   :class = "{ disabled: !pages.has_next }">
//   <a class="page-link" href="#" aria-label="Next"
//   <!-- 在a標籤增加點擊事件功能 getProducts 可以把現有的頁面current_page抓出來減一頁 -->
//   @click.prevent="getProducts(pages.current_page + 1)">
//     <span aria-hidden="true">&raquo;</span>
//   </a>
// </li>