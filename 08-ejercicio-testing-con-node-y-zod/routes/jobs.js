import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'
import { validateJob, validatePartialJob } from '../schemas/jobs.js'

export const jobsRouter = Router()

/*
function validateCreate(req, res, next) {
  const result = validateJob(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Invalid Request',
      details: result.error.issues,
    })
  }

  req.body = result.data
  next()
}

function validatePartialUpdate(req, res, next) {
  const result = validatePartialJob(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Invalid Request',
      details: result.error.issues,
    })
  }

  req.body = result.data
  next()
}
*/

// Un detalle que no es parte del ejercicio pero si interesante: Podemos hacer un middleware factory en vez de dos middlewares casi iguales. No es tan necesario pero ahorra código y queda más funcional
const validate = (validateFn) => (req, res, next) => {
  const result = validateFn(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Invalid Request',
      details: result.error.issues,
    })
  }

  req.body = result.data
  next()
}

jobsRouter.get('/', JobController.getAll)
jobsRouter.get('/:id', JobController.getId)

jobsRouter.post('/', validate(validateJob), JobController.create)

jobsRouter.put('/:id', validate(validateJob), JobController.update)

jobsRouter.patch('/:id', validate(validatePartialJob), JobController.partialUpdate)

jobsRouter.delete('/:id', JobController.delete)
