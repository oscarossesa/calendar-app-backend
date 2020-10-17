const { Router } = require('express')
const { check } = require('express-validator')
const router = Router()
const { fieldValidator } = require('../middlewares/fieldsValidator')
const { validateJWT } = require('../middlewares/jwtValidator')

const { 
  createUser, 
  userLogin, 
  refreshToken 
} = require('../controllers/auth')

router.post(
  '/new', 
  [ // middlewares
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
    fieldValidator
  ], 
  createUser
)

router.post(
  '/',
  [ // middlewares
    check('email', 'El email es obligatorio y tiene que tener un formato correcto').isEmail(),
    check('email', 'El email debe ser de 10 caracteres como minimo').isLength({ min: 10 }),
    check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
    fieldValidator
  ],   
  userLogin)

router.get('/renew', validateJWT, refreshToken)

module.exports = router