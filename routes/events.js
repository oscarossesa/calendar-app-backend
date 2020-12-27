/*
    Event Routes
    /api/events
*/
const { Router } = require('express')
const { check } = require('express-validator')

const { fieldValidator } = require('../middlewares/fieldsValidator')
const { validateJWT } = require('../middlewares/jwtValidator')
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events')
const { isDate } = require('../helpers/isDate')

const router = Router()
router.use(validateJWT)

// Todas tienen que pasar por la validación del JWT
// Obtener eventos
router.get('/', getEvents)

// Crear un nuevo evento
router.post('/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        check('end', 'Fecha de finalización es obligatorio').custom(isDate),
        fieldValidator
    ]
    , createEvent)

// Actualizar evento
router.put('/:id',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        check('end', 'Fecha de finalización es obligatorio').custom(isDate),
        fieldValidator
    ],
    updateEvent)

// Eliminar evento
router.delete('/:id', deleteEvent)

module.exports = router