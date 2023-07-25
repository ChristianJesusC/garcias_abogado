import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";

const CasosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [casosData, setCasosData] = useState([]);

  useEffect(() => {
    cargarCasos();
  }, []);

  const redireccion = () => {
    window.location.href = '/menuad';
  };

  const cargarCasos = () => {
    axios.get("https://server-api-6wm6.onrender.com/visualCaso")
      .then((response) => {
        setCasosData(response.data);
      })
      .catch(() => {
        Swal.fire({
          title: 'ERROR',
          text: "Fallo en la conexión",
          icon: 'warning',
        }).then((result) => {
          if (result.isConfirmed) {
            redireccion();
          }
        });
      });
  };

  const handleEdit = (idCasos, idAbogado) => {
    const localIdAbogado = localStorage.getItem('idAbogado');
    const estatus=localStorage.getItem('ocupacion')
    if (localIdAbogado === idAbogado?.toString() || estatus==='Gerente') {
      localStorage.setItem('idCasos', idCasos);
      window.location.href = '/editarArchivo';
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No tienes permiso para editar este archivo.',
        icon: 'error',
      });
    }
  };

  const eliminarCaso = (id) => {
    Swal.fire({
      title: "Confirmar eliminación",
      text: "¿Estás seguro de eliminar este caso?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar",
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://server-api-6wm6.onrender.com/casos/${id}`) 
          .then((response) => {
            cargarCasos();
            Swal.fire(
              "Eliminado",
              "El caso ha sido eliminado correctamente.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error al eliminar el caso:", error);
            Swal.fire("Error", "Ocurrió un error al eliminar el caso.", "error");
          });
      }
    });
  };
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleVerExpediente = (id) => {
    localStorage.setItem("idCasos", id);
  };

  const getEstadoColor = (estadoExpediente) => {
    if (estadoExpediente === "Activa") {
      return "bg-success text-white";
    } else if (estadoExpediente === "Inactiva") {
      return "bg-danger text-white";
    } else if (estadoExpediente === "En juicio") {
      return "bg-warning text-dark";
    } else {
      return "";
    }
  };

  const filteredCasos = casosData.filter((caso) => {
    const idCasosStr = caso.idCasos.toString();
    if (searchBy === "codigo") {
      return idCasosStr.includes(searchTerm);
    } else {
      return caso.Titulo.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  return (
    <div className="container-fluid bg-white text-black vh-100 d-flex flex-column align-items-center justify-content-start">
      <div style={{ backgroundColor: "#192DDF", width: "101.5%", height: "80px" }} className="d-flex align-items-center justify-content-center">
        <h1 className="text-white">Lista de Casos</h1>
      </div>
      <div className="position-fixed top-0 start-0 m-3">
        <Link to="/menuad" className="btn btn-primary">
          Volver
        </Link>
      </div>
      <div className="mt-5">
        <div className="mb-3">
          <div style={{ backgroundColor: "#192DDF" }} className="input-group">
            <select className="form-select text-black" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
              <option>Seleccione tipo de búsqueda</option>
              <option value="codigo">Buscar por código</option>
              <option value="titulo">Buscar por título</option>
            </select>
            <input
              type="text"
              className="form-control border border-dark shadow"
              placeholder="Ingrese el término de búsqueda"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Título de expediente</th>
                <th>Código del expediente</th>
                <th>Fecha de registro</th>
                <th>Tipo de expediente</th>
                <th>Estado de expediente</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCasos.map((caso) => (
                <tr key={caso.idCasos}>
                  <td>{caso.Titulo}</td>
                  <td>{caso.idCasos}</td>
                  <td>{caso.fechaRegistro}</td>
                  <td>{caso.TipoJuicio}</td>
                  <td>
                    <span className={`badge rounded-pill ${getEstadoColor(caso.EstadoExpediente)}`}>
                      {caso.EstadoExpediente}
                    </span>
                  </td>
                  <td>
                    <Link to="/descripcion" className="btn btn-primary ms-2" style={{ marginLeft: "10px" }} onClick={() => handleVerExpediente(caso.idCasos)}>
                      Ver Expediente
                    </Link>
                    </td>
                    <td>
                      <Button className="btn-danger" onClick={() => eliminarCaso(caso.idCasos)}>Eliminar</Button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CasosPage;