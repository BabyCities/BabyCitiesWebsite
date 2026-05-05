window.addEventListener("load", function () {
  const body = document.body;
  const mobileNav = document.querySelector("#mobileNav");
  const showMenuButton = document.querySelector("#showMenu");
  const hideMenuButton = document.querySelector("#hideMenu");
  let lastFocusedElement = null;

  function setMobileNavState(isOpen, options) {
    if (!mobileNav) return;

    const shouldRestoreFocus = !isOpen && (!options || options.restoreFocus !== false);

    mobileNav.classList.toggle("hidden", !isOpen);
    mobileNav.setAttribute("aria-hidden", String(!isOpen));

    if (showMenuButton) {
      showMenuButton.setAttribute("aria-expanded", String(isOpen));
    }

    if (body) {
      body.classList.toggle("mobile-menu-open", isOpen);
    }

    if (isOpen) {
      lastFocusedElement = document.activeElement;

      if (hideMenuButton) {
        hideMenuButton.focus();
      }

      return;
    }

    if (
      shouldRestoreFocus &&
      lastFocusedElement &&
      typeof lastFocusedElement.focus === "function"
    ) {
      lastFocusedElement.focus();
    }

    lastFocusedElement = null;
  }

  if (showMenuButton && mobileNav) {
    showMenuButton.addEventListener("click", function () {
      setMobileNavState(true, { restoreFocus: false });
    });
  }

  if (hideMenuButton && mobileNav) {
    hideMenuButton.addEventListener("click", function () {
      setMobileNavState(false);
    });
  }

  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        setMobileNavState(false, { restoreFocus: false });
      });
    });
  }

  const desktopMediaQuery = window.matchMedia("(min-width: 768px)");
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function closeMobileNavOnDesktop(event) {
    if (event.matches) {
      setMobileNavState(false, { restoreFocus: false });
    }
  }

  if (typeof desktopMediaQuery.addEventListener === "function") {
    desktopMediaQuery.addEventListener("change", closeMobileNavOnDesktop);
  } else if (typeof desktopMediaQuery.addListener === "function") {
    desktopMediaQuery.addListener(closeMobileNavOnDesktop);
  }

  const statsSection = document.querySelector("[data-stats-section]");
  const storyFinder = document.querySelector("[data-story-finder]");
  const storyCount = document.querySelector("[data-story-count]");
  const storyTypePicker = document.querySelector("[data-story-type-picker]");
  const storyTypeMenu = document.querySelector("[data-story-type-menu]");
  const storyTypeLabel = document.querySelector("[data-story-type-label]");
  const storyTypeIcon = document.querySelector("[data-story-type-icon]");
  const storyFilterPicker = document.querySelector("[data-story-filter-picker]");
  const storyFilterMenu = document.querySelector("[data-story-filter-menu]");
  const storyFilterLabel = document.querySelector("[data-story-filter-label]");
  const storyFilterIcon = document.querySelector("[data-story-filter-icon]");

  const DEFAULT_TYPE_OPTION = {
    value: "2",
    label: "restaurants",
    icon: "dist/assetsbis/images/map-markers/points-png/restaurant-icon.png",
    queryLabel: "restaurant",
  };

  const BABY_FILTER_OPTIONS = [
    {
      value: "highchair",
      label: "high chair",
      icon: "dist/assetsbis/images/babyfilters/highchair-red.png",
    },
    {
      value: "stroller",
      label: "stroller access",
      icon: "dist/assetsbis/images/babyfilters/buggy-red.png",
    },
    {
      value: "changing",
      label: "changing table",
      icon: "dist/assetsbis/images/babyfilters/changer-red.png",
    },
    {
      value: "nursing",
      label: "nursing area",
      icon: "dist/assetsbis/images/babyfilters/nursing-red.png",
    },
    {
      value: "microwave",
      label: "microwave",
      icon: "dist/assetsbis/images/babyfilters/microwave-red.png",
    },
    {
      value: "playground_in",
      label: "indoor play",
      icon: "dist/assetsbis/images/babyfilters/playground-red.png",
    },
    {
      value: "playground_out",
      label: "outdoor play",
      icon: "dist/assetsbis/images/babyfilters/swing-red.png",
    },
    {
      value: "",
      label: "any baby filter",
      icon: "dist/assetsbis/images/babyfilters/changer-red.png",
    },
  ];

  const FALLBACK_PLACE_TYPE_OPTIONS = [
    {
      value: "1",
      label: "cafes",
      icon: "dist/assetsbis/images/map-markers/points-png/cafe-bars-icon.png",
      queryLabel: "cafe",
    },
    {
      value: "2",
      label: "restaurants",
      icon: "dist/assetsbis/images/map-markers/points-png/restaurant-icon.png",
      queryLabel: "restaurant",
    },
    {
      value: "4",
      label: "parks",
      icon: "dist/assetsbis/images/map-markers/points-png/park-icon.png",
      queryLabel: "park",
    },
    {
      value: "5",
      label: "beaches",
      icon: "dist/assetsbis/images/map-markers/points-png/beach-icon.png",
      queryLabel: "beach",
    },
    {
      value: "3",
      label: "shops",
      icon: "dist/assetsbis/images/map-markers/points-png/shop-icon.png",
      queryLabel: "shop",
    },
    {
      value: "6",
      label: "museums",
      icon: "dist/assetsbis/images/map-markers/points-png/museum-icon.png",
      queryLabel: "museum",
    },
    {
      value: "8",
      label: "stations",
      icon: "dist/assetsbis/images/map-markers/points-png/train-icon.png",
      queryLabel: "station",
    },
    {
      value: "7",
      label: "airports",
      icon: "dist/assetsbis/images/map-markers/points-png/airport-icon.png",
      queryLabel: "airport",
    },
    {
      value: "9",
      label: "services",
      icon: "dist/assetsbis/images/map-markers/points-png/services-icon.png",
      queryLabel: "service",
    },
    {
      value: "10",
      label: "entertainment",
      icon: "dist/assetsbis/images/map-markers/points-png/divertissement-icon.png",
      queryLabel: "entertainment",
    },
    {
      value: "",
      label: "places",
      icon: "dist/assetsbis/images/map-markers/points-png/favorites-icon.png",
      queryLabel: "",
    },
  ];

  let storyTypeOptions = [DEFAULT_TYPE_OPTION];
  let selectedStoryType = DEFAULT_TYPE_OPTION;
  let selectedStoryFilter =
    BABY_FILTER_OPTIONS.find((option) => option.value === "stroller") ||
    BABY_FILTER_OPTIONS[0];
  let publicStatsRow = null;
  const animatedNumbers = new WeakMap();
  const pendingStats = new Map();
  let statsAnimationReady = false;

  function formatStat(value) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return "-";
    }

    return value.toLocaleString("en-US");
  }

  function parseStatValue(value) {
    if (value === null || value === undefined || value === "") {
      return NaN;
    }

    return Number(value);
  }

  function easeOutQuart(progress) {
    return 1 - Math.pow(1 - progress, 4);
  }

  function setAnimatedValue(element, value) {
    if (!element) return;
    element.textContent = formatStat(value);
    element.dataset.currentValue = String(value);
  }

  function animateNumber(element, nextValue, duration) {
    if (!element) return;

    if (typeof nextValue !== "number" || Number.isNaN(nextValue)) {
      const runningAnimation = animatedNumbers.get(element);
      if (runningAnimation) {
        cancelAnimationFrame(runningAnimation);
        animatedNumbers.delete(element);
      }
      element.textContent = "-";
      delete element.dataset.currentValue;
      return;
    }

    const targetValue = Math.max(0, Math.round(nextValue));
    const previousValue = Number(element.dataset.currentValue);
    const startValue = Number.isFinite(previousValue) ? previousValue : 0;

    const runningAnimation = animatedNumbers.get(element);
    if (runningAnimation) {
      cancelAnimationFrame(runningAnimation);
    }

    if (startValue === targetValue) {
      setAnimatedValue(element, targetValue);
      return;
    }

    if (reducedMotionQuery.matches) {
      setAnimatedValue(element, targetValue);
      animatedNumbers.delete(element);
      return;
    }

    const animationDuration = duration || 1100;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.round(
        startValue + (targetValue - startValue) * easedProgress
      );

      setAnimatedValue(element, currentValue);

      if (progress < 1) {
        const frameId = requestAnimationFrame(step);
        animatedNumbers.set(element, frameId);
      } else {
        setAnimatedValue(element, targetValue);
        animatedNumbers.delete(element);
      }
    }

    const frameId = requestAnimationFrame(step);
    animatedNumbers.set(element, frameId);
  }

  function updateStat(name, value) {
    const element = document.querySelector(`[data-stat-value="${name}"]`);
    if (!element) return;

    if (!statsAnimationReady) {
      pendingStats.set(name, value);
      return;
    }

    animateNumber(element, value, 1250);
  }

  function flushPendingStats() {
    if (statsAnimationReady) return;

    statsAnimationReady = true;
    pendingStats.forEach((value, name) => {
      const element = document.querySelector(`[data-stat-value="${name}"]`);
      if (!element) return;
      animateNumber(element, value, 1250);
    });
    pendingStats.clear();
  }

  function getSupabaseConfig() {
    return window.BABYCITIES_SUPABASE_CONFIG || {};
  }

  function getSupabaseBaseUrl(url) {
    return (url || "").replace(/\/+$/, "");
  }

  function getSupabaseHeaders(anonKey, extraHeaders) {
    return Object.assign(
      {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      extraHeaders || {}
    );
  }

  function normalizeLabel(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function dedupePlaceTypeOptions(options) {
    const deduped = new Map();

    options.forEach((option) => {
      const key = normalizeLabel(option.label);
      if (!key) {
        return;
      }
      const existing = deduped.get(key);
      if (!existing) {
        deduped.set(key, option);
        return;
      }

      if (!existing.value && option.value) {
        deduped.set(key, option);
      }
    });

    return Array.from(deduped.values());
  }

  function findMatchingOption(options, matchers, fallbackOption) {
    const normalizedMatchers = (matchers || []).map(normalizeLabel);

    const matchedOption = options.find((option) => {
      const optionLabel = normalizeLabel(option.label);
      return normalizedMatchers.some(
        (matcher) => optionLabel === matcher || optionLabel.includes(matcher)
      );
    });

    return matchedOption || fallbackOption || options[0];
  }

  function getPublicStoryCounts(stats) {
    if (!stats || typeof stats !== "object") {
      return null;
    }

    const config = getSupabaseConfig();
    const storyCountsField = config.storyCountsField || "story_counts";
    const rawStoryCounts = stats[storyCountsField];

    if (!rawStoryCounts) {
      return null;
    }

    if (typeof rawStoryCounts === "string") {
      try {
        return JSON.parse(rawStoryCounts);
      } catch (error) {
        return null;
      }
    }

    if (typeof rawStoryCounts === "object") {
      return rawStoryCounts;
    }

    return null;
  }

  function getStoryCountFromPublicStats(stats, typeOption, filterOption) {
    const storyCounts = getPublicStoryCounts(stats);
    if (!storyCounts) {
      return NaN;
    }

    const typeKey =
      typeOption && typeOption.value ? String(typeOption.value) : "all";
    const filterKey =
      filterOption && filterOption.value ? filterOption.value : "all";
    const allCounts = storyCounts.all || null;
    const typeCounts = storyCounts[typeKey] || allCounts || null;

    if (!typeCounts || typeof typeCounts !== "object") {
      return NaN;
    }

    const resolvedValue =
      typeCounts[filterKey] ??
      typeCounts.all ??
      (allCounts && (allCounts[filterKey] ?? allCounts.all));

    return parseStatValue(resolvedValue);
  }

  function updateStoryCount(value) {
    if (!storyCount) return;
    animateNumber(storyCount, value, 900);
  }

  function updatePickerDisplay(option, labelElement, iconElement) {
    if (!option) return;
    if (labelElement) labelElement.textContent = option.label;
    if (iconElement) iconElement.src = option.icon;
  }

  function closePicker(picker) {
    if (picker) {
      picker.removeAttribute("open");
    }
  }

  function buildPickerOptions(menu, options, onSelect) {
    if (!menu) return;

    menu.innerHTML = "";

    options.forEach((option) => {
      const button = document.createElement("button");
      const icon = document.createElement("img");
      const label = document.createElement("span");

      button.type = "button";
      button.className = "story-inline-picker-option font-montserrat";
      icon.src = option.icon;
      icon.alt = "";
      label.textContent = option.label;

      button.append(icon, label);
      button.addEventListener("click", function () {
        onSelect(option);
      });

      menu.appendChild(button);
    });
  }

  function onStoryFilterSelect(option) {
    selectedStoryFilter = option;
    updatePickerDisplay(option, storyFilterLabel, storyFilterIcon);
    closePicker(storyFilterPicker);
    loadStoryCount();
  }

  function onStoryTypeSelect(option) {
    selectedStoryType = option;
    updatePickerDisplay(option, storyTypeLabel, storyTypeIcon);
    closePicker(storyTypePicker);
    loadStoryCount();
  }

  function renderStoryFilterOptions() {
    if (!storyFilterMenu) return;
    buildPickerOptions(storyFilterMenu, BABY_FILTER_OPTIONS, onStoryFilterSelect);
    updatePickerDisplay(selectedStoryFilter, storyFilterLabel, storyFilterIcon);
  }

  function renderStoryTypeOptions() {
    if (!storyTypeMenu) return;
    buildPickerOptions(storyTypeMenu, storyTypeOptions, onStoryTypeSelect);
    updatePickerDisplay(selectedStoryType, storyTypeLabel, storyTypeIcon);
  }

  async function loadSupabaseStats() {
    if (!statsSection) return;

    const config = getSupabaseConfig();
    const url = config.url || "";
    const anonKey = config.anonKey || "";
    const view = config.view || "public_stats";
    const placesField = config.placesField || "places_count";
    const countriesField = config.countriesField || "countries_count";
    const usersField = config.usersField || "users_count";

    if (!url || !anonKey) {
      return;
    }

    try {
      const endpoint = `${getSupabaseBaseUrl(url)}/rest/v1/${view}?select=*&limit=1`;
      const response = await fetch(endpoint, {
        headers: getSupabaseHeaders(anonKey),
      });

      if (!response.ok) {
        throw new Error(`Supabase stats request failed with ${response.status}`);
      }

      const rows = await response.json();
      const stats = Array.isArray(rows) ? rows[0] : null;

      if (!stats) {
        throw new Error("No stats row returned");
      }

      publicStatsRow = stats;

      updateStat("places", parseStatValue(stats[placesField]));
      updateStat("countries", parseStatValue(stats[countriesField]));
      updateStat("users", parseStatValue(stats[usersField]));
    } catch (error) {
      publicStatsRow = null;
      updateStat("places", NaN);
      updateStat("countries", NaN);
      updateStat("users", NaN);
    }
  }

  function loadPlaceTypes() {
    if (!storyFinder || !storyTypeMenu) return;

    renderStoryFilterOptions();
    storyTypeOptions = dedupePlaceTypeOptions(FALLBACK_PLACE_TYPE_OPTIONS);

    selectedStoryType = findMatchingOption(
      storyTypeOptions,
      ["restaurant", "restaurants", "resto"],
      DEFAULT_TYPE_OPTION
    );
    renderStoryTypeOptions();
  }

  async function loadStoryCount() {
    if (!storyFinder) return;

    updateStoryCount(
      getStoryCountFromPublicStats(
        publicStatsRow,
        selectedStoryType,
        selectedStoryFilter
      )
    );
  }

  document.addEventListener("click", function (event) {
    if (storyTypePicker && !storyTypePicker.contains(event.target)) {
      closePicker(storyTypePicker);
    }

    if (storyFilterPicker && !storyFilterPicker.contains(event.target)) {
      closePicker(storyFilterPicker);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    if (mobileNav && !mobileNav.classList.contains("hidden")) {
      setMobileNavState(false);
    }

    closePicker(storyTypePicker);
    closePicker(storyFilterPicker);
  });

  if (statsSection) {
    if ("IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              flushPendingStats();
              statsObserver.disconnect();
            }
          });
        },
        {
          threshold: 0.35,
        }
      );

      statsObserver.observe(statsSection);
    } else {
      statsAnimationReady = true;
    }
  } else {
    statsAnimationReady = true;
  }

  loadSupabaseStats().then(function () {
    loadPlaceTypes();
    loadStoryCount();
  });
});
