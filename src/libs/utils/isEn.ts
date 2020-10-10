const headerTw = document.querySelector('.header-tw');
let isEn = false;
if (headerTw !== null) {
  isEn = headerTw.classList.contains('semi-transparent');
}

export default isEn;
