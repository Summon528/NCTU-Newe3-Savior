<a href="https://chrome.google.com/webstore/detail/nctu-%E6%96%B0e3%E6%95%91%E6%98%9F/eefhoknfalkinfipjbhiohlgjflkbeik?hl=zh-TW"><img align="right" src="https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_340x96.png"></a>

# NCTU 新e3 救星
### 根據自己喜好修改的新e3

## 主要修改點如下
- 登入頁面樣式修改
    - `dist/login.css`
    - 登入表單置中
    - 減少Hardcode數值的數量
- Loading畫面移除
    - `src/hide_loading.ts`
    - 在Render過程中就將國防布移除，連短暫的全白畫面也不太會出現
- 首頁重新設計
    - `dist/index.css` `src/index.ts`
    - 本來放大頭貼的位置改放課程列表，並依照語言顯示較短的課程名稱
    - 本來放課程列表的放公告，點擊公告跳出彈出視窗顯示詳細內容
    - 將最下方「我的課程」部分隱藏，點擊按鈕可以顯示回來
    - 行事曆按上/下個月時不再重新載入整個網頁
- 重導向成員頁面
    - `src/background.ts`
    - 點擊成員頁面的時候本來會先載入`/local/courseextension/user.php`再到`/local/courseextension/user.php`，導致瀏覽器會顯示全白畫面
    - 修改為直接進入`/local/courseextension/user.php`
- 未登入轉址
    - `src/background.ts`
    - 原來未登入時進入未授權頁面A流程為: A -> 登入畫面 -> 登入 -> 首頁 -> ???
    - 修改為: A -> 登入畫面 -> 登入 -> A

## Develop
```
git clone https://github.com/Summon528/NCTU-Newe3-Savior  
yarn install

yarn watch // development
or
yarn build // production
```
