// dbSingleton.js
const mysql = require('mysql2');

class Database {
  constructor() {
    this.connection = null;
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tech_your_way',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
    this.pool = null;
  }

  async getConnection() {
    try {
      if (!this.pool) {
        console.log('Creating new database connection pool...');
        this.pool = mysql.createPool(this.config);
        
        // Test the connection
        const testConn = await this.pool.getConnection();
        console.log('Successfully connected to MySQL database');
        testConn.release();
      }
      return this.pool;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async query(sql, params) {
    const conn = await this.getConnection();
    try {
      const [rows] = await conn.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}

// Create a single instance of the database class
const database = new Database();

// Export the database instance
module.exports = database;