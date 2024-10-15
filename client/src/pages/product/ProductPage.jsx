import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../../components/productCard/ProductCard";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarCategory from "../../components/sidebarCategory/SidebarCategory";
import "./ProductPage.css";
import { BiErrorCircle } from "react-icons/bi";
import Navbar from "../../components/Header/Header";

const ProductPage = (userData, logout) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("mobile");
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch products based on category
      const res = await axios.get(
        `https://fakestoreapi.in/api/products/category?type=${category}&sort=desc`
      );
      const allProducts = res.data.products;

      // Apply price filtering locally
      const filteredProducts = allProducts.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      setProducts(filteredProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(priceRange);
  }, [category, priceRange]);

  return (
    <div className="mt-5">
      <Navbar userData={userData} logout={logout} />
      <div className="d-flex">
        <SidebarCategory
          setCategory={setCategory}
          setPriceRange={setPriceRange}
        />
        <div className="container d-flex justify-content-center my-4 px-6">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
            {loading ? (
              <div className="d-flex justify-content-center align-self-center  w-100">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="notfount d-flex ">
                <BiErrorCircle size={24} className="mt-1 me-1" />
                <p>No products found</p>
              </div>
            ) : (
              products.map((product, id) => (
                <ProductCard key={id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
