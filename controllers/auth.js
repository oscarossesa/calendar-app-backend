const { response } = require('express')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const { generateJWT } = require('../helpers/jwt')
const User = require('../models/User')

const createUser = async (req, res = response) => {

  const { email, password } = req.body

  try {

    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario ya existe con ese correo'
      })
    }

    user = new User(req.body)

    // encript pass
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(password, salt)

    await user.save()

    // generate JWT
    const token = await generateJWT(user.id, user.name)

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })

  } catch (error) {

    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })

  }

}

const userLogin = async (req, res = response) => {

  const { email, password } = req.body

  try {

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'Usuario no existe'
      })
    }

    // validate password
    const validPassword = bcrypt.compareSync(password, user.password)

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto'
      })
    }

    // generate JWT
    const token = await generateJWT(user.id, user.name)

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })

  } catch (error) {

    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })

  }

}

const refreshToken = async (req, res = response) => {

  const { uid, name } = req

  // generate JWT
  const token = await generateJWT(uid, name)

  res.json({
    ok: true,
    uid,
    name,
    token
  })

}

module.exports = {
  createUser,
  userLogin,
  refreshToken
}