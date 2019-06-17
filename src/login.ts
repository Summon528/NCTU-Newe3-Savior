const loginBtnEl = document.querySelector(".show-desktop #loginBtn") as HTMLElement | null;

if (loginBtnEl !== null) {
    loginBtnEl.addEventListener("click", () => {
        const inputEl = document.querySelector(".show-desktop input[name='captcha_code']") as HTMLInputElement | null;
        if (inputEl !== null && inputEl.value === "") {
            inputEl.name = "";
        }
    });
}
