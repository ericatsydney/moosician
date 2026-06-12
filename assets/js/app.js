async function loadComponent(target) {
  const source = target.dataset.component;
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`Unable to load component: ${source}`);
  }
  const html = await response.text();
  target.innerHTML = html;

  // Resolve nested component paths relative to the current component source.
  // This allows components inside components to use local relative paths.
  const baseUrl = new URL(source, document.baseURI);
  target.querySelectorAll('[data-component]').forEach((child) => {
    const nested = child.dataset.component;
    if (!nested) return;
    if (/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(nested)) return;
    child.dataset.component = new URL(nested, baseUrl).href;
  });
}

async function boot() {
  // Load all components breadth-first until none remain
  let found = [...document.querySelectorAll("[data-component]")];
  while (found.length) {
    await Promise.all(found.map(loadComponent));
    // After loading, check if any new components appeared
    found = [...document.querySelectorAll("[data-component]")].filter(
      el => el.children.length === 0 && el.innerHTML.trim() === ""
    );
  }
  document.body.dataset.ready = "true";
}

boot().catch((error) => {
  document.body.innerHTML = `<main class="load-error"><h1>Page failed to load</h1><p>${error.message}</p></main>`;
});
