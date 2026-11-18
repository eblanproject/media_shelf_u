// В Node 25+ есть свой (экспериментальный) localStorage, он перекрывает jsdom — возвращаем хранилище jsdom.
type JsdomGlobal = { jsdom?: { window: { localStorage: Storage; sessionStorage: Storage } } };

const dom = (globalThis as unknown as JsdomGlobal).jsdom;
if (dom) {
  for (const key of ["localStorage", "sessionStorage"] as const) {
    Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true, writable: true });
  }
}
