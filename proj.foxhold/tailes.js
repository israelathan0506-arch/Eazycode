(function () {
  const app = document.getElementById("app");
  const loader = document.getElementById("loader");
  const grid = document.getElementById("grid");
  const listingsSection = document.getElementById("listings");
  const filters = document.getElementById("filters");
  const qInput = document.getElementById("q");
  const filterSelect = document.getElementById("filterType");
  const searchBtn = document.getElementById("searchBtn");
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const header = document.querySelector(".site-header");
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalLocation = document.getElementById("modalLocation");
  const modalPrice = document.getElementById("modalPrice");
  const modalDesc = document.getElementById("modalDesc");
  const modalClose = document.getElementById("modalClose");
  const prevImg = document.getElementById("prevImg");
  const nextImg = document.getElementById("nextImg");

  const properties = [
    {
      id: "p1",
      title: "Cozy Family House",
      city: "Lekki, Lagos",
      type: "house",
      price: 485000000,
      images: [
        "https://static.vecteezy.com/system/resources/previews/023/309/311/non_2x/ai-generative-exterior-of-modern-luxury-house-with-garden-and-beautiful-sky-photo.jpg",
        "https://nsnbc.me/wp-content/uploads/2019/03/Best-Furniture-Brands-in-the-World-2017.jpg",
        "https://cdn11.bigcommerce.com/s-0esxpuxvq8/content/210225bistrosets.jpg",
        "https://www.architectandinteriorsindia.com/cloud/2023/10/05/wDoZwRgo-9.Master-Bedroom-Toilet-_-Dressing-1200x900.jpg",
        "https://thumbs.dreamstime.com/b/real-estate-house-room-bath-bed-luxury-decoration-furniture-structure-clean-home-interior-design-real-293473575.jpg"
      ],
      beds: 3,
      baths: 2,
      desc: "Beautiful family home with a sunny backyard and modern finishes."
    },
    {
      id: "p2",
      title: "Modern Apartment",
      city: "Ikoyi, Lagos",
      type: "apartment",
      price: 185000000,
      images: [
        "https://as2.ftcdn.net/v2/jpg/08/48/74/13/1000_F_848741315_SvwDSe3oxTs8leYAWgaufdoCgPK4TD9x.jpg",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80&auto=format&fit=crop"
      ],
      beds: 2,
      baths: 1,
      desc: "Sleek apartment in the heart of the city with skyline views."
    },
    {
      id: "p3",
      title: "Oceanview Condo",
      city: "Victoria Island, Lagos",
      type: "condo",
      price: 310000000,
      images: [
        "https://images.condoblackbook.com/mls-units/373695406/01_th.jpg",
        "https://ez-checkin.com/wp-content/uploads/listings/las-olas-grand-410/las-olas-oceanfront-condo-410-30.jpg"
      ],
      beds: 4,
      baths: 3,
      desc: "Luxury condo with direct ocean views and premium amenities."
    }
  ];

  let activeList = properties.slice();
  let currentType = "all";
  let currentModalIndex = 0;

  const priceFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  });

  function formatPrice(value) {
    return priceFormatter.format(value);
  }

  function syncActiveChip(type) {
    [...filters.querySelectorAll(".chip")].forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.type === type);
    });
  }

  function render(gridList) {
    grid.innerHTML = "";
    if (!gridList.length) {
      grid.innerHTML = '<p style="color:var(--muted)">No listings found.</p>';
      return;
    }

    gridList.forEach((property) => {
      const previewImage = property.images.find(Boolean) || "";
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="img"><img src="${previewImage}" alt="${property.title}" loading="lazy"></div>
        <div class="body">
          <h4>${property.title}</h4>
          <div class="meta"><div>${property.city} - ${property.beds} bd - ${property.baths} ba</div><div class="price">${formatPrice(property.price)}</div></div>
        </div>`;

      card.addEventListener("click", () => openModal(property));
      grid.appendChild(card);
      io.observe(card);
    });
  }

  function applyFilters({ q = "", type = "all" }) {
    const query = (q || "").toLowerCase().trim();
    const filtered = properties.filter((property) => {
      const matchesQ =
        !query ||
        property.title.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query);
      const matchesType = type === "all" || property.type === type;
      return matchesQ && matchesType;
    });

    activeList = filtered;
    render(filtered);
  }

  function runSearch(options = {}) {
    const shouldScroll = Boolean(options.scroll);
    applyFilters({ q: qInput.value, type: currentType });

    if (shouldScroll) {
      listingsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  filters.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;

    currentType = chip.dataset.type || "all";
    filterSelect.value = currentType;
    syncActiveChip(currentType);
    runSearch();
  });

  filterSelect.addEventListener("change", () => {
    currentType = filterSelect.value || "all";
    syncActiveChip(currentType);
    runSearch();
  });

  searchBtn.addEventListener("click", () => runSearch({ scroll: true }));

  qInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      runSearch({ scroll: true });
    }
  });

  function setNavOpen(nextState) {
    if (!header || !navToggle) return;
    header.classList.toggle("nav-open", nextState);
    navToggle.setAttribute("aria-expanded", String(nextState));
  }

  if (navToggle && siteNav && header) {
    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.contains("nav-open");
      setNavOpen(!isOpen);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) setNavOpen(false);
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "Escape") setNavOpen(false);
    });
  }

  function openModal(property) {
    const images = property.images.filter(Boolean);
    if (!images.length) return;

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalTitle.textContent = property.title;
    modalLocation.textContent = `${property.city}, Nigeria - ${property.type}`;
    modalPrice.textContent = formatPrice(property.price);
    modalDesc.textContent = property.desc;

    currentModalIndex = 0;
    const newSrc = images[currentModalIndex];
    modalImage.src = newSrc;
    modalImage.dataset.currentSrc = newSrc;
    modalImage.style.opacity = "1";
    modal.dataset.images = JSON.stringify(images);
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
  }

  modalClose.addEventListener("click", closeModal);
  modal.querySelector(".modal-backdrop").addEventListener("click", closeModal);

  prevImg.addEventListener("click", () => {
    const images = JSON.parse(modal.dataset.images || "[]");
    if (!images.length) return;
    currentModalIndex = (currentModalIndex - 1 + images.length) % images.length;
    updateGalleryImage(images[currentModalIndex]);
  });

  nextImg.addEventListener("click", () => {
    const images = JSON.parse(modal.dataset.images || "[]");
    if (!images.length) return;
    currentModalIndex = (currentModalIndex + 1) % images.length;
    updateGalleryImage(images[currentModalIndex]);
  });

  function init() {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.transition = "opacity .5s";
      setTimeout(() => {
        loader.style.display = "none";
        app.classList.remove("hidden");
      }, 520);
      render(properties);
      syncActiveChip(currentType);
    }, 900);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const cardIdx = Array.from(grid.children).indexOf(entry.target);
        const staggerDelay = Math.min(cardIdx * 0.1, 0.6);
        entry.target.style.animationDelay = `${staggerDelay}s`;
        entry.target.classList.add("reveal-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  function updateGalleryImage(newSrc) {
    if (modalImage.dataset.currentSrc === newSrc) return;
    modalImage.style.opacity = "0";
    setTimeout(() => {
      modalImage.src = newSrc;
      modalImage.dataset.currentSrc = newSrc;
      modalImage.style.opacity = "1";
    }, 150);
  }

  init();
})();
