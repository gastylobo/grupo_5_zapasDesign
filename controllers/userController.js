const usersFunctions = require("../models/userModel");
const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");

//DATABASE
const db = require('../database/models');
const fs = require("fs");
const path = require("path");
const usersFilePath = path.join(__dirname, "../data/users.json");
const user = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
// Para el login estamos utilizando la funcion findPk que hizo Gasty y esta en models, es temporal y se va a reemplazar cuandoconectemos con la base de dato con sequsalize

const controller = {
  login: (req, res) => res.render("login", {emailRecordado: req.cookies.emailRecordado, passwordRecordada: req.cookies.passwordRecordada }),

  loginPost: async (req, res) => {
  let usuarioALogiarse = await db.Users.findOne({
    where: {email: req.body.email} 
  })


	if (usuarioALogiarse) {
		let passwordOk = bcrypt.compareSync(req.body.password, usuarioALogiarse.password)
		if (passwordOk) {
		// ANTES DE REDIRIGIR A PERFIL, GUARDAMOS LA INFO EN SESSION (sin su password, por seguridad)
		delete usuarioALogiarse.password
		req.session.usuarioLogiado = usuarioALogiarse
   
		// RECORDAR USUARIO EN LAS COOKIES
		if(req.body.recordar){
			res.cookie('userEmail', req.body.email, {maxAge: (100000 * 60)} )
		}

			res.redirect('/user/perfil')
		} else{
			res.render("login", {
				error: {
					email: {
						msg: 'Su email y contraseña no coinciden'
					}
				},
        old: req.body,
        emailRecordado: req.cookies.emailRecordado,
        passwordRecordada: req.cookies.passwordRecordada
			} )
		}

	} else {
		res.render("login", {
			error: {
				email: {
					msg: 'Este email no se encuentra en nuestra base de datos'
				}
			},
      emailRecordado: req.cookies.emailRecordado,
      passwordRecordada: req.cookies.passwordRecordada
		} );
	}
  },

  register: (req, res) => res.render("register"),

  registerPost: async (req, res) => {
    let errors = validationResult(req);
  
    // Validación si hay un correo existente
    
    if (req.file != undefined) {
      image = req.file.filename;
    } else {
      image = "userDefault.png";
    }


    let userInDb = await db.Users.findOne({
      where: {email: req.body.email} 
    })

    if (userInDb){
        return res.render("register", { 
          error:{
            emailRepetido:{
              msg: "Este email ya se encuentra registrado"
            }	},
            old: req.body
        }
      )};

    if (errors.isEmpty())  {
      let pass = req.body.password;

      await db.Users.create( {
        ...req.body,
        imagen: image,
        password: bcrypt.hashSync(pass, 12),
      });

      return res.redirect("/user/login");

    } else {
      res.render("register", { error: errors.mapped(), old: req.body });
    }

    // console.log(req.file.filename);
  },

  perfil: (req, res) => {

    res.render('perfil', {
      user: req.session.usuarioLogiado
    })
    },
  
  logout: (req, res) => { // AL CERRAR SESION Y QUERER INICIAR NUEVAMENTE, TRAE UN ERROR
    res.clearCookie('userEmail')
    req.session.destroy();
    // if (req.cookies.userZapasDesing) {
    //   res.cookie("userZapasDesing", "", { maxAge: -1 });
    // }
    res.redirect("/user/login");
  },

  edit: (req, res) => {
    res.render('edit', {
      user: req.session.usuarioLogiado
    })
    },

  editPost:  async (req, res) => {
      let errors = validationResult(req);
      
      // Validación si hay un correo existente
      
      if (req.file != undefined) {
        image = req.file.filename;
      } else {
        image = "userDefault.png";
      }
  
      if (errors.isEmpty())  {

         await db.Users.update({
          ...req.body,
          imagen: image
        }, {
          where: {id:req.params.id}
        })
        
          let userUpdate = await db.Users.findOne({
            where: {id:req.params.id} 
          })
          
          req.session.usuarioLogiado = userUpdate
        
          return res.redirect("/user/perfil");
                      
      } else {
        return res.render("edit", {error: errors.mapped()});
      }

      // let userInDb = await db.Users.findOne({
      //   where: {email: req.body.email} 
      // })
  
      // if (userInDb != req.session.usuarioLogiado.email){
      //     return res.render("edit", { 
      //       error:{
      //         emailRepetido:{
      //           msg: "Este email ya se encuentra registrado"
      //         }	},
      //         old: req.body
      //     }
      //   )};
    },
};

module.exports = controller;


