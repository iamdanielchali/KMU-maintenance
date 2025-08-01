// Database Configuration
// Change these settings to use different databases

const config = {
    // MongoDB Configuration (Default)
    mongodb: {
        url: process.env.MONGODB_URL || 'mongodb://localhost:27017/kmu_maintenance',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // MySQL Configuration (Alternative)
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'kmu_maintenance',
        port: process.env.MYSQL_PORT || 3306
    },

    // PostgreSQL Configuration (Alternative)
    postgresql: {
        host: process.env.PG_HOST || 'localhost',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || '',
        database: process.env.PG_DATABASE || 'kmu_maintenance',
        port: process.env.PG_PORT || 5432
    },

    // Current database type
    current: process.env.DB_TYPE || 'mongodb' // Options: 'mongodb', 'mysql', 'postgresql'
};

module.exports = config;