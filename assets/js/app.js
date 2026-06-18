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
  let isInteracting = false;
  let scrollEndTimeout = 0;

  const snapCard = (card) => {
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const snapToClosest = () => {
    const cards = Array.from(workspace.querySelectorAll('.widget-card'));
    if (!cards.length) return;

    const scrollLeft = workspace.scrollLeft;
    const closest = cards.reduce((best, card) => {
      const distance = Math.abs(card.offsetLeft - scrollLeft);
      return distance < best.distance ? { card, distance } : best;
    }, { card: cards[0], distance: Infinity });

    snapCard(closest.card);
  };

  const scheduleSnap = () => {
    clearTimeout(scrollEndTimeout);
    scrollEndTimeout = window.setTimeout(() => {
      if (!isInteracting) snapToClosest();
    }, 120);
  };

  const onInteractionStart = () => {
    if (!breakpoint.matches) return;
    isInteracting = true;
    workspace.classList.add('dragging');
    clearTimeout(scrollEndTimeout);
  };

  const onInteractionEnd = () => {
    if (!breakpoint.matches) return;
    isInteracting = false;
    workspace.classList.remove('dragging');
    scheduleSnap();
  };

  workspace.addEventListener('pointerdown', onInteractionStart);
  workspace.addEventListener('pointerup', onInteractionEnd);
  workspace.addEventListener('pointercancel', onInteractionEnd);
  workspace.addEventListener('touchstart', onInteractionStart, { passive: true });
  workspace.addEventListener('touchend', onInteractionEnd);
  workspace.addEventListener('touchcancel', onInteractionEnd);
  workspace.addEventListener('scroll', scheduleSnap, { passive: true });

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
