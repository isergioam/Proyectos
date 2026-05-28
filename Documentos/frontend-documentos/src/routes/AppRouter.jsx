import { Route, Routes } from 'react-router-dom'
import { AdminRoute } from '../components/AdminRoute'
import { ProtectedRoute } from '../components/ProtectedRoute'
//import { AdminDashboardPage } from '../pages/AdminDashboardPage'
import { AdminDocumentsPage } from '../pages/AdminDocumentsPage'
import { DocumentCreatePage } from '../pages/DocumentCreatePage'
//import { DocumentDetailPage } from '../pages/DocumentDetailPage'
import { DocumentEditPage } from '../pages/DocumentEditPage'
import { DocumentsPage } from '../pages/DocumentsPage'
//import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { MyDocumentsPage } from '../pages/MyDocumentsPage'
//import { ProfilePage } from '../pages/ProfilePage'
//import { RegisterPage } from '../pages/RegisterPage'

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<DocumentsPage />} />
            <Route path='/login' element={<LoginPage />} />


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