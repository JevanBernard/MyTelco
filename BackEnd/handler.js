const { nanoid } = require('nanoid');
const products = require('./products');

const createProduct = (request, h) => {
  const {
    name,
    category,
    price,
    quota,
    validity,
    features,
    provider,
    description
  } = request.payload;

  // Validasi required fields
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan produk. Mohon isi nama produk',
    });
    response.code(400);
    return response;
  }

  if (!category) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan produk. Mohon isi kategori produk',
    });
    response.code(400);
    return response;
  }

  if (!price || price <= 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan produk. Harga harus lebih besar dari 0',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newProduct = {
    id,
    name,
    category, // internet, voice, combo, etc
    price,
    quota: quota || null,
    validity: validity || 30, // default 30 hari
    features: features || [],
    provider: provider || 'Unknown',
    description: description || '',
    createdAt,
    updatedAt,
  };

  products.push(newProduct);
  const isSuccess = products.filter((product) => product.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Produk berhasil ditambahkan',
      data: {
        productId: id,
      }
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Produk gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllProducts = (request, h) => {
  const { name, category, minPrice, maxPrice, provider } = request.query;
  let filteredProducts = products;

  // Filter by name (case insensitive search)
  if (name !== undefined) {
    const searchName = name.toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchName)
    );
  }

  // Filter by category
  if (category !== undefined) {
    filteredProducts = filteredProducts.filter((product) =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by price range
  if (minPrice !== undefined) {
    const min = parseInt(minPrice);
    filteredProducts = filteredProducts.filter((product) =>
      product.price >= min
    );
  }

  if (maxPrice !== undefined) {
    const max = parseInt(maxPrice);
    filteredProducts = filteredProducts.filter((product) =>
      product.price <= max
    );
  }

  // Filter by provider
  if (provider !== undefined) {
    filteredProducts = filteredProducts.filter((product) =>
      product.provider.toLowerCase().includes(provider.toLowerCase())
    );
  }

  const response = h.response({
    status: 'success',
    data: {
      products: filteredProducts.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        provider: product.provider,
      })),
    },
  });

  response.code(200);
  return response;
};

const getProductById = (request, h) => {
  const { productId } = request.params;

  const product = products.filter((p) => p.id === productId)[0];

  if (product !== undefined) {
    return h.response({
      status: 'success',
      data: {
        product,
      },
    }).code(200);
  }

  const response = h.response({
    status: 'fail',
    message: 'Produk tidak ditemukan'
  });
  response.code(404);
  return response;
};

const editProductById = (request, h) => {
  const { productId } = request.params;

  const {
    name,
    category,
    price,
    quota,
    validity,
    features,
    provider,
    description
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = products.findIndex((product) => product.id === productId);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui produk. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui produk. Mohon isi nama produk',
    });
    response.code(400);
    return response;
  }

  if (price && price <= 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui produk. Harga harus lebih besar dari 0',
    });
    response.code(400);
    return response;
  }

  products[index] = {
    ...products[index],
    name,
    category,
    price,
    quota,
    validity,
    features,
    provider,
    description,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Produk berhasil diperbarui'
  });
  response.code(200);
  return response;
};

const deleteProductById = (request, h) => {
  const { productId } = request.params;

  const index = products.findIndex((product) => product.id === productId);

  if (index !== -1) {
    products.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Produk berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Produk gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Handler untuk rekomendasi produk (akan integrate dengan ML model nanti)
const getRecommendations = (request, h) => {
  const {
    customer_id,
    usage_data,
    budget,
    preferred_category,
    current_package
  } = request.payload;

  // Validasi required fields
  if (!customer_id) {
    const response = h.response({
      status: 'fail',
      message: 'Customer ID diperlukan',
    });
    response.code(400);
    return response;
  }

  // TODO: Nanti replace dengan actual ML model prediction
  // Sementara ini return dummy recommendations berdasarkan logic sederhana
  
  let recommendations = [];

  // Filter products based on budget if provided
  let availableProducts = [...products];
  
  if (budget) {
    availableProducts = availableProducts.filter(p => p.price <= budget);
  }

  if (preferred_category) {
    availableProducts = availableProducts.filter(p => 
      p.category.toLowerCase() === preferred_category.toLowerCase()
    );
  }

  // Dummy logic: ambil top 3 products dan kasih confidence score
  // Nanti ini akan diganti dengan ML model prediction
  const topProducts = availableProducts
    .sort((a, b) => b.price - a.price) // Sort by price descending
    .slice(0, 3);

  recommendations = topProducts.map((product, index) => ({
    rank: index + 1,
    offer: product.id,
    product_name: product.name,
    category: product.category,
    price: product.price,
    confidence: (99.7 - (index * 10)).toFixed(2) + '%', // Dummy confidence
    reasons: [
      'Sesuai dengan budget Anda',
      'Populer di kategori ini',
      'Nilai terbaik untuk harga'
    ]
  }));

  if (recommendations.length === 0) {
    const response = h.response({
      status: 'success',
      message: 'Tidak ada rekomendasi yang sesuai dengan kriteria',
      data: {
        customer_id,
        recommendations: []
      }
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Rekomendasi berhasil dibuat',
    data: {
      customer_id,
      recommendations
    }
  });
  response.code(200);
  return response;
};

module.exports = { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  editProductById, 
  deleteProductById,
  getRecommendations
};
