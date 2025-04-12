import { Sequelize } from "sequelize";
import * as tedious from 'tedious';


const username = import.meta.env.VITE_QWIK_APP_DB_USERNAME
const password = import.meta.env.VITE_QWIK_APP_DB_PASSWORD
const name = import.meta.env.VITE_QWIK_APP_DB_NAME


const sequelize = new Sequelize(`mssql://${username}:${password}@localhost:1433/${name}`, {
    dialect: 'mssql',
    dialectModule: tedious,
    logging: false,
    port: 1433, // Default MSSQL port
    dialectOptions: {
        encrypt: false,
        trustServerCertificate: true, // Change to true for local dev / self-signed certs
        requestTimeout: 30000, // 30 seconds
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


export default sequelize
