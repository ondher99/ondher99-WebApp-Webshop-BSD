import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./category-page.css";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  categories: string[];
  stock: number;
}



const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/${productId}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    product && (
      <div>
        <h1>{product.name}</h1>
        <img src={product.image} alt={product.name} />
        <p>{product.description}</p>
        <p>Ár: {product.price} Ft</p>
        <div className="product-rating">
          {"★".repeat(Math.round(product.rating))}
          {"☆".repeat(5 - Math.round(product.rating))}
        </div>
        <p>Raktáron: {product.stock}</p>
        <div className="category-container">
          {product.categories &&
            product.categories.map((category, i) => (
              <Link to={`/products?selectedCategory=${category}&selectedOrderBy=&query=&inStock=true&currentPage=1&limit=6`}>
                <div key={i} className="category">
                  <div> {category}</div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    )
  );
};

export default ProductPage;
