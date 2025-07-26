import React, { useState, useCallback, useMemo } from "react";
import styles from "../style/Stores.module.css";
import { FiSearch, FiMapPin, FiStar, FiShoppingBag, FiFilter, FiGrid, FiList, FiHeart, FiChevronDown } from "react-icons/fi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

// Mock data for stores and categories
const sampleStores = [
  {
    id: 1,
    name: "فروشگاه الکترونیکی الف",
    description: "بهترین فروشگاه آنلاین برای لوازم الکترونیکی با تخفیف‌های ویژه",
    rating: 4.7,
    location: "تهران، خیابان انقلاب",
    image: "https://via.placeholder.com/300x150?text=Store+A",
    category: "الکترونیک",
    promotion: "۲۰٪ تخفیف",
    reviews: 120,
  },
  {
    id: 2,
    name: "فروشگاه لوازم خانگی ب",
    description: "فروشگاه لوازم خانگی و مبلمان با کیفیت بالا",
    rating: 4.3,
    location: "اصفهان، میدان نقش جهان",
    image: "https://via.placeholder.com/300x150?text=Store+B",
    category: "لوازم خانگی",
    promotion: "۱۵٪ تخفیف",
    reviews: 85,
  },
  {
    id: 3,
    name: "فروشگاه مد و لباس ج",
    description: "جدیدترین مدل‌های لباس و مد روز",
    rating: 4.9,
    location: "شیراز، بازار وکیل",
    image: "https://via.placeholder.com/300x150?text=Store+C",
    category: "مد و لباس",
    promotion: "۳۰٪ تخفیف",
    reviews: 200,
  },
  {
    id: 4,
    name: "فروشگاه مواد غذایی د",
    description: "مواد غذایی ارگانیک و تازه",
    rating: 4.1,
    location: "مشهد، خیابان احمدآباد",
    image: "https://via.placeholder.com/300x150?text=Store+D",
    category: "مواد غذایی",
    promotion: "۱۰٪ تخفیف",
    reviews: 95,
  },
  {
    id: 5,
    name: "فروشگاه لوازم ورزشی ه",
    description: "لوازم ورزشی و تجهیزات تناسب اندام",
    rating: 4.6,
    location: "تبریز، بازار بزرگ",
    image: "https://via.placeholder.com/300x150?text=Store+E",
    category: "ورزشی",
    promotion: "۲۵٪ تخفیف",
    reviews: 150,
  },
  {
    id: 6,
    name: "فروشگاه کتاب و لوازم التحریر و",
    description: "کتاب‌های متنوع و لوازم التحریر با کیفیت",
    rating: 4.4,
    location: "تهران، میدان انقلاب",
    image: "https://via.placeholder.com/300x150?text=Store+F",
    category: "کتاب و لوازم التحریر",
    promotion: "۵٪ تخفیف",
    reviews: 110,
  },
  {
    id: 7,
    name: "فروشگاه لوازم آرایشی ز",
    description: "لوازم آرایشی و بهداشتی اورجینال",
    rating: 4.8,
    location: "کرج، خیابان شهید بهشتی",
    image: "https://via.placeholder.com/300x150?text=Store+G",
    category: "آرایشی و بهداشتی",
    promotion: "۴۰٪ تخفیف",
    reviews: 180,
  },
  {
    id: 8,
    name: "فروشگاه خودرو و لوازم یدکی ح",
    description: "لوازم یدکی خودرو و配件",
    rating: 4.2,
    location: "اهواز، خیابان امام خمینی",
    image: "https://via.placeholder.com/300x150?text=Store+H",
    category: "خودرو",
    promotion: "۱۰٪ تخفیف",
    reviews: 70,
  },
  {
    id: 9,
    name: "فروشگاه اسباب‌بازی ط",
    description: "اسباب‌بازی‌های آموزشی برای کودکان",
    rating: 4.5,
    location: "یزد، میدان امیرچخماق",
    image: "https://via.placeholder.com/300x150?text=Store+I",
    category: "اسباب‌بازی",
    promotion: "۲۰٪ تخفیف",
    reviews: 90,
  },
  {
    id: 10,
    name: "فروشگاه مبلمان ی",
    description: "مبلمان مدرن و کلاسیک",
    rating: 4.0,
    location: "رشت، میدان شهرداری",
    image: "https://via.placeholder.com/300x150?text=Store+J",
    category: "مبلمان",
    promotion: "۱۵٪ تخفیف",
    reviews: 60,
  },
  {
    id: 11,
    name: "فروشگاه دیجیتال ک",
    description: "لوازم دیجیتال و گجت‌های نوین",
    rating: 4.6,
    location: "تهران، میدان ونک",
    image: "https://via.placeholder.com/300x150?text=Store+K",
    category: "الکترونیک",
    promotion: "۲۵٪ تخفیف",
    reviews: 140,
  },
  {
    id: 12,
    name: "فروشگاه لوازم آشپزخانه ل",
    description: "لوازم آشپزخانه با کیفیت بالا",
    rating: 4.4,
    location: "اصفهان، خیابان چهارباغ",
    image: "https://via.placeholder.com/300x150?text=Store+L",
    category: "لوازم خانگی",
    promotion: "۱۰٪ تخفیف",
    reviews: 95,
  },
  {
    id: 13,
    name: "فروشگاه لباس ورزشی م",
    description: "لباس و تجهیزات ورزشی",
    rating: 4.7,
    location: "شیراز، خیابان زند",
    image: "https://via.placeholder.com/300x150?text=Store+M",
    category: "ورزشی",
    promotion: "۳۰٪ تخفیف",
    reviews: 160,
  },
  {
    id: 14,
    name: "فروشگاه کتابخانه ن",
    description: "کتاب‌های ادبی و علمی",
    rating: 4.2,
    location: "مشهد، خیابان دانشگاه",
    image: "https://via.placeholder.com/300x150?text=Store+N",
    category: "کتاب و لوازم التحریر",
    promotion: "۵٪ تخفیف",
    reviews: 80,
  },
  {
    id: 15,
    name: "فروشگاه لوازم بهداشتی س",
    description: "محصولات بهداشتی و مراقبتی",
    rating: 4.8,
    location: "تبریز، خیابان امام",
    image: "https://via.placeholder.com/300x150?text=Store+O",
    category: "آرایشی و بهداشتی",
    promotion: "۳۵٪ تخفیف",
    reviews: 200,
  },
];

const categories = [
  "همه",
  "الکترونیک",
  "لوازم خانگی",
  "مد و لباس",
  "مواد غذایی",
  "ورزشی",
  "کتاب و لوازم التحریر",
  "آرایشی و بهداشتی",
  "خودرو",
  "اسباب‌بازی",
  "مبلمان",
];

// Reusable Components
const SearchBar = ({ onSearch }) => (
  <div className={styles["search-bar"]}>
    <input
      type="text"
      placeholder="جستجوی فروشگاه، محصول یا مکان..."
      onChange={(e) => onSearch(e.target.value)}
      className={styles["search-input"]}
    />
    <FiSearch className={styles["search-icon"]} />
  </div>
);

const Filters = ({
  selectedCategory,
  onCategoryChange,
  minRating,
  onRatingChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showPromotedOnly,
  onShowPromotedChange,
}) => (
  <div className={styles["filter-controls"]}>
    <div className={styles["category-dropdown"]}>
      <FiFilter className={styles["filter-icon"]} />
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={styles["dropdown-select"]}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <FiChevronDown className={styles["dropdown-arrow"]} />
    </div>

    <div className={styles["rating-filter"]}>
      <label>حداقل امتیاز:</label>
      <input
        type="range"
        min="0"
        max="5"
        step="0.1"
        value={minRating}
        onChange={(e) => onRatingChange(parseFloat(e.target.value))}
        className={styles["rating-slider"]}
      />
      <span>{minRating.toFixed(1)}</span>
    </div>

    <div className={styles["sort-dropdown"]}>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className={styles["dropdown-select"]}
      >
        <option value="rating-desc">امتیاز descending</option>
        <option value="rating-asc">امتیاز ascending</option>
        <option value="name-asc">نام A-Z</option>
        <option value="name-desc">نام Z-A</option>
      </select>
      <FiChevronDown className={styles["dropdown-arrow"]} />
    </div>

    <div className={styles["promotion-filter"]}>
      <label>نمایش فقط با تخفیف</label>
      <input
        type="checkbox"
        checked={showPromotedOnly}
        onChange={(e) => onShowPromotedChange(e.target.checked)}
      />
    </div>

    <div className={styles["view-toggle"]}>
      <button
        onClick={() => onViewModeChange("list")}
        className={`${styles["view-btn"]} ${viewMode === "list" ? styles.active : ""}`}
      >
        <FiList />
      </button>
      <button
        onClick={() => onViewModeChange("grid")}
        className={`${styles["view-btn"]} ${viewMode === "grid" ? styles.active : ""}`}
      >
        <FiGrid />
      </button>
    </div>
  </div>
);

const RenderStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <span className={styles["star-rating"]}>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} color="#FFD700" />
      ))}
      {hasHalf && <FaStarHalfAlt color="#FFD700" />}
    </span>
  );
};

const FeaturedStores = ({ stores }) => (
  <div className={styles["featured-section"]}>
    <h2 className={styles["section-title"]}>فروشگاه‌های ویژه</h2>
    <div className={styles["featured-carousel"]}>
      {stores.map((store) => (
        <div key={store.id} className={styles["featured-card"]}>
          <img
            src={store.image}
            alt={store.name}
            className={styles["featured-image"]}
            loading="lazy"
          />
          <div className={styles["featured-overlay"]}>
            <h3>{store.name}</h3>
            <p>{store.promotion}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StoreList = ({ stores, viewMode, favorites, onFavoriteToggle, onStoreSelect }) => (
  <div className={`${styles["store-list"]} ${viewMode === "grid" ? styles.grid : ""}`}>
    {stores.length === 0 ? (
      <p className={styles["no-results"]}>هیچ فروشگاهی یافت نشد.</p>
    ) : (
      stores.map((store) => (
        <div key={store.id} className={styles["store-card"]}>
          <div
            className={styles["store-banner"]}
            style={{ backgroundImage: `url(${store.image})` }}
          />
          <div className={styles["store-body"]}>
            <div className={styles["store-icon"]}>
              <FiShoppingBag />
            </div>
            <div className={styles["store-info"]}>
              <h2 className={styles["store-name"]}>{store.name}</h2>
              <p className={styles["store-description"]}>{store.description}</p>
              <div className={styles["store-details"]}>
                <span className={styles["store-rating"]}>
                  <RenderStars rating={store.rating} /> ({store.reviews} نظر)
                </span>
                <span className={styles["store-location"]}>
                  <FiMapPin /> {store.location}
                </span>
              </div>
              {store.promotion && (
                <span className={styles["store-promotion"]}>{store.promotion}</span>
              )}
            </div>
            <button
              onClick={() => onFavoriteToggle(store.id)}
              className={`${styles["favorite-btn"]} ${
                favorites.includes(store.id) ? styles.favorited : ""
              }`}
            >
              <FiHeart />
            </button>
            <button onClick={() => onStoreSelect(store)} className={styles["details-btn"]}>
              جزئیات
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className={styles["pagination"]}>
    <button
      disabled={currentPage === 1}
      onClick={() => onPageChange((prev) => prev - 1)}
      className={styles["page-btn"]}
    >
      قبلی
    </button>
    <span>صفحه {currentPage} از {totalPages}</span>
    <button
      disabled={currentPage >= totalPages}
      onClick={() => onPageChange((prev) => prev + 1)}
      className={styles["page-btn"]}
    >
      بعدی
    </button>
  </div>
);

const Sidebar = ({ categories, selectedCategory, onCategorySelect }) => (
  <div className={styles["sidebar"]}>
    <h2 className={styles["sidebar-title"]}>دسته‌بندی‌ها</h2>
    <ul className={styles["category-list"]}>
      {categories.map((cat) => (
        <li
          key={cat}
          onClick={() => onCategorySelect(cat)}
          className={`${styles["category-item"]} ${
            selectedCategory === cat ? styles.active : ""
          }`}
        >
          {cat}
        </li>
      ))}
    </ul>
  </div>
);

const Promotions = ({ stores }) => (
  <div className={styles["promotions-section"]}>
    <h2 className={styles["section-title"]}>تخفیف‌های ویژه</h2>
    <div className={styles["promotions-grid"]}>
      {stores.map((store) => (
        <div key={store.id} className={styles["promotion-card"]}>
          <h3>{store.name}</h3>
          <p>{store.promotion}</p>
        </div>
      ))}
    </div>
  </div>
);

const StoreModal = ({ store, onClose }) => (
  <div className={styles["modal-overlay"]} onClick={onClose}>
    <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
      <button className={styles["close-btn"]} onClick={onClose}>
        بستن
      </button>
      <img
        src={store.image}
        alt={store.name}
        className={styles["modal-image"]}
        loading="lazy"
      />
      <h2>{store.name}</h2>
      <p>{store.description}</p>
      <div className={styles["modal-details"]}>
        <span>
          <RenderStars rating={store.rating} /> {store.rating}
        </span>
        <span>
          <FiMapPin /> {store.location}
        </span>
      </div>
      {store.promotion && (
        <p className={styles["modal-promotion"]}>{store.promotion}</p>
      )}
      <div className={styles["map-placeholder"]}>نقشه مکان (گوگل مپس)</div>
      <button className={styles["share-btn"]}>اشتراک گذاری</button>
    </div>
  </div>
);

const Newsletter = () => (
  <div className={styles["newsletter-section"]}>
    <h2 className={styles["section-title"]}>عضویت در خبرنامه</h2>
    <p>برای دریافت آخرین تخفیف‌ها و اخبار، ایمیل خود را وارد کنید.</p>
    <div className={styles["newsletter-form"]}>
      <input
        type="email"
        placeholder="ایمیل خود را وارد کنید..."
        className={styles["newsletter-input"]}
      />
      <button className={styles["newsletter-btn"]}>عضویت</button>
    </div>
  </div>
);

// Main Component
const Stores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // Default to grid for better visual
  const [selectedStore, setSelectedStore] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("rating-desc");
  const [page, setPage] = useState(1);
  const [showPromotedOnly, setShowPromotedOnly] = useState(false);
  const itemsPerPage = 8;

  const debouncedSearch = useCallback(
    (term) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => term(...args), 300);
      };
    },
    []
  )(setSearchTerm);

  const { filteredStores, totalFiltered } = useMemo(() => {
    let filtered = sampleStores.filter((store) => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "همه" || store.category === selectedCategory;
      const matchesRating = store.rating >= minRating;
      const matchesPromotion = !showPromotedOnly || store.promotion;
      return matchesSearch && matchesCategory && matchesRating && matchesPromotion;
    });

    const totalFiltered = filtered.length;

    filtered.sort((a, b) => {
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "rating-asc") return a.rating - b.rating;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

    const start = (page - 1) * itemsPerPage;
    return { filteredStores: filtered.slice(start, start + itemsPerPage), totalFiltered };
  }, [searchTerm, selectedCategory, minRating, sortBy, page, showPromotedOnly]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const openModal = (store) => setSelectedStore(store);
  const closeModal = () => setSelectedStore(null);

  return (
    <div className={styles.storesRoot}>
      <div className={styles["animated-bg"]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className={styles["stores-container"]}>
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <div className={styles["main-content"]}>
          <h1 className={styles["stores-header"]}>فروشگاه‌ها</h1>

          <div className={styles["filters-section"]}>
            <SearchBar onSearch={debouncedSearch} />
            <Filters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              minRating={minRating}
              onRatingChange={setMinRating}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showPromotedOnly={showPromotedOnly}
              onShowPromotedChange={setShowPromotedOnly}
            />
          </div>

          <FeaturedStores stores={filteredStores.slice(0, 3)} />

          {/* New addition: Top Deals Banner */}
          <div className={styles["top-deals-banner"]}>
            <p>امروز: تخفیف‌های ویژه تا ۴۰٪!</p>
          </div>

          <StoreList
            stores={filteredStores}
            viewMode={viewMode}
            favorites={favorites}
            onFavoriteToggle={toggleFavorite}
            onStoreSelect={openModal}
          />

          <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalFiltered / itemsPerPage)}
            onPageChange={setPage}
          />
        </div>
        <Promotions stores={filteredStores.filter((s) => s.promotion)} />

        <Newsletter />
        {selectedStore && <StoreModal store={selectedStore} onClose={closeModal} />}
      </div>
    </div>
  );
};

export default Stores;