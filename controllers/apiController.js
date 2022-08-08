const db = require("../database/models");

const controller = {
  users: (req, res) =>
    db.Users.findAll().then((usuarios) => {
      let usuariosNew = [];

      usuarios.forEach(function (usuario) {
        usuariosNew.push({
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.email,
          detail: "users/detail/" + usuario.id,
        });
      });

      let objetoLiteral = {
        count: usuarios.length,
        users: usuariosNew,
      };
      res.send(objetoLiteral);
    }),

  products: (req, res) =>
    db.Product.findAll({ include: [{ association: "categorias" }] }).then(
      (productos) => {

        let productosNew = [];

        console.log(productos);
        
        countByCategory = {
          "Deporte": 0,
          "Mujer": 0,
          "Hombre": 0,
          "Coleccion": 0,
        }

        productos.forEach(function (productos) {
          let categorias = productos.categorias.map((categoria) => {
            return categoria.categoria;
          });

          categorias.forEach( categoria => {
            countByCategory[categoria]++;
          })

          productosNew.push({
            id: productos.id,
            name: productos.nombre,
            descripcion: productos.descripcion,
            detail: "users/detail/" + productos.id,
            categoria: categorias
          });
        });

        // 'countByCategory': {deporte: 2}, {coleccion:4}
        /* async function countByCategory() {
          const categoriasDb = await db.Category.findAll({include: [{ association: "categorias" }]})
          const categorias_info = await categoriasDb
          return categorias_info

        } */


        let objetoLiteral = {
          count: productos.length,
          products: productosNew,
          countByCategory: countByCategory
        };

        
        res.send(objetoLiteral);
      }
    ),
};

module.exports = controller;
