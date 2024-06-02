import axios from "axios";
import React, { useEffect, useState } from "react";
import "./category-page.css";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  categories: string[];
  stock: number;
}

interface Data {
  data: Product[];
  total: number;
}

interface CategoryOption {
  id: string;
  name: string;
  image: string;
}

const orderByOptions = [
  { value: "name.ASC", label: "Name (A to Z)" },
  { value: "name.DESC", label: "Name (Z to A)" },
  { value: "price.ASC", label: "Price (Low to High)" },
  { value: "price.DESC", label: "Price (High to Low)" },
  { value: "rating.ASC", label: "Rating (Low to High)" },
  { value: "rating.DESC", label: "Rating (High to Low)" },
];

const CategoryPage = () => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [data, setData] = useState<Data | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedOrderBy, setSelectedOrderBy] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [inStock, setInStock] = useState<boolean>(true);
  const [minRate, setMinRate] = useState<number | undefined>(undefined);
  const [maxRate, setMaxRate] = useState<number | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(6);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/products/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let params: any = {
          limit: limit,
          offset: (currentPage - 1) * limit,
        };
        if (selectedCategory) {
          params.categories = selectedCategory;
        }
        if (selectedOrderBy) {
          params.orderBy = selectedOrderBy;
        }
        if (query) {
          params.query = query;
        }
        if (minPrice !== undefined) {
          params.minPrice = minPrice;
        }
        if (maxPrice !== undefined) {
          params.maxPrice = maxPrice;
        }
        if (inStock !== undefined) {
          params.inStock = inStock;
        }
        if (minRate !== undefined) {
          params.minRate = minRate;
        }
        if (maxRate !== undefined) {
          params.maxRate = maxRate;
        }

        const response = await axios.get("http://localhost:5000/products", {
          params: params,
        });
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [
    selectedCategory,
    selectedOrderBy,
    query,
    minPrice,
    maxPrice,
    inStock,
    minRate,
    maxRate,
    currentPage,
    limit,
  ]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };

  const handleOrderByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOrderBy(event.target.value);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(Number(event.target.value));
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(event.target.value));
  };

  const handleInStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInStock(event.target.checked);
  };

  const handleMinRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinRate(Number(event.target.value));
  };

  const handleMaxRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxRate(Number(event.target.value));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="product-page">
      <h1 className="product-title">
        {selectedCategory ? selectedCategory : "All Categories"}
      </h1>
      <div className="product-inputs">
        <div className="product-input">
          <label htmlFor="categories">Categories</label>
          <select
            id="categories"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories!.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="product-input">
          <label htmlFor="order-by">Order By</label>

          <select
            id="order-by"
            value={selectedOrderBy}
            onChange={handleOrderByChange}
          >
            {orderByOptions.map((orderBy) => (
              <option key={orderBy.value} value={orderBy.value}>
                {orderBy.label}
              </option>
            ))}
          </select>
        </div>

        <div className="product-input">
          <label htmlFor="search">Search</label>

          <input
            id="search"
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search query"
          />
        </div>

        <div className="product-input">
          <label htmlFor="min-price">Min Price</label>

          <input
            id="min-price"
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="Min Price"
          />
        </div>

        <div className="product-input">
          <label htmlFor="max-price">Max Price</label>

          <input
            id="max-price"
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max Price"
          />
        </div>

        <div className="product-input">
          <label htmlFor="min-rate">Min Rate</label>

          <input
            id="min-rate"
            type="number"
            value={minRate}
            onChange={handleMinRateChange}
            placeholder="Min Rating"
          />
        </div>

        <div className="product-input">
          <label htmlFor="max-rate">Max Rate</label>

          <input
            id="max-rate"
            type="number"
            value={maxRate}
            onChange={handleMaxRateChange}
            placeholder="Max Rating"
          />
        </div>

        <div>
          <input
            type="checkbox"
            checked={inStock}
            onChange={handleInStockChange}
          />
          In Stock
        </div>
      </div>

      {data && (
        <div>
          <h2>Products:</h2>
          <div className="product-grid">
            {data.data.map((product) => (
              <div key={product.id} className="product">
                <Link to={`/product/${product.name}`}>
                  <div className="product-info">
                    <div className="product-rating">
                      {"★".repeat(Math.round(product.rating))}
                      {"☆".repeat(5 - Math.round(product.rating))}
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="product-stock">
                      {product.stock > 0 && <div>Available</div>}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(data.total / limit) },
              (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
