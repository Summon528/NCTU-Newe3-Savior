import clearCourseName from './utils/clearCourseName';

function swapCourseListPos(): void {
  const buttons = document.querySelectorAll('.btn2018_sp');

  const ulEl = document.createElement('ul');
  ulEl.className = 'e3ext-course-list-ul';
  document
    .querySelectorAll(
      '#layer2_right_current_course_stu > \
      .layer2_right_current_course_stu_link > a',
    )
    .forEach((node) => {
      const liEl = document.createElement('li');
      node.textContent = clearCourseName(node.textContent);
      liEl.appendChild(node);
      ulEl.appendChild(liEl);
    });

  const captionEl = document.querySelector(
    '#layer2_right_current_course_stu > .layer2_left_caption',
  );

  const leftLayerEl = document.querySelector('.layer2_left');
  const rightLayerEl = document.getElementById('layer2_right_current_course_stu');

  if (leftLayerEl === null || rightLayerEl === null) {
    console.error('.layer2_left or #layer2_right_current_course_stu is null');
    return;
  }

  leftLayerEl.innerHTML = '';
  if (captionEl !== null) {
    leftLayerEl.appendChild(captionEl);
  }
  leftLayerEl.appendChild(ulEl);

  const superContainer = document.createElement('div');
  const container = document.createElement('div');
  container.className = 'e3ext-buttons-contanier';
  superContainer.appendChild(container);
  leftLayerEl.appendChild(superContainer);

  buttons.forEach((button) => {
    const newBtn = button.cloneNode(true) as HTMLDivElement;
    const btnCaptionEl = newBtn.querySelector('.btn2018_sp_caption');
    if (btnCaptionEl === null || btnCaptionEl.textContent === null) {
      console.error('.btn2018_sp_caption is null');
      return;
    }
    if (btnCaptionEl.textContent.replace(/\s/g, '') === '當期課程') {
      btnCaptionEl.textContent = '公告';
    }
    container.appendChild(newBtn);
  });
}

export { swapCourseListPos };
