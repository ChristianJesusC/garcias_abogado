import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MiniMN = () => {
  useEffect(() => {
    const disableBackButton = () => {
      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener('popstate', () => {
        window.history.pushState(null, document.title, window.location.href);
      });
    };

    disableBackButton();

    return () => {
      window.removeEventListener('popstate', () => {});
    };
  }, []);

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100">
      <img
        src="/Logo.png"
        alt="Avatar"
        className="rounded-circle mt-4"
        style={{ width: '200px', height: '200px', boxShadow: '0 8px 16px rgba(0, 0, 0, 1)' }}
      />
      <div className="d-flex flex-column justify-content-center mt-4">
        <Link to='/cliente' className='btn btn-primary mb-3'>Lista clientes</Link>
        <Link to='/ListaG' className='btn btn-primary mb-3'>Historial/Lista de expedientes</Link>
        <Link to="/agregar" className="btn btn-primary mb-3">
          Agregar Abogado
        </Link>
        <Link to="/visualizar" className="btn btn-primary mb-3">
          Ver Lista de abogados
        </Link>
        <Link to="/" className="btn btn-danger">
          Cerrar sesión
        </Link>
      </div>
    </div>
  );
};

export default MiniMN;
