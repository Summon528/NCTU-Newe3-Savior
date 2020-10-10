function setUpAJAXCal(): void {
  const next: HTMLAnchorElement | null = document.querySelector('.arrow_link.next');
  const prev: HTMLAnchorElement | null = document.querySelector('.arrow_link.previous');
  [prev, next].filter((el) => el !== null).forEach((el) => el!.addEventListener('click', fetchCal));
}

let calController: AbortController | undefined;
function fetchCal(e: MouseEvent) {
  const cal: HTMLDivElement | null = document.querySelector('#layer2_right_cal');
  if (cal === null) {
    return;
  }
  if (calController) {
    calController.abort();
  }
  e.preventDefault();
  const targetEl = e.currentTarget as HTMLAnchorElement;
  calController = new AbortController();
  fetch(targetEl.href, { signal: calController.signal }).then((res) => {
    if (res.redirected) {
      window.location.replace(res.url);
      return;
    }
    res.text().then((data) => {
      const dataEl = new DOMParser().parseFromString(data, 'text/html');
      const newCal: HTMLDivElement | null = dataEl.querySelector('#layer2_right_cal');
      if (newCal != null) {
        newCal.style.display = 'block';
        cal.replaceWith(newCal);
        setUpAJAXCal();
      }
    });
  });
}

export { setUpAJAXCal };
