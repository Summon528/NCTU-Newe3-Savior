const isEN = document.getElementsByClassName("header-en")[0].classList.contains("semi-transparent");

function clearCourseName(name: string | null) {
    if (name === null) { return ""; }
    const regex = /.*】\d*([^ ]*)(.*)/;
    const match = regex.exec(name);
    if (match === null || match.length < 3) {
        return name;
    }
    if (isEN) {
        return match[1].trim();
    } else {
        return match[2].trim();
    }
}

function fetchAnn() {
    fetch("https://e3new.nctu.edu.tw/theme/dcpc/news/index.php").then((res) => {
        res.text().then((data) => {
            const dataEl = document.createElement("html");
            dataEl.innerHTML = data;
            parseAnn(dataEl);
        });
    });
}

function parseAnn(data: HTMLElement) {
    const news = data.querySelectorAll(".NewsRow > .News-passive, .News-active");
    document.getElementById("layer2_right_current_course_stu")!.innerHTML = "";

    const container = document.createElement("table");
    container.className = "e3ext-ann-contanier";

    document.getElementById("layer2_right_current_course_stu")!.appendChild(container);
    news.forEach((el) => {
        // const linkRegex = /location\.href='(.*)';/;
        // const link = linkRegex.exec(el.getAttribute("onClick")!)![1];

        const courseEl = el.getElementsByClassName("colL-10")[0];
        let course = courseEl.getAttribute("title") === "" ?
            courseEl.textContent : courseEl.getAttribute("title");
        course = clearCourseName(course);

        const titleEl = el.getElementsByClassName("colL-19")[0];
        const title = titleEl.getAttribute("title") === "" ?
            titleEl.textContent : titleEl.getAttribute("title");

        const date = el.getElementsByClassName("colR-10")[0].textContent;

        const tr = document.createElement("tr");
        [course, title, date].forEach((info) => {
            const td = document.createElement("td");
            td.textContent = info;
            tr.appendChild(td);
        });
        container.appendChild(tr);
    });
}

fetchAnn();

document.querySelectorAll("#layer2_right_current_course_stu > \
    .layer2_right_current_course_stu_link > a").forEach((node) => {
    node.textContent = clearCourseName(node.textContent);
});

document.getElementsByClassName("layer2_left")[0].innerHTML =
    document.getElementById("layer2_right_current_course_stu")!.innerHTML;
