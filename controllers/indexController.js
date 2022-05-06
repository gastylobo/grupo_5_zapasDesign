const controller = {
  index: (req, res) => res.render("index"),
  login: (req, res) => res.render("login"),
  productCart: (req, res) => res.render("productCart"),
  productDetail: (req, res) => res.render("productDetail"),
  register: (req, res) => res.render("register"),
  listaProductos: (req, res) => res.render("listaProductos", {productos:productos}),
};

const productos = [
  {
    id:1,
    titulo: 'Airmax',
    talle: '42',
    color: 'rojo',
    precio: '65.50',
    img: 'zapas-prueba.jpg'
  },
  {
    id:2,
    titulo: 'Jordan',
    talle: '42',
    color: 'negro',
    precio: '65.50',
    img: 'zapas-prueba.jpg'
  },
  {
    id:3,
    titulo: 'Dior',
    talle: '45',
    color: 'blanco',
    precio: '150',
    img: 'zapas-prueba.jpg'
  },
  {
    id:3,
    titulo: 'Dior',
    talle: '45',
    color: 'blanco',
    precio: '150',
    img: 'zapas-prueba.jpg'
  },
  {
    id:3,
    titulo: 'Dior',
    talle: '45',
    color: 'blanco',
    precio: '150',
    img: 'zapas-prueba.jpg'
  },
  {
    id:3,
    titulo: 'Dior',
    talle: '45',
    color: 'blanco',
    precio: '150',
    img: 'zapas-prueba.jpg'
  },
]

module.exports = controller;