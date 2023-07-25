import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const MiniMN = () => {
  const [abogado, setAbogado] = useState(null);

  useEffect(() => {
    const idAbogados = localStorage.getItem('idAbogado');
    
    axios.get(`https://server-api-6wm6.onrender.com/abogados/${idAbogados}`)
      .then((response) => {
        setAbogado(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos del abogado:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener la información del abogado',
          icon: 'error',
        }).then(() => {
          window.location.href = '/';
        });
      });
  }, []);

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="text-black">{abogado?.nombre} {abogado?.apePat} {abogado?.apeMat}</h1>
      <img src="/Abogado.png" alt="Avatar" style={{ width: '200px', height: '220px', borderRadius: '50%', marginTop: '20px', marginBottom: '120px' }} />
      <div className="d-flex flex-column justify-content-center mt-3">
        <Link to="/menu" className="btn btn-primary mb-2" style={{ backgroundColor: '#192DDF' }}>Agregar Expediente</Link>
        <Link to="/lista" className="btn btn-primary" style={{ backgroundColor: '#192DDF' }}>Historial/Lista de expedientes</Link>
        <Link to='/' className="btn btn-danger mt-4">Salir</Link>
      </div>
    </div>
  );
}

export default MiniMN;