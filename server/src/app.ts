import express, { type ErrorRequestHandler } from 'express'
import f1Routes from './routes/f1.routes.js'
import { OpenF1Error } from './services/f1.service.js'
const app = express()
app.use(express.json())
app.use((_request, response, next) => { response.setHeader('access-control-allow-origin', '*'); response.setHeader('cache-control', 'no-store'); next() })
app.use('/api/f1', f1Routes)
app.use((_request, response) => response.status(404).json({ error: 'Route not found.' }))
const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => { if (error instanceof OpenF1Error) return response.status(error.statusCode).json({ error: 'F1 data is temporarily unavailable.' }); console.error(error); return response.status(500).json({ error: 'Unexpected server error.' }) }
app.use(errorHandler)
export default app
