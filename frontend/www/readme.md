# Frontend Web Application

This is the frontend web application conforming the the [three design principles](https://redux.js.org/understanding/thinking-in-redux/three-principles). Using an Observable for the store, custom elements and shadow DOM to implement a simple display of a table with data fetched from a backend using rest api.

For details see the following parts:
- [Single Source of Truth](./src/model/store.ts)
- [Read only state](src/model/store.ts)
- [State change with pure functions](./src/user-service.ts)


The following technologies are used[^learning]: 

- [immer.js](https://immerjs.github.io/immer/)
- [Reactive Extensions](https://rxjs.dev/guide/overview) (RxJS)
- [Typescript](https://www.typescriptlang.org/)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [webpack](https://webpack.js.org/guides/getting-started/)
- [Javascript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [nodejs](https://nodejs.org/)


for a visualization of rxjs also see [RxMarbles](https://rxmarbles.com/)

[^learning]: In parts this technology stack builds one on the other. For learning I recommend to study the things from the bottom up. As a precondition a good understanding of linux and javascript and a development environment is required.

## Note about the document base url

When deploying to a subfolder of the www root folder you need a *base href=".."* tag so that all links load from the correct location. This is inserted by a script in [index.html](index.html).