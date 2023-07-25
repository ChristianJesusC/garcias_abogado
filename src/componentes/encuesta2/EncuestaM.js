import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, FormGroup, Input, Table } from 'reactstrap';
import './estilos.css';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';


const Component01 = () => {
  const [data, setData] = useState([
    
  ]);

  const [originalData, setOriginalData] = useState(data);
  const [apeP, setApeP] = useState('');
  const [apeM, setApeM] = useState('');
  const [nombre, setNombre] = useState('');
  const [est, setEst] = useState('Activo');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchId, setSearchId] = useState('');
  const [lastId, setLastId] = useState(1);
  const [isIdAscending, setIsIdAscending] = useState(true);
  

  const pageCount = Math.ceil(data.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = data.slice(offset, offset + itemsPerPage);

  const handleAdd = () => {
    if (!apeP || !apeM || !nombre) {
      setError('Todos los campos son requeridos');
      return;
    }

    const newItem = {
      id: lastId,
      apeP: apeP,
      apeM: apeM,
      Nombre: nombre,
      est: est,
    };

    setData([...data, newItem]);
    setOriginalData([...originalData, newItem]);
    setApeP('');
    setApeM('');
    setNombre('');
    setEst('Activo');
    setError('');
    setLastId(lastId + 1);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    setOriginalData(updatedData);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'searchId') {
      setSearchId(value);
      filterData(value);
    } else {
    }
  };

  const filterData = (searchId) => {
    if (searchId) {
      const filtered = originalData.filter((item) => item.id.toString() === searchId);
      setData(filtered);
    } else {
      setData(originalData);
    }
  };

  const handleSortById = () => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (isIdAscending) {
        return b.id - a.id;
      } else {
        return a.id - b.id;
      }
    });
    setData(sortedData);
    setIsIdAscending(!isIdAscending);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(0);
  };

  return (
    <Container>
      <Form>
        <div className="row cuadro">
          <div className="col-md-3">
            <FormGroup>
              <Input type="text" id="apeP" value={apeP} onChange={(e) => setApeP(e.target.value)} placeholder="Apellido Paterno" />
            </FormGroup>
          </div>
          <div className="col-md-3">
            <FormGroup>
              <Input type="text" id="apeM" value={apeM} onChange={(e) => setApeM(e.target.value)} placeholder="Apellido Materno" />
            </FormGroup>
          </div>
        <div className="col-md-3">
          <FormGroup>
            <Input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
          </FormGroup>
        </div>
        <div className="col-md-3">
          <FormGroup>
          <Input type="select" id="est" value={est} onChange={(e) => setEst(e.target.value)}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
          </Input>
          </FormGroup>
          </div>
        <Button color="danger" onClick={handleAdd}>Agregar</Button>
        </div>
        {error && <p>{error}</p>}
      </Form>
      <p/>
      <div className="d-flex justify-content-between">
      <div>
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Agrupar de: </label>
            <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
          </div>
            <div>
            <FormGroup className="d-flex justify-content-end col-15">
            <Input type="text" name="searchId" value={searchId} onChange={handleInputChange} placeholder="ID" />
        </FormGroup>
      </div>
      </div>
      <Table>
        <thead>
          <tr>
          <Button color="dark" onClick={handleSortById}>ID{isIdAscending ? ' ↑' : ' ↓'}</Button>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Nombre</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.apeP}</td>
              <td>{item.apeM}</td>
              <td>{item.Nombre}</td>
              <td>{item.est}</td>
              <td>
                <Button color="danger" onClick={() => handleDelete(item.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ReactPaginate
        previousLabel={<button className="btn">Previous</button>}
        nextLabel={<button className="btn">Next</button>}
        breakLabel={<button className="btn">...</button>}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
<Link to="/minimn">
        <Button color="primary">Volver</Button>
      </Link>

      
    </Container>
    
  );
};

export default Component01;