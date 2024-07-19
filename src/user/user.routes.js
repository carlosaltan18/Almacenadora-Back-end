import {Router} from 'express'
import { deleted, login, signUp, update, test } from './user.controller.js'
import {validateJwt} from '../middleware/validate.js'

const api = Router()

api.post('/signUp', signUp)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleted)

//Prueba de conexión entre backend y frontend
api.get('/test', test)

export default api