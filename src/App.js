import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './componentes/Login';
import MiniMN from './componentes/MiniMN';
import Menu from './componentes/Menu';
import Lista from './componentes/Lista';
import Encuesta from './componentes/encuesta2/EncuestaM';
import Descripcion from './componentes/Descripcion';
import MenuAD from './componentes/Gerente/MenuAD';
import Agregar from './componentes/Gerente/Agregar';
import Visualizar from './componentes/Gerente/Visualizar';
import ListaGerente from './componentes/Gerente/ListaGerente'
import Clientes from './componentes/Gerente/clientes'
import Editar from './componentes/Editar';

function App() {
  return (
    <div className='app-container'>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/minimn" element={<MiniMN />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/lista" element={<Lista />} />
          <Route path="/encuesta" element={<Encuesta />} />
          <Route path="/descripcion" element={<Descripcion />} />
          <Route path="/menuad" element={<MenuAD />} />
          <Route path="/agregar" element={<Agregar />} />
          <Route path="/visualizar" element={<Visualizar />} />
          <Route path="/listaG" element={<ListaGerente />} />
          <Route path='/cliente' element={<Clientes/>}/>
          <Route path='/editarArchivo' element={<Editar/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
