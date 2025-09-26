// Select all menu buttons (both top header & sticky)
const menuButtons = document.querySelectorAll(".menu-btn, #menuToggle");
const overlay = document.getElementById("overlay");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

// Open side menu when any button is clicked
menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    overlay.style.width = "100%";
    sideMenu.style.left = "0";
  });
});

// Close side menu via X button
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

// Toggle submenus
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
// Header dropdown handling
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

    // Show this dropdown and use flex
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = "flex";
    dropdownContainer.style.display = "block";
  });
});

dropdownContainer.addEventListener("mouseleave", () => {
  hideTimeout = setTimeout(() => {
    dropdownContainer.style.display = "none";
    dropdownContents.forEach((dc) => (dc.style.display = "none"));
  }, 200);
});

// Helper functions
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function formatSubmenu(hash) {
  return hash.replace("#", "").replace(/submenu(\d+)/i, "Submenu $1");
}

// Highlight active links and breadcrumb on scroll
const sections = document.querySelectorAll("section");
function updateBreadcrumbOnScroll() {
  const breadcrumb = document.querySelector("#breadcrumb-bar .breadcrumb");
  const currentPath = window.location.pathname.split("/").pop();
  breadcrumb.innerHTML = "";

  // Page breadcrumb
  if (currentPath) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("breadcrumb-item");
    pageItem.innerHTML = `<a href="${currentPath}">${capitalize(
      currentPath.replace(".html", "")
    )}</a>`;
    breadcrumb.appendChild(pageItem);
  }

  // Determine visible section
  let visibleSection = null;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    ) {
      visibleSection = section;
    }
  });

  // Update breadcrumb and active links
  const links = document.querySelectorAll(
    ".header-bottom .menu-item>a, .header-dropdown-content a, .side-menu .menu-item>a, .side-submenu a, .sticky-center a"
  );

  links.forEach((link) => link.classList.remove("active"));

  if (visibleSection) {
    const subItem = document.createElement("li");
    subItem.classList.add("breadcrumb-item", "active");
    subItem.textContent = formatSubmenu("#" + visibleSection.id);
    breadcrumb.appendChild(subItem);

    links.forEach((link) => {
      const linkHref = link.getAttribute("href");
      if (!linkHref) return;

      // Activate section link
      if (linkHref.includes("#" + visibleSection.id)) {
        link.classList.add("active");
      }

      // Activate page link
      if (linkHref === currentPath) {
        link.classList.add("active");
      }
    });
  } else {
    // If no section is visible, highlight only the page
    links.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      }
    });
  }
}
// Initial run and event listeners
window.addEventListener("load", updateBreadcrumbOnScroll);
window.addEventListener("scroll", updateBreadcrumbOnScroll);
window.addEventListener("hashchange", updateBreadcrumbOnScroll);

const stickyHeader = document.getElementById("stickyHeader");
window.addEventListener("scroll", () => {
  stickyHeader.style.top = window.scrollY > 50 ? "0px" : "-60px";
});

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const page = path.split("/").pop();

  const links = document.querySelectorAll(".sticky-center a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === page) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

