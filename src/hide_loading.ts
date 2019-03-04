const divProgress = document.getElementById("divProgress");
if (divProgress) { divProgress.style.display = "none"; }
const divMaskFrame = document.getElementById("divMaskFrame");
if (divMaskFrame) { divMaskFrame.style.display = "none"; }
const pageWrapper = document.getElementById("page-wrapper");
if (pageWrapper) {
    pageWrapper.style.visibility = "visible";
    pageWrapper.style.display = "block";
}
const pageFooter = document.getElementById("page-footer");
if (pageFooter) {
    pageFooter.style.display = "block";
}
