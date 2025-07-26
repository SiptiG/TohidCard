import React, { useState, useMemo, useCallback } from "react";
import styles from "../style/Services.module.css"; // Adjust path as needed
import { FiSearch, FiFilter, FiChevronDown, FiMessageSquare, FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

// Mock data for services with updated image URLs
const servicesData = [
  {
    id: 1,
    title: "خدمات طراحی وب",
    description: "طراحی و توسعه وب‌سایت‌های حرفه‌ای با جدیدترین تکنولوژی‌ها",
    category: "طراحی",
    image: "https://picsum.photos/300/200",
    price: "۵,۰۰۰,۰۰۰ تومان",
    duration: "۷-۱۰ روز",
    rating: 4.8,
    reviews: 45,
    featured: true,
  },
  {
    id: 2,
    title: "خدمات سئو",
    description: "بهینه‌سازی سایت برای افزایش رتبه در موتورهای جستجو",
    category: "بازاریابی",
    image: "https://picsum.photos/300/200",
    price: "۳,۰۰۰,۰۰۰ تومان",
    duration: "۱۴-۲۰ روز",
    rating: 4.5,
    reviews: 30,
  },
  {
    id: 3,
    title: "خدمات طراحی گرافیک",
    description: "طراحی لوگو، بنر و مواد تبلیغاتی خلاقانه",
    category: "طراحی",
    image: "https://picsum.photos/300/200",
    price: "۲,۰۰۰,۰۰۰ تومان",
    duration: "۵-۷ روز",
    rating: 4.7,
    reviews: 60,
    featured: true,
  },
  {
    id: 4,
    title: "خدمات دیجیتال مارکتینگ",
    description: "کمپین‌های تبلیغاتی آنلاین و مدیریت شبکه‌های اجتماعی",
    category: "بازاریابی",
    image: "https://picsum.photos/300/200",
    price: "۴,۵۰۰,۰۰۰ تومان",
    duration: "۱۰-۱۵ روز",
    rating: 4.6,
    reviews: 25,
  },
];

// Reusable Components
const SearchBar = ({ onSearch }) => (
  <div className={styles.searchBar || "search-bar-fallback"}>
    <input
      type="text"
      placeholder="جستجوی خدمات..."
      onChange={(e) => onSearch(e.target.value)}
      className={styles.searchInput || "search-input-fallback"}
    />
    <FiSearch className={styles.searchIcon || "search-icon-fallback"} />
    {process.env.NODE_ENV === "development" && console.log("SearchBar styles:", styles)}
  </div>
);

const FilterOptions = ({ categories, selectedCategory, onCategoryChange, sortBy, onSortChange }) => (
  <div className={styles.filterOptions || "filter-options-fallback"}>
    <div className={styles.categoryDropdown || "category-dropdown-fallback"}>
      <FiFilter className={styles.filterIcon || "filter-icon-fallback"} />
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={styles.dropdownSelect || "dropdown-select-fallback"}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <FiChevronDown className={styles.dropdownArrow || "dropdown-arrow-fallback"} />
    </div>
    <div className={styles.sortDropdown || "sort-dropdown-fallback"}>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className={styles.dropdownSelect || "dropdown-select-fallback"}
      >
        <option value="rating-desc">امتیاز بالا به پایین</option>
        <option value="rating-asc">امتیاز پایین به بالا</option>
        <option value="price-desc">قیمت بالا به پایین</option>
        <option value="price-asc">قیمت پایین به بالا</option>
      </select>
      <FiChevronDown className={styles.dropdownArrow || "dropdown-arrow-fallback"} />
    </div>
    {process.env.NODE_ENV === "development" && console.log("FilterOptions styles:", styles)}
  </div>
);

const RenderStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className={styles.starRating || "star-rating-fallback"}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) return <FaStar key={i} color="#3b82f6" />;
        if (i === fullStars && hasHalf) return <FaStarHalfAlt key={i} color="#3b82f6" />;
        return <FiStar key={i} color="#d1d5db" />;
      })}
    </div>
  );
};

const ServiceCard = ({ service, onSelect }) => (
  <div
    className={styles.serviceCard || "service-card-fallback"}
    onClick={() => onSelect(service)}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    <img src={service.image} alt={service.title} className={styles.serviceImage || "service-image-fallback"} />
    <div className={styles.serviceContent || "service-content-fallback"}>
      <h3 className={styles.serviceTitle || "service-title-fallback"}>{service.title}</h3>
      <p className={styles.serviceDescription || "service-description-fallback"}>{service.description}</p>
      <div className={styles.serviceMeta || "service-meta-fallback"}>
        <span className={styles.servicePrice || "service-price-fallback"}>{service.price}</span>
        <span className={styles.serviceDuration || "service-duration-fallback"}>{service.duration}</span>
      </div>
      <RenderStars rating={service.rating} />
      <button className={styles.detailsButton || "details-button-fallback"}>جزئیات بیشتر</button>
    </div>
    {process.env.NODE_ENV === "development" && console.log("ServiceCard styles:", styles)}
  </div>
);

const FeaturedServices = ({ services, onSelect }) => (
  <div className={styles.featuredSection || "featured-section-fallback"}>
    <h2 className={styles.sectionTitle || "section-title-fallback"}>خدمات ویژه</h2>
    <div className={styles.featuredCarousel || "featured-carousel-fallback"}>
      {services.filter((s) => s.featured).map((service) => (
        <ServiceCard key={service.id} service={service} onSelect={onSelect} />
      ))}
    </div>
    {process.env.NODE_ENV === "development" && console.log("FeaturedServices styles:", styles)}
  </div>
);

const ServiceList = ({ services, onSelect }) => (
  <div className={styles.serviceList || "service-list-fallback"}>
    <h2 className={styles.sectionTitle || "section-title-fallback"}>همه خدمات</h2>
    <div className={styles.serviceGrid || "service-grid-fallback"}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} onSelect={onSelect} />
      ))}
    </div>
    {process.env.NODE_ENV === "development" && console.log("ServiceList styles:", styles)}
  </div>
);

const ServiceModal = ({ service, onClose }) => (
  <div className={styles.modalOverlay || "modal-overlay-fallback"} onClick={onClose}>
    <div className={styles.modalContent || "modal-content-fallback"} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeButton || "close-button-fallback"} onClick={onClose}>
        ×
      </button>
      <img src={service.image} alt={service.title} className={styles.modalImage || "modal-image-fallback"} />
      <h2 className={styles.modalTitle || "modal-title-fallback"}>{service.title}</h2>
      <p className={styles.modalDescription || "modal-description-fallback"}>{service.description}</p>
      <div className={styles.modalMeta || "modal-meta-fallback"}>
        <span className={styles.modalPrice || "modal-price-fallback"}>{service.price}</span>
        <span className={styles.modalDuration || "modal-duration-fallback"}>{service.duration}</span>
      </div>
      <RenderStars rating={service.rating} />
      <div className={styles.reviewSection || "review-section-fallback"}>
        <h3 className={styles.reviewTitle || "review-title-fallback"}>نظرات کاربران</h3>
        <p className={styles.reviewCount || "review-count-fallback"}>{service.reviews} نظر</p>
        <textarea
          className={styles.reviewInput || "review-input-fallback"}
          placeholder="نظر خود را اینجا بنویسید..."
        />
        <button className={styles.submitReviewButton || "submit-review-button-fallback"}>ارسال نظر</button>
      </div>
      <button className={styles.bookServiceButton || "book-service-button-fallback"}>رزرو خدمت</button>
    </div>
    {process.env.NODE_ENV === "development" && console.log("ServiceModal styles:", styles)}
  </div>
);

const CompareServices = ({ services }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const handleToggleSelect = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId].slice(0, 2)
    );
  };

  const compareData = useMemo(() => {
    return services
      .filter((s) => selectedServices.includes(s.id))
      .map((s) => ({
        title: s.title,
        price: s.price,
        duration: s.duration,
        rating: s.rating,
      }));
  }, [selectedServices, services]);

  return (
    <div className={styles.compareSection || "compare-section-fallback"}>
      <h2 className={styles.sectionTitle || "section-title-fallback"}>مقایسه خدمات</h2>
      <div className={styles.compareSelector || "compare-selector-fallback"}>
        {services.map((service) => (
          <div key={service.id} className={styles.compareItem || "compare-item-fallback"}>
            <input
              type="checkbox"
              checked={selectedServices.includes(service.id)}
              onChange={() => handleToggleSelect(service.id)}
            />
            <span>{service.title}</span>
          </div>
        ))}
      </div>
      {selectedServices.length > 1 && (
        <div className={styles.compareTable || "compare-table-fallback"}>
          <table>
            <thead>
              <tr>
                <th>عنوان</th>
                <th>قیمت</th>
                <th>مدت زمان</th>
                <th>امتیاز</th>
              </tr>
            </thead>
            <tbody>
              {compareData.map((data, index) => (
                <tr key={index}>
                  <td>{data.title}</td>
                  <td>{data.price}</td>
                  <td>{data.duration}</td>
                  <td>{data.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {process.env.NODE_ENV === "development" && console.log("CompareServices styles:", styles)}
    </div>
  );
};

const LiveChat = () => (
  <button className={styles.liveChatButton || "live-chat-button-fallback"}>
    <FiMessageSquare /> چت زنده
  </button>
);

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [selectedService, setSelectedService] = useState(null);
  const [sortBy, setSortBy] = useState("rating-desc");

  const categories = ["همه", ...new Set(servicesData.map((s) => s.category))];

  const filteredServices = useMemo(() => {
    return servicesData.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "همه" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "rating-asc") return a.rating - b.rating;
      if (sortBy === "price-desc") return parseFloat(b.price.replace(/[^\d]/g, '')) - parseFloat(a.price.replace(/[^\d]/g, ''));
      if (sortBy === "price-asc") return parseFloat(a.price.replace(/[^\d]/g, '')) - parseFloat(b.price.replace(/[^\d]/g, ''));
      return 0;
    });
  }, [searchTerm, selectedCategory, sortBy]);

  const handleCloseModal = () => setSelectedService(null);

  return (
    <div className={styles.servicesRoot || "services-root-fallback"}>
      <div className={styles.animatedBg || "animated-bg-fallback"}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className={styles.servicesContainer || "services-container-fallback"}>
        <header className={styles.header || "header-fallback"}>
          <h1 className={styles.headerTitle || "header-title-fallback"}>خدمات</h1>
          <LiveChat />
        </header>

        <div className={styles.mainContent || "main-content-fallback"}>
          <SearchBar onSearch={setSearchTerm} />
          <FilterOptions
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <FeaturedServices services={servicesData} onSelect={setSelectedService} />
          <CompareServices services={servicesData} />
          <ServiceList services={filteredServices} onSelect={setSelectedService} />
        </div>

        {selectedService && <ServiceModal service={selectedService} onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default Services;