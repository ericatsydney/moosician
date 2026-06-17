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

function initWidgetCarousel() {
  const workspace = document.querySelector('.workspace-grid');
  if (!workspace) return;

  const breakpoint = window.matchMedia('(max-width: 760px)');
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  const threshold = 8;

  const snapToClosest = () => {
    const cards = Array.from(workspace.querySelectorAll('.widget-card'));
    if (!cards.length) return;

    const scrollLeft = workspace.scrollLeft;
    const closest = cards.reduce((best, card) => {
      const distance = Math.abs(card.offsetLeft - scrollLeft);
      return distance < best.distance ? { card, distance } : best;
    }, { card: cards[0], distance: Infinity });

    closest.card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const onPointerDown = (event) => {
    if (!breakpoint.matches) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    isDragging = true;
    moved = false;
    startX = event.clientX;
    startScroll = workspace.scrollLeft;
    workspace.setPointerCapture(event.pointerId);
    workspace.classList.add('dragging');
  };

  const onPointerMove = (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - startX;
    if (Math.abs(deltaX) > threshold) {
      moved = true;
      event.preventDefault();
      workspace.scrollLeft = startScroll - deltaX;
    }
  };

  const onPointerUp = (event) => {
    if (!isDragging) return;
    isDragging = false;
    workspace.releasePointerCapture(event.pointerId);
    workspace.classList.remove('dragging');
    if (moved) snapToClosest();
  };

  workspace.addEventListener('pointerdown', onPointerDown, { passive: false });
  workspace.addEventListener('pointermove', onPointerMove, { passive: false });
  workspace.addEventListener('pointerup', onPointerUp);
  workspace.addEventListener('pointercancel', onPointerUp);

  window.addEventListener('resize', () => {
    if (!breakpoint.matches) {
      workspace.scrollLeft = 0;
    }
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
  initWidgetCarousel();
}

boot().catch((error) => {
  document.body.innerHTML = `<main class="load-error"><h1>Page failed to load</h1><p>${error.message}</p></main>`;
});
