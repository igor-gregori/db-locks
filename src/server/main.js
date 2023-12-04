import express from 'express'
import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize('poc_pix_balances', 'root', '12345678', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 1
    },
    logging: false
})

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/users', async (_, res) => {
    console.info('Endpoint /users sendo consumido')
    try {
        const [results, meta] = await sequelize.query('SELECT * FROM users', { raw: true })
        return res.json(results)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Erro ao buscar usuários.' })
    }
})

app.put('/update-balance', async (req, res) => {
    console.info('Endpoint /update-balance sendo consumido')
    const { doc, value } = req.body

    const t = await sequelize.transaction()

    try {
        {
            const [results, meta] = await sequelize.query('SELECT * FROM str_balance WHERE id = 1')
            var atualStrLimit = results[0].value;
        }

        {
            const [results, meta] = await sequelize.query(`SELECT * FROM doc_balance WHERE doc = '${doc}'`)
            var atualDocLimit = results[0].value
        }

        if (atualStrLimit < value) {
            await t.rollback()
            return res.status(200).json({ success: false }).end()
        }

        if (atualDocLimit < value) {
            await t.rollback()
            return res.status(200).json({ success: false }).end()
        }

        {
            const [results, meta] = await sequelize.query(`UPDATE str_balance SET value = value - ${value} WHERE id = 1`, { transaction: t })
            var strAR = results.affectedRows;
        }

        {
            const [results, meta] = await sequelize.query(`UPDATE doc_balance SET value = value - ${value} WHERE doc = '${doc}'`, { transaction: t })
            var docAR = results.affectedRows;
        }

        await t.commit()

        if (strAR !== 1 || docAR !== 1) {
            throw new Error('Resultado de atualização inesperado')
        }

        return res.status(200).json({ success: true }).end()
    } catch (error) {
        await t.rollback()
        console.error(error)
        return res.status(500).json({ error: 'Erro ao atualizar saldo.' })
    }
})

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`)
    })
})
