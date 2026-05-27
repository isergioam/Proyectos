import { Route, Routes } from 'react-router-dom'
import { AdminRoute } from '../components/AdminRoute'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AdminDashboardPage } from '../pages/AdminDashboardPage'
import { AdminDocumentsPage } from '../pages/AdminDocumentsPage'
import { DocumentCreatePage } from '../pages/DocumentCreatePage'
import { DocumentDetailPage } from '../pages/DocumentDetailPage'
import { DocumentEditPage } from '../pages/DocumentEditPage'
import { DocumentsPage } from '../pages/DocumentsPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { MyDocumentsPage } from '../pages/MyDocumentsPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RegisterPage } from '../pages/RegisterPage'

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/documentos' element={<DocumentsPage />} />
            <Route path='/documentos/:id' element={<DocumentDetailPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            <Route
                path='/perfil'
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path='/mis-documentos'
                element={
                    <ProtectedRoute>
                        <MyDocumentsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path='/mis-documentos/nuevo'
                element={
                    <ProtectedRoute>
                        <DocumentCreatePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path='/mis-documentos/:id'
                element={
                    <ProtectedRoute>
                        <DocumentEditPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path='/admin'
                element={
                    <AdminRoute>
                        <AdminDashboardPage />
                    </AdminRoute>
                }
            />

            <Route
                path='/admin/documentos'
                element={
                    <AdminRoute>
                        <AdminDocumentsPage />
                    </AdminRoute>
                }
            />
        </Routes>
    )
}