import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "reactstrap";

const CasosPage = () => {
  const [clientes, setCliente] = useState([]);

  useEffect(() => {
    cargarClientes();
  })

  const redireccion = () => {
    window.location.href = '/minimn';
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Confirmar eliminación",
      text: "¿Estás seguro de eliminar este abogado?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar",
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://server-api-6wm6.onrender.com/ObCliente/${id}`)
          .then((response) => {
            cargarClientes();
            Swal.fire(
              "Eliminado",
              "El cliente ha sido eliminado correctamente.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error al eliminar el cliente:", error);
            Swal.fire(
              "Error",
              "Ocurrió un error al eliminar el cliente.",
              "error"
            );
          });
      }
    });
  };

  const cargarClientes = () => {
    axios.get("http://localhost:8081/ObCliente")
      .then((response) => {
        setCliente(response.data);
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

  return (
    <div className="container-fluid bg-white text-black vh-100 d-flex flex-column align-items-center justify-content-start">
      <div style={{ backgroundColor: "#192DDF", width: "101.5%", height: "80px" }} className="d-flex align-items-center justify-content-center">
        <h1 className="text-white">Lista de Clientes</h1>
      </div>
      <div className="position-fixed top-0 start-0 m-3">
        <Link to="/MenuAD" className="btn btn-primary">
          Volver
        </Link>
      </div>
      <div className="mt-5">
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID cliente</th>
                <th>Nombre</th>
                <th>Apellido paterno</th>
                <th>Apellido materno</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.idCliente}>
                  <td>{cliente.idCliente}</td>
                  <td>{cliente.Nombre}</td>
                  <td>{cliente.apePat}</td>
                  <td>{cliente.apeMat}</td>
                  <td><Button onClick={() => handleDelete(cliente.idCliente)}>Eliminar cliente</Button></td>
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