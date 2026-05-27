import { Router } from 'express'

const router = Router()

router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime()
    })
})

export default router
