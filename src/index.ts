import linkifyElement from "linkifyjs/element";
import MicroModal from "micromodal";
import moment, { Moment } from "moment";

const headerTw = document.querySelector(".header-tw");
let isEN = false;
if (headerTw !== null) {
    isEN = headerTw.classList.contains("semi-transparent");
}

const body = document.querySelector("body");
body!.innerHTML += `
<div class="modal micromodal-slide" id="e3ext-modal" aria-hidden="true">
<div class="modal__overlay" tabindex="-1" data-micromodal-close>
  <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="e3ext-modal-title">
    <header class="modal__header">
        <h2 class="modal__title" id="e3ext-modal-title"></h2>
        <span class="modal__topright">
            <a href="" id="e3ext-modal-link">${isEN ? "Link" : "連結"}</a>
            <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
        </span>
    </header>
    <div class="e3ext-modal-loading-container" id="e3ext-modal-loading">
        <img class="e3ext-modal-loading-svg" src="${chrome.runtime.getURL("dist/loading.svg")}">
    </div>
    <main class ="modal__content;" id="e3ext-modal-content"></main>
   </div>
 </div>
 </div>
`;

function clearCourseName(name: string | null) {
    if (name === null) { return ""; }
    const regex = /.*】\d*([^ ]*)(.*)/;
    const match = regex.exec(name);
    if (match === null || match.length < 3) {
        return name;
    }
    if (isEN) {
        return match[2].trim();
    } else {
        return match[1].trim();
    }
}

function parseDate(dateStr: string | null) {
    if (dateStr === null) { return moment(); }
    let date = moment(dateStr, "MM月 D日,HH:mm");
    if (!date.isValid()) {
        date = moment(dateStr, "DD MMM, HH:mm");
    }
    if (!date.isValid()) {
        date = moment();
    }
    return date;
}

function fetchNews() {
    const rightLayerEl = document.getElementById("layer2_right_current_course_stu");
    if (rightLayerEl === null) {
        console.error("#layer2_right_current_course_stu is null");
        return;
    }

    rightLayerEl.innerHTML = "";
    const loadingSvgContainer = document.createElement("div");
    loadingSvgContainer.style.height = "100%";
    loadingSvgContainer.id = "e3ext-news-loading-svg-container";
    const loadingSvg = document.createElement("img");
    loadingSvg.src = chrome.runtime.getURL("dist/loading.svg");
    loadingSvg.className = "e3ext-news-loading-svg";
    loadingSvgContainer.appendChild(loadingSvg);
    rightLayerEl.appendChild(loadingSvgContainer);

    fetch("https://e3new.nctu.edu.tw/theme/dcpc/news/index.php").then((res) => {
        res.text().then((data) => {
            const dataEl = new DOMParser().parseFromString(data, "text/html");
            parseNews(dataEl);
        });
    });
}

class News {
    constructor(
        public course: string,
        public title: string,
        public date: Moment,
        public link: string | undefined) { }
}

function parseNews(data: Document) {
    const newsEls = data.querySelectorAll(".NewsRow > .News-passive, .News-active");
    const rightLayerEl = document.getElementById("layer2_right_current_course_stu")!;
    const caption = document.createElement("div");
    caption.textContent = isEN ? "Announcements" : "公告";
    caption.className = "layer2_left_caption";
    rightLayerEl.appendChild(caption);

    const stupidBr = document.querySelector(".layer2_right > br");
    if (stupidBr !== null) {
        stupidBr.remove();
    }

    const contanier = document.createElement("div");
    const table = document.createElement("table");
    contanier.appendChild(table);
    contanier.className = "e3ext-news-contanier";
    table.className = "e3ext-news-table";

    rightLayerEl.appendChild(contanier);
    const importantNews: News[] = [];
    const normalNews: News[] = [];
    newsEls.forEach((el) => {
        const linkRegex = /location\.href='(.*)';/;
        const match = linkRegex.exec(el.getAttribute("onClick") || "");
        let link: string | undefined;
        if (match !== null) {
            link = match[1];
        }
        const courseEl = el.getElementsByClassName("colL-10")[0];
        let course = courseEl.getAttribute("title") === "" ?
            courseEl.textContent : courseEl.getAttribute("title");
        course = clearCourseName(course);

        const titleEl = el.getElementsByClassName("colL-19")[0];
        const title = titleEl.getAttribute("title") === "" ?
            titleEl.textContent : titleEl.getAttribute("title");

        const date = el.getElementsByClassName("colR-10")[0].textContent;

        const tempNews = new News(course, title || "", parseDate(date), link);
        const iconEl: HTMLImageElement | null = el.querySelector("img");
        if (iconEl && iconEl.src === "https://e3new.nctu.edu.tw/theme/dcpc/images/Bell_grey_75x75.png") {
            importantNews.push(tempNews);
        } else {
            normalNews.push(tempNews);
        }

    });

    const guessYear = (news: News[]) => {
        let lastDate = moment();
        for (const n of news) {
            while (n.date.isAfter(lastDate)) {
                n.date.set("year", n.date.get("year") - 1);
            }
            lastDate = n.date;
        }
    };

    guessYear(importantNews);
    guessYear(normalNews);
    const allNews = ([] as News[]).concat(importantNews, normalNews);
    allNews.sort((n1, n2) => n2.date.valueOf() - n1.date.valueOf());
    document.getElementById("e3ext-news-loading-svg-container")!.style.display = "none";
    allNews.forEach((news1) => {
        const { course, title, date, link } = news1;
        const dateStr = date.format("MM/DD HH:mm");
        const tr = document.createElement("tr");
        [course, title, dateStr].forEach((info) => {
            const td = document.createElement("td");
            td.textContent = info;
            tr.appendChild(td);
        });
        if (link) { tr.setAttribute("e3ext-link", link); }
        tr.addEventListener("click", showNewsModal);
        table.appendChild(tr);
    });
}

function showNewsModal(e: MouseEvent) {
    document.getElementById("e3ext-modal-loading")!.style.display = "block";
    document.getElementById("e3ext-modal-content")!.innerHTML = "";
    const targetEl = (e.currentTarget as HTMLTableRowElement);
    const title = targetEl.children[1].textContent;
    const link = targetEl.getAttribute("e3ext-link");
    document.getElementById("e3ext-modal-title")!.textContent = title;
    if (!link) { return; }
    (document.getElementById("e3ext-modal-link") as HTMLAnchorElement)!.href = link;
    const controller = new AbortController();
    const scrollTop = document.scrollingElement ? document.scrollingElement.scrollTop : 0;
    MicroModal.show("e3ext-modal", {
        awaitCloseAnimation: true,
        disableFocus: true,
        onClose: () => {
            document.body.classList.remove("e3ext-no-scroll");
            if (document.scrollingElement) {
                document.scrollingElement.scrollTo(0, scrollTop);
            }
            controller.abort();
        },
    });
    document.body.style.top = `-${scrollTop}px`;
    document.body.classList.add("e3ext-no-scroll");
    fetch(link!, { signal: controller.signal }).then((res) => {
        if (res.redirected) {
            window.location.replace(res.url);
            return;
        }
        res.text().then((data) => {
            document.getElementById("e3ext-modal-loading")!.style.display = "none";
            const dataEl = new DOMParser().parseFromString(data, "text/html");
            const contentEl = dataEl.querySelector(".content") as HTMLElement;
            const optionsEl = dataEl.querySelector(".options");
            const modalContent = document.getElementById("e3ext-modal-content")!;
            if (contentEl) {
                linkifyElement(contentEl);
                modalContent.appendChild(contentEl);
            }
            if (optionsEl) { modalContent.appendChild(optionsEl); }
        });
    });
}

function swapCourseListPos() {
    const buttons = document.querySelectorAll(".btn2018_sp");

    const ulEl = document.createElement("ul");
    ulEl.className = "e3ext-course-list-ul";
    document.querySelectorAll("#layer2_right_current_course_stu > \
    .layer2_right_current_course_stu_link > a").forEach((node) => {
        const liEl = document.createElement("li");
        node.textContent = clearCourseName(node.textContent);
        liEl.appendChild(node);
        ulEl.appendChild(liEl);
    });

    const captionEl = document.querySelector("#layer2_right_current_course_stu > .layer2_left_caption");

    const leftLayerEl = document.querySelector(".layer2_left");
    const rightLayerEl = document.getElementById("layer2_right_current_course_stu");

    if (leftLayerEl === null || rightLayerEl === null) {
        console.error(".layer2_left or #layer2_right_current_course_stu is null");
        return;
    }

    leftLayerEl.innerHTML = "";
    if (captionEl !== null) {
        leftLayerEl.appendChild(captionEl);
    }
    leftLayerEl.appendChild(ulEl);

    const superContainer = document.createElement("div");
    const container = document.createElement("div");
    container.className = "e3ext-buttons-contanier";
    superContainer.appendChild(container);
    leftLayerEl.appendChild(superContainer);

    buttons.forEach((button) => {
        const newBtn = button.cloneNode(true) as HTMLDivElement;
        const btnCaptionEl = newBtn.querySelector(".btn2018_sp_caption");
        if (btnCaptionEl === null || btnCaptionEl.textContent === null) {
            console.error(".btn2018_sp_caption is null");
            return;
        }
        if (btnCaptionEl.textContent.replace(/\s/g, "") === "當期課程") {
            btnCaptionEl.textContent = "公告";
        }
        container.appendChild(newBtn);
    });

}

function setUpAJAXCal() {
    const next: HTMLAnchorElement | null = document.querySelector(".arrow_link.next");
    const prev: HTMLAnchorElement | null = document.querySelector(".arrow_link.previous");
    [prev, next].filter((el) => el !== null).forEach((el) =>
        el!.addEventListener("click", fetchCal),
    );
}

let calController: AbortController | undefined;
function fetchCal(e: MouseEvent) {
    const cal: HTMLDivElement | null = document.querySelector("#layer2_right_cal");
    if (cal === null) { return; }
    if (calController) { calController.abort(); }
    e.preventDefault();
    const targetEl = e.currentTarget as HTMLAnchorElement;
    calController = new AbortController();
    fetch(targetEl.href, { signal: calController.signal }).then((res) => {
        if (res.redirected) {
            window.location.replace(res.url);
            return;
        }
        res.text().then((data) => {
            const dataEl = new DOMParser().parseFromString(data, "text/html");
            const newCal: HTMLDivElement | null = dataEl.querySelector("#layer2_right_cal");
            if (newCal != null) {
                newCal.style.display = "block";
                cal.replaceWith(newCal);
                setUpAJAXCal();
            }
        });
    });
}

function fetchEventStatus() {
    const setEventFinished = (item: Element) => {
        item.classList.add('del');
        const icon = item.querySelector('img.icon');
        icon?.setAttribute('style', 'visibility: hidden');
        item.parentNode?.appendChild(item);
    }

    const setEventUnfinished = (item: Element) => {
        item.classList.remove('del');
        const icon = item.querySelector('img.icon');
        icon?.setAttribute('style', '');
    }

    const makePromises = () => {
        const event_items = document.querySelectorAll("aside[data-block='dcpc_events'] .BarCard > .BarCard-item");
        const promises: Promise<string | null>[] = []; // return string if event is done
        const done_events_cached = JSON.parse(localStorage.getItem('done_events') || '[]');

        event_items.forEach(item => {
            const event_link = item.querySelector('a');
            const event_course = item.querySelector('small');
            const event_name = event_link!.text + event_course!.textContent;

            if (done_events_cached.includes(event_name)) {
                setEventFinished(item);
            }

            promises.push(
                fetch(event_link!.href)
                    .then(async (res) => {
                        return res.text()
                            .then((data) => {
                                const event_details = new DOMParser().parseFromString(data, "text/html");
                                const submit = event_details.getElementsByClassName('submissionstatussubmitted');
                                if (submit.length > 0) {
                                    if (!item.classList.contains('del')) {
                                        setEventFinished(item);
                                    }
                                    return event_name;
                                }
                                else {
                                    setEventUnfinished(item);
                                    return null;
                                }
                            })
                    })
            );
        })
        return promises;
    }

    Promise.all(makePromises())
        .then(responses => {
            const done_events = responses.filter(r => r !== null);
            localStorage.setItem('done_events', JSON.stringify(done_events));
        })
}

swapCourseListPos();
fetchNews();
fetchEventStatus();
setUpAJAXCal();
