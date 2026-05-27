import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
    const { isAuthenticated, isAdmin, logout } = useAuth()

    return (
        <nav className='navbar'>
            <NavLink to='/'>Inicio</NavLink>
            <NavLink to='/documentos'>Documentos</NavLink>

            {isAuthenticated && <NavLink to='/mis-documentos'>Mis documentos</NavLink>}
            {isAdmin && <NavLink to='/admin'>Admin</NavLink>}
            {isAuthenticated && <NavLink to='/perfil'>Perfil</NavLink>}

            {!isAuthenticated && <NavLink to='/login'>Login</NavLink>}
            {!isAuthenticated && <NavLink to='/register'>Registro</NavLink>}

            {isAuthenticated && (
                <button type='button' onClick={logout}>
                    Cerrar sesión
                </button>
            )}
        </nav>
    )
}