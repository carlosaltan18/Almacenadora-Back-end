import {Router} from 'express'
import { add, completeTask, deleted, edit, getAll } from './task.controller.js'
import {validateJwt} from '../middleware/validate.js'


const api = Router()
api.post('/add', [validateJwt], add)
api.put('/edit/:id', [validateJwt], edit)
api.delete('/delete/:id', [validateJwt], deleted)
api.put('/completeTask/:id', [validateJwt], completeTask)
api.get('/getAll', [validateJwt], getAll)

export default api