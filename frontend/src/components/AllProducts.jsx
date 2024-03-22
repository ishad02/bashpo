import React, { useEffect, useState } from 'react';
import { useGetAllProductQuery } from '../slices/productsApiSlice';
import Loader from './Loader';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
  const { data, isLoading, refetch, error } = useGetAllProductQuery();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [filter, setFilter] = useState('');

  const handleChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    navigate(`/filter/${newFilter}`);
  };

  return (
    <div>
      <div className="text-center">
        <h5 className="mb-2.5">LATEST PRODUCTS</h5>
      </div>
      <div className="flex justify-start max-w-[50px]">
        <div className="flex items-center">
          <div className="inline-block relative w-64">
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleChange}
            >
              <option value="">Filter Products</option>
              <option value="stock">In Stock</option>
              <option value="pLow">Price Low to High</option>
              <option value="pHigh">Price High to Low</option>
              <option value="alphaA">Name (A-Z)</option>
              <option value="alphaZ">Name (Z-A)</option>
              <option value="ratingHigh">Rating (Highest)</option>
              <option value="ratingLow">Rating (Lowest)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 010-1.06z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <h3>{<Loader />}</h3>
      ) : (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.isArray(data) &&
              data.map((product) => (
                <div key={product._id} className="mb-4">
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
