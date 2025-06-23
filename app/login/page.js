"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Swal from 'sweetalert2';
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const showAlert = (type, title, text) => {
    Swal.fire({
      icon: type,
      title: title,
      text: text,
      showConfirmButton: true,
      confirmButtonColor: '#facc15', // yellow-400
      background: '#ffffff',
      customClass: {
        title: 'text-gray-800',
        content: 'text-gray-600',
        confirmButton: 'bg-yellow-400 hover:bg-yellow-500'
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Show success toast
          Swal.fire({
            icon: 'success',
            title: 'Login Berhasil!',
            text: 'Anda akan diarahkan ke halaman utama...',
            timer: 1500,
            showConfirmButton: false,
            background: '#ffffff',
            customClass: {
              title: 'text-gray-800',
              content: 'text-gray-600'
            }
          });

          // Save user data and update auth state
          login({
            id: data.user.id,
            username: data.user.username,
            fullName: data.user.fullName,
            role: data.user.role,
          });

          // Redirect based on role
          if (data.user.role === "admin") {
            router.push("/admin/products");
          } else {
            router.push("/products");
          }
        } else {
          showAlert('error', 'Login Gagal', data.message || 'Terjadi kesalahan saat login');
        }
      } else {
        // Register logic
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            role: "user",
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Show success message
          await Swal.fire({
            icon: 'success',
            title: 'Registrasi Berhasil!',
            text: 'Silakan login dengan akun baru Anda',
            confirmButtonColor: '#facc15',
            background: '#ffffff',
            customClass: {
              title: 'text-gray-800',
              content: 'text-gray-600',
              confirmButton: 'bg-yellow-400 hover:bg-yellow-500'
            }
          });

          // Reset form and switch to login
          setFormData({
            username: "",
            email: "",
            password: "",
            fullName: "",
          });
          setIsLogin(true);
        } else {
          showAlert('error', 'Registrasi Gagal', data.message || 'Terjadi kesalahan saat registrasi');
        }
      }
    } catch (err) {
      console.error("Error:", err);
      showAlert('error', 'Terjadi Kesalahan', 'Silakan coba lagi nanti');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      username: "",
      email: "",
      password: "",
      fullName: "",
    });
  };

  // Demo login handler
  const handleDemoLogin = (role) => {
    if (role === 'admin') {
      setFormData({ username: 'admin', password: '123123', email: '', fullName: '' });
      setIsLogin(true);
    } else if (role === 'user') {
      setFormData({ username: 'user', password: '123123', email: '', fullName: '' });
      setIsLogin(true);
    }
  };

  const renderRegisterForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50"
      >
        {loading ? 'Mendaftar...' : 'Daftar'}
      </button>
    </>
  );

  const renderLoginForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50"
      >
        {loading ? 'Memproses...' : 'Login'}
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShoppingBagIcon className="h-12 w-12 text-yellow-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? "Masuk ke akun Anda" : "Daftar akun baru"}
        </h2>
        {/* Tombol Demo Akun */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 shadow"
          >
            Demo Admin
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('user')}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 shadow"
          >
            Demo User
          </button>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isLogin ? renderLoginForm() : renderRegisterForm()}
          </form>
          <div className="mt-6">
            <button
              type="button"
              onClick={toggleMode}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
            >
              {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}