'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nama: '',
    harga: '',
    gambar: '',
    kategori: '',
    deskripsi: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useAuth();

  const categories = [
    { id: 'elektronik', name: 'Elektronik', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'aksesoris', name: 'Aksesoris', icon: '⌚' },
    { id: 'rumah', name: 'Peralatan Rumah', icon: '🏠' },
    { id: 'olahraga', name: 'Olahraga', icon: '⚽' },
    { id: 'kecantikan', name: 'Kecantikan', icon: '💄' },
    { id: 'kesehatan', name: 'Kesehatan', icon: '💊' },
    { id: 'buku', name: 'Buku', icon: '📚' }
  ];

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = products.filter(product =>
      product.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Reset form
  const resetForm = () => {
    setNewProduct({
      nama: '',
      harga: '',
      gambar: '',
      kategori: '',
      deskripsi: ''
    });
    setImagePreview(null);
    setIsEditMode(false);
    setEditingProduct(null);
  };

  // Handle Edit - Open modal with product data
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditMode(true);
    setNewProduct({
      nama: product.nama,
      harga: product.harga.toString(),
      gambar: product.gambar,
      kategori: product.kategori,
      deskripsi: product.deskripsi
    });
    setImagePreview(product.gambar);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      try {
        const response = await fetch('/api/products', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: productId }),
        });

        if (response.ok) {
          setProducts(products.filter(product => product.id !== productId));
          alert('Menu berhasil dihapus!');
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus menu');
      }
    }
  };

  // Handle form submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (isEditMode) {
        // Update existing product
        response = await fetch('/api/products', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingProduct.id,
            ...newProduct
          }),
        });
      } else {
        // Add new product
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        });
      }

      if (response.ok) {
        const data = await response.json();

        if (isEditMode) {
          // Update products list
          setProducts(products.map(product =>
            product.id === editingProduct.id ? { ...product, ...newProduct, id: editingProduct.id } : product
          ));
          alert('Menu berhasil diupdate!');
        } else {
          // Add to products list
          setProducts([...products, data]);
          alert('Menu berhasil ditambahkan!');
        }

        resetForm();
        setIsModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Gagal menyimpan menu');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewProduct({ ...newProduct, gambar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="container mx-auto px-2 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Produk Admin</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-5 py-2 rounded-full shadow transition-all duration-200 text-lg"
        >
          <span className="text-xl">＋</span> Tambah Produk
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Cari produk..."
          className="w-full px-5 py-3 pl-12 rounded-full bg-gray-50 focus:ring-2 focus:ring-yellow-400 border-none shadow-sm text-gray-800 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg className="w-6 h-6 text-gray-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 flex flex-col">
            <div className="relative h-32 w-full rounded-t-2xl overflow-hidden">
              <Image
                src={product.gambar || '/placeholder-food.png'}
                alt={product.nama}
                fill
                className="object-cover"
              />
              <span className="absolute top-2 left-2 bg-yellow-300 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow">
                {categories.find(c => c.id === product.kategori)?.icon} {categories.find(c => c.id === product.kategori)?.name || product.kategori}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900 mb-1 truncate">{product.nama}</h3>
                <p className="text-yellow-500 font-extrabold text-lg mb-1">Rp {parseInt(product.harga).toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.deskripsi}</p>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => handleEdit(product)}
                  title="Edit"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-300 text-yellow-700 transition-colors shadow"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z" /></svg>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  title="Hapus"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-300 text-red-600 transition-colors shadow"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full m-4 shadow-lg border border-yellow-200">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="mb-6">
                <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Produk"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  value={newProduct.nama}
                  onChange={(e) => setNewProduct({ ...newProduct, nama: e.target.value })}
                />
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-400">Rp</span>
                  <input
                    type="number"
                    placeholder="Harga"
                    required
                    className="w-full px-4 py-2 pl-12 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    value={newProduct.harga}
                    onChange={(e) => setNewProduct({ ...newProduct, harga: e.target.value })}
                  />
                </div>
                <select
                  value={newProduct.kategori}
                  onChange={(e) => setNewProduct({ ...newProduct, kategori: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Deskripsi"
                  className="w-full px-4 py-2 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  rows="2"
                  value={newProduct.deskripsi}
                  onChange={(e) => setNewProduct({ ...newProduct, deskripsi: e.target.value })}
                />
              </div>

              {/* Modal Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold transition-all duration-200"
                >
                  {isEditMode ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}