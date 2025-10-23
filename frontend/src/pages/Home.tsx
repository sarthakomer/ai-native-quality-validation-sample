import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import { listingService } from '../services/listingService';
import type { Listing, SearchFilters } from '../types';

const categories = [
  { name: 'All', icon: '🏠', filter: {} },
  { name: 'Beachfront', icon: '🏖️', filter: { amenities: 'Beach Access' } },
  { name: 'Cabins', icon: '🏕️', filter: { propertyType: 'Cabin' } },
  { name: 'Villas', icon: '🏰', filter: { propertyType: 'Villa' } },
  { name: 'Apartments', icon: '🏢', filter: { propertyType: 'Apartment' } },
  { name: 'Luxury', icon: '💎', filter: { minPrice: 500 } },
  { name: 'Budget', icon: '💰', filter: { maxPrice: 300 } },
  { name: 'Mountain', icon: '⛰️', filter: { amenities: 'Mountain View' } },
];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['listings', searchFilters, activeCategory, currentPage],
    queryFn: () => {
      const category = categories.find(c => c.name === activeCategory);
      const combinedFilters = { ...searchFilters, ...category?.filter };
      return listingService.getAllListings(combinedFilters, currentPage, itemsPerPage);
    },
  });

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setActiveCategory('All');
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbnb-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing stays...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Failed to load listings</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Find your next stay
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Search deals on hotels, homes, and much more...
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Categories - Center Aligned */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`flex flex-col items-center space-y-2 px-6 py-3 rounded-lg transition min-w-fit ${
                  activeCategory === category.name
                    ? 'bg-gray-100 border-b-2 border-gray-900'
                    : 'hover:bg-gray-50'
                }`}
              >
                {category.icon && <span className="text-2xl">{category.icon}</span>}
                <span className={`text-xs font-medium whitespace-nowrap ${
                  activeCategory === category.name ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {activeCategory === 'All' ? 'Explore stays' : `${activeCategory} properties`}
          </h2>
          <p className="text-sm text-gray-600">
            {data?.pagination.total || 0} total {data?.pagination.total === 1 ? 'property' : 'properties'}
            {data?.pagination.total > itemsPerPage && (
              <span className="ml-2">
                (Page {currentPage} of {data?.pagination.pages})
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.listings.map((listing: Listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>

        {data?.listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-2">No listings found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchFilters({});
                setCurrentPage(1);
              }}
              className="mt-4 px-6 py-2 bg-airbnb-red text-white rounded-lg hover:bg-red-600 transition"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === page
                      ? 'bg-airbnb-red text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === data.pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
