"use client";
import { 
  ShoppingBagIcon, TagIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon,
  UserGroupIcon, SparklesIcon, FireIcon, BoltIcon, StarIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';

const showAlert = (type, title, text) => {
  Swal.fire({
    icon: type,
    title: title,
    text: text,
    showConfirmButton: true,
    confirmButtonColor: '#facc15',
    background: '#ffffff',
    customClass: {
      title: 'text-gray-800',
      content: 'text-gray-600',
      confirmButton: 'bg-yellow-400 hover:bg-yellow-500'
    }
  });
};

export default function Home() {
  const features = [
    {
      title: "Belanja Mudah",
      description: "Temukan berbagai produk dengan mudah dan cepat.",
      icon: ShoppingBagIcon,
    },
    {
      title: "Harga Terbaik",
      description: "Dapatkan harga kompetitif dan penawaran menarik setiap hari.",
      icon: TagIcon,
    },
    {
      title: "Pengiriman Express",
      description: "Pengiriman cepat ke seluruh Indonesia.",
      icon: TruckIcon,
    },
  ];

  const stats = [
    { number: "1M+", label: "Pelanggan Aktif" },
    { number: "100K+", label: "Produk Tersedia" },
    { number: "4.9/5", label: "Rating Pelanggan" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with new layout */}
      <div className="relative bg-gradient-to-tl from-yellow-100 to-yellow-50 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-16 lg:gap-24">
            {/* Image on the left (desktop) */}
            <div className="flex-1 w-full flex justify-center lg:justify-end mb-8 lg:mb-0">
              <div className="aspect-square w-72 sm:w-96 relative">
                <Image
                  src="https://annisadev.com/img/20241031093648-2024-10-31news093645.jpeg"
                  alt="Warehouse Illustration"
                  fill
                  className="object-contain rounded-3xl shadow-lg border-4 border-yellow-200"
                  priority
                />
              </div>
            </div>
            {/* Text on the right (desktop) */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-8 tracking-tight">
                <span className="block text-yellow-500 drop-shadow-lg">GudangLaris</span>
                <span className="block text-2xl lg:text-3xl font-medium text-gray-700 mt-2">Pusat Grosir & Retail Termurah</span>
              </h1>
              <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto lg:mx-0">
                Solusi belanja kebutuhan rumah tangga, usaha, dan kantor dengan harga grosir, stok lengkap, dan pengiriman cepat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="inline-flex items-center px-10 py-4 rounded-xl bg-yellow-500 text-white font-bold text-lg shadow-md hover:bg-yellow-600 transition-colors"
                >
                  Mulai Belanja
                  <ShoppingBagIcon className="w-6 h-6 ml-3" />
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center px-10 py-4 rounded-xl border-2 border-yellow-400 text-yellow-600 font-bold text-lg hover:bg-yellow-100 hover:border-yellow-500 transition-colors"
                >
                  Lihat Kategori
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section moved up, horizontal cards */}
      <div className="bg-yellow-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex-1 text-center p-8 rounded-2xl bg-white shadow-md border border-yellow-100">
              <div className="text-5xl font-extrabold text-yellow-500 mb-2">500K+</div>
              <div className="text-gray-700 text-lg font-medium">Pelanggan Puas</div>
            </div>
            <div className="flex-1 text-center p-8 rounded-2xl bg-white shadow-md border border-yellow-100">
              <div className="text-5xl font-extrabold text-yellow-500 mb-2">50K+</div>
              <div className="text-gray-700 text-lg font-medium">Produk Grosir & Retail</div>
            </div>
            <div className="flex-1 text-center p-8 rounded-2xl bg-white shadow-md border border-yellow-100">
              <div className="text-5xl font-extrabold text-yellow-500 mb-2">99%</div>
              <div className="text-gray-700 text-lg font-medium">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with icons on top, new grid */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-yellow-500 mb-3 tracking-tight">Keunggulan GudangLaris</h2>
            <p className="text-lg text-gray-700">Belanja grosir & retail lebih mudah, aman, dan hemat untuk semua kalangan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="group flex flex-col items-center p-10 rounded-3xl bg-yellow-50 border border-yellow-100 hover:bg-yellow-100 hover:shadow-2xl transition-all duration-300">
              <ShieldCheckIcon className="w-8 h-8 text-yellow-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Transaksi Aman</h3>
              <p className="text-gray-700 text-center">Sistem pembayaran terverifikasi dan jaminan uang kembali untuk setiap transaksi.</p>
            </div>
            <div className="group flex flex-col items-center p-10 rounded-3xl bg-yellow-50 border border-yellow-100 hover:bg-yellow-100 hover:shadow-2xl transition-all duration-300">
              <BoltIcon className="w-8 h-8 text-yellow-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Pengiriman Kilat</h3>
              <p className="text-gray-700 text-center">Pesanan diproses dan dikirim di hari yang sama ke seluruh Indonesia.</p>
            </div>
            <div className="group flex flex-col items-center p-10 rounded-3xl bg-yellow-50 border border-yellow-100 hover:bg-yellow-100 hover:shadow-2xl transition-all duration-300">
              <CreditCardIcon className="w-8 h-8 text-yellow-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Banyak Metode Pembayaran</h3>
              <p className="text-gray-700 text-center">Dukungan transfer bank, e-wallet, dan pembayaran di tempat (COD).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}