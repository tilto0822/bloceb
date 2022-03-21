# bloceb

Make Web with Block Coding!

## 소개

-   bloceb은 블록코딩으로 웹을 만들면 어떨까? 하는 생각에 시작한 프로젝트입니다.
-   포트폴리오용으로 제작된 프로젝트로서, 개선 계획은 갖고 있지 않습니다.
-   아직 모든 기능이 구현되지 않았으나, 핵심 기능들은 시연이 가능합니다.
-   추가로, DB를 교체하며 무언가 잘못됐는지 에디터의 미리보기에서 헤더가 깨집니다. 참고해주세요

### 기술 스택

-   node.js + koa
-   typescript
-   [prisma](https://prisma.io)
-   [blockly](https://developers.google.com/blockly)

### 실행 방법

1. npm 패키지 의존성을 설치합니다.

```shell
npm install -D
```

2. `.env` 파일을 작성합니다. (`.env.sample` 을 참고하세요)
3. `npm run test` 를 입력해 실행하면 됩니다. 기본 웹 포트는 80입니다.
