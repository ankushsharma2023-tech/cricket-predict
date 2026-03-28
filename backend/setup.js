const pool = require('./src/models/db');

async function setupDatabase() {
  try {
    const connection = await pool.getConnection();
    
    console.log('Creating users table...');
    await connection.query(`
      DROP TABLE IF EXISTS users
    `);
    
    await connection.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        total_points INT DEFAULT 0,
        current_streak INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Inserting test data...');
    await connection.query(`
      INSERT INTO users (username, total_points, current_streak) VALUES
      ('player1', 1500, 10),
      ('player2', 1200, 8),
      ('player3', 950, 5)
    `);

    console.log('✅ Database setup complete!');
    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

setupDatabase();