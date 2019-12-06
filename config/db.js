const sql = require('mssql')

const executeQuery = async query => {
    try {

        const config = {
            user: 'test',
            password: 'test',
            server: 'LAPTOP-DAPHUL8T',
            database: 'Your BD',
        }

        await sql.connect(config)
        const result = await sql.query(query)
        return result
    } catch (err) {

        console.log(err)
        return err;
    }
}

module.exports.executeQuery = executeQuery;