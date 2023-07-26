import express from 'express'

interface Controller {
  router: express.Router

  initializeRoutes(): void
}

export default Controller
