const server = require("express").Router();
//const bcrypt = require("bcryptjs");
const mailer = require("../../templates/Registro.js")

const { User, Student } = require("../db.js");

//Rutar obtener todos los usuarios

server.get("/", (req, res, next) => {
  User.findAll()
    .then((users) => {
      console.log(users);
      if (users && users.length === 0) {
        return res.send({ message: "No hay usuarios" });
      }
      res.send(users);
    })
    .catch((err) => next(err));
});

//Ruta para crear usuario y alumno solo con mail de forma masiva.
server.post("/add", (req, res, next) => {
  var mails = req.body.mails
  console.log(req.body)
  for (var i = 0; i < mails.length; i++) {
    User.create({
      email: mails[i]
    })
      .then(user => {
        console.log(user)
        mailer.enviar_mail("Henry", user.dataValues.email)
        Student.create({
          userId: user.dataValues.id
        })
      })
  }
  res.send("Se creó usuario y alumno")
})


//Ruta crear usuario
server.post("/", (req, res, next) => {
  const {
    email,
    name,
    lastname,
    password,
    city,
    province,
    country,
    role,
    admin,
    status,
    student,
    instructor,
    pm
  } = req.body;
  console.log(email, lastname, email, password);

  if (name && lastname && email) {
    //bcrypt.genSalt(10, (err, hash) => {
    const newUser = {
      email: email,
      name: name,
      lastName: lastname,
      password: password,
      role: role,
      city: city,
      province: province,
      country: country,
      admin: admin,
      status: status,
      student: student,
      instructor: instructor,
      pm: pm
    };
    User.create(newUser)
      .then((user) => {
        mailer.enviar_mail(newUser.name, newUser.email)
        return res.send(user.dataValues);

      })
      .catch((error) => {
        //Mandamos el error al error endware
        next(error);
      });
    //});
  } else {
    return res.send({ message: "Faltan campos obligatorios" });
  }
});

//Ruta obtener usuario por ID

server.get("/:id", async (req, res, next) => {
  let userId = req.params.id;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.send({
        message: `No se encontro el usuario con ID: ${userId}`,
      });
    }
    return res.send(user);
  } catch (error) {
    next(error);
  }
});

server.delete("/:id", (req, res, next) => {
  let userId = req.params.id;

  User.destroy({ where: { id: userId } })
    .then((num) => {
      if (num > 0) {
        return res.send({ message: `Se elimino usuario con ID ${userId}` });
      } else {
        return res.send({ message: `NO se elimino usuario con ID ${userId}` });
      }
    })
    .catch((err) => next(err));
});

//Actualizar Usuarios (Solo algunos campos)
server.put("/:id", async (req, res, next) => {
  const { name, lastName, city, province, country, role } = req.body;
  const userId = req.params.id;
  try {
    //Valido que el usuario exista
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.send({
        message: `No se encontro el usuario con ID: ${userId}`,
      });
    }

    //actualizo el usuario con los campos enviados por body (si alguno no existe no lo actualiza)
    const updated = await user.update({
      name: name,
      lastName: lastName,
      city: city,
      province: province,
      country: country,
      role: role,
    });

    //envio el usuario actualizado
    return res.send(updated);
  } catch (error) {
    next(error);
  }
});


module.exports = server;
