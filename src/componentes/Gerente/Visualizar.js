import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Table, Navbar, Nav } from "reactstrap";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

const Visualizar = () => {
  const [abogadoList, setAbogadoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const tableRef = useRef(null);

  useEffect(() => {
    cargarAbogados();
  }, []);

  useEffect(() => {
    scrollToTable();
  }, [currentPage]);

  const cargarAbogados = () => {
    axios.get("https://server-api-6wm6.onrender.com/visualizar")
      .then((response) => {
        setAbogadoList(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los abogados:", error);
      });
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
        axios
          .delete(`http://localhost:8081/abogados/${id}`)
          .then(() => {
            cargarAbogados();
            Swal.fire(
              "Eliminado",
              "El abogado ha sido eliminado correctamente.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error al eliminar el abogado:", error);
            Swal.fire(
              "Error",
              "Ocurrió un error al eliminar el abogado.",
              "error"
            );
          });
      }
    });
  };  

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(0);
  };

  const pageCount = Math.ceil(abogadoList.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = abogadoList.slice(offset, offset + itemsPerPage);

  const scrollToTable = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar color="primary" dark expand="md" className="navbar-custom">
        <Nav className="mr-auto" navbar>
          <h2 className="navbar-title text-white">Lista de Abogados</h2>
        </Nav>
        <Nav navbar>
          <Link to="/menuad" className="btn btn-dark">
            Atrás
          </Link>
        </Nav>
      </Navbar>
      <div className="container py-4">
        <div className="table-responsive rounded shadow bg-white">
          <Table bordered className="table mt-4">
            <thead className="bg-primary text-white">
              <tr>
                <th>ID Abogados</th>
                <th>Nombres</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Correo</th>
                <th>Ocupación</th>
                <th>Contraseña</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((abogado) => (
                <tr key={abogado.idAbogados}>
                  <td>{abogado.idAbogados}</td>
                  <td>{abogado.nombre}</td>
                  <td>{abogado.apePat}</td>
                  <td>{abogado.apeMat}</td>
                  <td>{abogado.correo}</td>
                  <td>{abogado.ocupacion}</td>
                  <td>{abogado.contraseña}</td>
                  <td>
                    <Button
                      color="danger"
                      onClick={() => handleDelete(abogado.idAbogados)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mx-4">
        <div className="d-flex">
          <div className="me-2">
            <label htmlFor="itemsPerPage" className="my-2">Abogados por página:</label>
          </div>
          <div>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="form-select form-select-sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
        <div className="pagination-container">
          <ReactPaginate
            previousLabel="Anterior"
            nextLabel="Siguiente"
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            activeClassName="active"
          />
        </div>
      </div>
    </div>
  );
};

export default Visualizar;