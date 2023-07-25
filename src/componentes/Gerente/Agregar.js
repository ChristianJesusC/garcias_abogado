import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';



const AgregarAbogado = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [ocupacion, setOcupacion] = useState("Abogado");

  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !correo || !contraseña) {
      Swal.fire('Error', 'Debes completar todos los campos obligatorios.', 'error');
      return;
    }
    if (contraseña.length < 6) {
      Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }
  
    axios.post("https://server-api-6wm6.onrender.com/implementar", {
        nombre: nombre,
        apePat: apellidoPaterno,
        apeMat: apellidoMaterno,
        correo: correo,
        contraseña: contraseña,
        ocupacion: ocupacion,
      })
      .then((response) => {
        if (response.data === 'Registrado con éxito') {
          Swal.fire('Éxito', response.data, 'success');
        } else {
          Swal.fire('Error', response.data, 'error');
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error', 'Error al registrar el abogado', 'error');
      });
  };
  


  const handleGoBack = () => {
    navigate("/menuad");
  };


  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div style={{boxShadow: "0 8px 16px rgba(0, 0, 0, 1)" }}>
      <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded text-black">
        <h3 className="text-center pb-4 text-black">Agregar Abogado</h3>
        <div className="form-group">
          <div className="input-group mb-3">
            <label htmlFor="nombre" className="input-group-text">
              Nombre
            </label>
            <input type="text" className="form-control border border-black" id="nombre" onChange={(e) => setNombre(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <div className="input-group mb-3">
            <label htmlFor="apellidoPaterno" className="input-group-text">
              Apellido Paterno
            </label>
            <input type="text" className="form-control border border-black" id="apellidoPaterno" onChange={(e) => setApellidoPaterno(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <div className="input-group mb-3">
            <label htmlFor="apellidoMaterno" className="input-group-text">
              Apellido Materno
            </label>
            <input type="text" className="form-control border border-black" id="apellidoMaterno" onChange={(e) => setApellidoMaterno(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <div className="input-group mb-3">
            <label htmlFor="correo" className="input-group-text">
              Correo
            </label>
            <input type="email" className="form-control border border-black" id="correo" onChange={(e) => setCorreo(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <div className="input-group mb-3">
            <label htmlFor="contraseña" className="input-group-text">
              Contraseña
            </label>
            <input type="password" className="form-control border border-black" id="contraseña" onChange={(e) => setContraseña(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <div className="input-group mb-3">
            <label htmlFor="ocupacion" className="input-group-text">
              Ocupación
            </label>
            <select className="form-select border border-black" id="ocupacion" value={ocupacion} onChange={(e) => setOcupacion(e.target.value)}>
              <option value="Abogado">Abogado</option>
              <option value="Gerente">Gerente</option>
            </select>
          </div>
        </div>
        <div className="text-center pt-4">
          <button type="submit" className="btn btn-primary btn-lg" style={{ backgroundColor: "#192DDF", paddingLeft: "100px", paddingRight: "100px" }}>
            Crear
          </button>
        </div>
      </form>
      <div className="position-fixed bottom-0 start-0 mb-3 ms-3">
        <button className="btn btn-primary" onClick={handleGoBack}>
          Atrás
        </button>
      </div>
      </div>
    </div>
  );
};

export default AgregarAbogado;
