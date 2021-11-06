function createProject() {
    showPopup(
        '새 프로젝트 생성',
        `프로젝트 명을 입력하세요 :<br /><input class="project_name"></input>`,
        function (values) {
            hidePopup();
            location.href = `/api/projects/create?title=${values[0]}`;
        }
    );
}
