import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage.jsx'
import ProductsPage from '../pages/ProductsPage.jsx'
import ProductDetailPage from '../pages/ProductDetailPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import RegisterPage from '../pages/RegisterPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx'
import AdminProductsPage from '../pages/AdminProductsPage.jsx'
import AdminProductCreatePage from '../pages/AdminProductCreatePage.jsx'
import AdminProductEditPage from '../pages/AdminProductEditPage.jsx'
import AdminCategoriesPage from '../pages/AdminCategoriesPage.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import AdminRoute from '../components/AdminRoute.jsx'

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/productos/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
                path="/perfil"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboardPage />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/productos"
                element={
                    <AdminRoute>
                        <AdminProductsPage />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/productos/nuevo"
                element={
                    <AdminRoute>
                        <AdminProductCreatePage />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/productos/:id"
                element={
                    <AdminRoute>
                        <AdminProductEditPage />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/categorias"
                element={
                    <AdminRoute>
                        <AdminCategoriesPage />
                    </AdminRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default AppRouter