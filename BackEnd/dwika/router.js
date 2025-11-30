
const { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  editProductById, 
  deleteProductById 
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/products',
    handler: createProduct,
  },
  {
    method: 'GET',
    path: '/products',
    handler: getAllProducts,
  },
  {
    method: 'GET',
    path: '/products/{productId}',
    handler: getProductById,
  },
  {
    method: 'PUT',
    path: '/products/{productId}',
    handler: editProductById,
  },
  {
    method: 'DELETE',
    path: '/products/{productId}',
    handler: deleteProductById
  },
];

module.exports = routes;
