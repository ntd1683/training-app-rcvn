// services/algoliaService.js
import { algoliasearch } from 'algoliasearch';

export const client = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY
);

export const searchProducts = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    const { results } = await client.search({
      requests: [{
        indexName: 'products_index',
        query: query,
        hitsPerPage: 8,
        attributesToRetrieve: [
          'objectID',
          'name',
          'description',
          'image_url',
          'price',
          'quantity',
          'status',
          'id',
          'currency',
          'sold_count'
        ],
        filters: 'status:1 OR status:2' // Only show SELLING and OUT_OF_STOCK
      }]
    });

    const hits = results[0].hits;

    return hits.map(hit => ({
      id: hit.id || hit.objectID, // Use custom id field first, fallback to objectID
      objectID: hit.objectID,
      name: hit.name,
      description: hit.description,
      image: hit.image_url, // Map image_url to image
      price: parseFloat(hit.price), // Convert string to number
      quantity: hit.quantity,
      status: hit.status,
      currency: hit.currency,
      soldCount: parseInt(hit.sold_count) || 0,
    }));
  } catch (error) {
    console.error('Algolia search error:', error);
    throw error;
  }
};

export const getSearchSuggestions = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    const { results } = await client.search({
      requests: [{
        indexName: 'products_index',
        query: query,
        hitsPerPage: 5,
        attributesToRetrieve: ['name'],
        filters: 'status:1 OR status:2'
      }]
    });

    return results[0].hits.map(hit => hit.name);
  } catch (error) {
    console.error('Algolia suggestions error:', error);
    return [];
  }
};

// Search with filters
export const searchProductsWithFilters = async (query, filters = {}) => {
  try {
    const { category, priceRange, status } = filters;
    let filterString = 'status:1 OR status:2';

    if (category) {
      filterString += ` AND category:${category}`;
    }

    if (priceRange) {
      filterString += ` AND price >= ${priceRange.min} AND price <= ${priceRange.max}`;
    }

    if (status) {
      filterString = `status:${status}`;
    }

    const { results } = await client.search({
      requests: [{
        indexName: 'products_index',
        query: query || '',
        hitsPerPage: 20,
        attributesToRetrieve: [
          'objectID',
          'name',
          'description',
          'image_url',
          'price',
          'quantity',
          'status',
          'id',
          'currency',
          'sold_count'
        ],
        filters: filterString
      }]
    });

    const hits = results[0].hits;

    return hits.map(hit => ({
      id: hit.id || hit.objectID,
      objectID: hit.objectID,
      name: hit.name,
      description: hit.description,
      image: hit.image_url,
      price: parseFloat(hit.price),
      quantity: hit.quantity,
      status: hit.status,
      currency: hit.currency,
      soldCount: parseInt(hit.sold_count) || 0,
    }));
  } catch (error) {
    console.error('Algolia search with filters error:', error);
    throw error;
  }
};

const algoliaSearchService = { searchProducts, getSearchSuggestions, searchProductsWithFilters };
export default algoliaSearchService;