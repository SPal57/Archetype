import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER || 'pipeline',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || 'aykbsd01.database.windows.net',
  database: process.env.DB_DATABASE || 'LHM2',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    encrypt: process.env.DB_ENCRYPT !== 'false', // true for Azure SQL
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    connectTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolPromise = null;

export const getDbPool = async () => {
  if (!poolPromise) {
    poolPromise = sql
      .connect(config)
      .then((pool) => {
        console.log(`[Database] Connected successfully to Azure SQL Server: ${config.server}, Database: ${config.database}`);
        return pool;
      })
      .catch((err) => {
        console.error('[Database] Connection Failed:', err.message);
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
};

export { sql };
export default config;
