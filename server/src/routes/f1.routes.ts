import { Router } from 'express'
import { drivers, driverStandings, lastRace, nextRace, season, teamStandings } from '../controllers/f1.controller.js'
const router = Router()
router.get('/next-race', nextRace); router.get('/last-race', lastRace); router.get('/season', season); router.get('/drivers', drivers); router.get('/standings/drivers', driverStandings); router.get('/standings/teams', teamStandings)
export default router
