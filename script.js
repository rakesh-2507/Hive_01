// =======================
// Redirect index.html → home.html
// =======================
if (
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("index.html")
) {
  window.location.replace("home.html");
}

// =======================
// Side Menu & Overlay
// =======================
const menuButtons = document.querySelectorAll(".menu-btn, #menuToggle");
const overlay = document.getElementById("overlay");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

// Open side menu
menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    overlay.style.width = "100%";
    sideMenu.style.left = "0";
  });
});

// Close side menu
closeMenu.addEventListener("click", () => {
  overlay.style.width = "0";
  sideMenu.style.left = "-300px";
});

// Close side menu by clicking outside
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.width = "0";
    sideMenu.style.left = "-300px";
  }
});

// Toggle submenus in side menu
document.querySelectorAll(".side-menu .menu-item .arrow").forEach((arrow) => {
  arrow.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const submenu = arrow.parentElement.querySelector(".side-submenu");
    if (submenu) {
      submenu.style.display =
        submenu.style.display === "flex" ? "none" : "flex";
    }
  });
});

// =======================
// Header Dropdowns
// =======================
const headerItems = document.querySelectorAll(".header-bottom .menu-item");
const dropdownContainer = document.getElementById("dropdownContainer");
const dropdownContents = document.querySelectorAll(".header-dropdown-content");
let hideTimeout;

headerItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);

    const dropdownId = item.getAttribute("data-dropdown");

    // Hide all dropdowns first
    dropdownContents.forEach((dc) => (dc.style.display = "none"));

    // Show the correct dropdown
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.style.display = "flex";
      dropdownContainer.style.display = "block";
    }
  });
});

dropdownContainer.addEventListener("mouseleave", () => {
  hideTimeout = setTimeout(() => {
    dropdownContainer.style.display = "none";
    dropdownContents.forEach((dc) => (dc.style.display = "none"));
  }, 200);
});

// =======================
// Helper Functions
// =======================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatSubmenu(hash) {
  return hash.replace("#", "").replace(/submenu(\d+)/i, "Submenu $1");
}

// =======================
// Breadcrumb & Active Links
// =======================
const sections = document.querySelectorAll("section");

function updateBreadcrumbAndActive() {
  const breadcrumb = document.querySelector("#breadcrumb-bar .breadcrumb");
  if (!breadcrumb) return;

  // Normalize current path
  let currentPath = window.location.pathname.split("/").pop() || "home.html";
  if (currentPath === "index.html") currentPath = "home.html";

  breadcrumb.innerHTML = "";

  // Page breadcrumb
  const pageItem = document.createElement("li");
  pageItem.classList.add("breadcrumb-item");
  pageItem.innerHTML = `<a href="${currentPath}">${capitalize(
    currentPath.replace(".html", "")
  )}</a>`;
  breadcrumb.appendChild(pageItem);

  // Determine visible section
  let visibleSection = null;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      visibleSection = section;
    }
  });

  if (visibleSection) {
    const subItem = document.createElement("li");
    subItem.classList.add("breadcrumb-item", "active");
    subItem.textContent = formatSubmenu("#" + visibleSection.id);
    breadcrumb.appendChild(subItem);
  }

  // Update all active links
  const allLinks = document.querySelectorAll(
    ".header-bottom .menu-item>a, .header-dropdown-content a, .side-menu .menu-item>a, .side-submenu a, .sticky-center a"
  );

  const currentHash = visibleSection ? "#" + visibleSection.id : "";

  allLinks.forEach((link) => {
    link.classList.remove("active");
    const [linkPath, linkHash] = link.getAttribute("href").split("#");

    if (linkPath === currentPath) {
      // if link has hash, match with current hash
      if (!linkHash || linkHash === currentHash.replace("#", "")) {
        link.classList.add("active");
      }
    }
  });
}

// =======================
// Sticky Header
// =======================
const stickyHeader = document.getElementById("stickyHeader");
window.addEventListener("scroll", () => {
  stickyHeader.style.top = window.scrollY > 50 ? "0px" : "-60px";
});

// =======================
// Event Listeners
// =======================
window.addEventListener("load", updateBreadcrumbAndActive);
window.addEventListener("scroll", updateBreadcrumbAndActive);
window.addEventListener("hashchange", updateBreadcrumbAndActive);
