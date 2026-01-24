require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For GTop100 POST pingbacks

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

// ==================== RANKINGS API ====================
app.get('/api/rankings', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    let query = `
      SELECT
        cs.name,
        cs.level,
        cs.job,
        cs.exp,
        g.name as guildName
      FROM characterstats cs
      LEFT JOIN characters c ON cs.characterid = c.id
      LEFT JOIN guilds g ON c.guild = g.id
      WHERE cs.level > 0
    `;

    const params = [];

    // Add search filter
    if (search) {
      query += ' AND cs.name LIKE ?';
      params.push(`%${search}%`);
    }

    // Get total count
    const countQuery = query.replace(
      /SELECT[\s\S]*?FROM/,
      'SELECT COUNT(*) as total FROM'
    );
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Add ordering and pagination (using string interpolation for LIMIT/OFFSET as they don't work well with prepared statements)
    query += ` ORDER BY cs.level DESC, cs.exp DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const [rankings] = await pool.execute(query, params);

    // Add rank numbers
    const rankedData = rankings.map((player, index) => ({
      rank: offset + index + 1,
      name: player.name,
      level: player.level,
      job: getJobName(player.job),
      guild: player.guildName || '-',
      exp: player.exp
    }));

    res.json({
      rankings: rankedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Rankings error:', error);
    res.status(500).json({ error: 'Failed to fetch rankings' });
  }
});

// ==================== GAME API PROXY HELPER ====================
const http = require('http');
const gameApiHost = process.env.GAME_SERVER_HOST || 'localhost';
const gameApiPort = process.env.GAME_API_PORT || 3000;

// Helper to proxy requests to game server API
function proxyToGameApi(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: gameApiHost,
      port: gameApiPort,
      path: `/api${path}`,
      method: method,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const request = http.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: response.statusCode, data: json });
        } catch {
          resolve({ status: response.statusCode, data: data || 'Success' });
        }
      });
    });

    request.on('error', (err) => reject(err));
    request.on('timeout', () => { request.destroy(); reject(new Error('Request timeout')); });

    if (body) {
      request.write(JSON.stringify(body));
    }
    request.end();
  });
}

// ==================== REGISTER VIA GAME API ====================
app.post('/api/game/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const result = await proxyToGameApi('POST', '/users', { username, password, email });

    if (result.status === 200 || result.status === 204) {
      res.json({ success: true, message: 'Account created successfully!' });
    } else {
      res.status(result.status).json({ error: result.data.message || 'Registration failed' });
    }
  } catch (error) {
    console.error('Game API register error:', error.message);
    res.status(500).json({ error: 'Unable to connect to game server. Please try again.' });
  }
});

// ==================== LOGIN VIA GAME API ====================
app.post('/api/game/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await proxyToGameApi('POST', '/login', { username, password });

    if (result.status === 200) {
      res.json(result.data);
    } else {
      res.status(result.status).json({ error: result.data.message || 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Game API login error:', error.message);
    res.status(500).json({ error: 'Unable to connect to game server. Please try again.' });
  }
});

// ==================== LOGOUT VIA GAME API ====================
app.delete('/api/game/logout', async (req, res) => {
  try {
    const token = req.headers['x-auth-token'];
    const result = await proxyToGameApi('DELETE', '/login', null, { 'token': token });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: true }); // Logout always succeeds client-side
  }
});

// ==================== FORGOT USERNAME VIA GAME API ====================
app.post('/api/game/forgot-username', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await proxyToGameApi('POST', '/forgot-username', { email });

    if (result.status === 200 || result.status === 204) {
      res.json({ success: true, message: 'If an account with that email exists, you will receive an email with your username.' });
    } else {
      res.status(result.status).json({ error: result.data.message || 'Request failed' });
    }
  } catch (error) {
    console.error('Game API forgot-username error:', error.message);
    res.status(500).json({ error: 'Unable to connect to game server. Please try again.' });
  }
});

// ==================== PASSWORD RESET REQUEST VIA GAME API ====================
app.post('/api/game/reset-password-request', async (req, res) => {
  try {
    const { email } = req.body;

    // First find the username by email in our database
    const [users] = await pool.execute(
      'SELECT name FROM users WHERE email = ?',
      [email]
    );

    // Always return success to prevent email enumeration
    if (users.length === 0) {
      return res.json({ success: true, message: 'If an account with that email exists, a password reset email has been sent.' });
    }

    const username = users[0].name;

    // Now call the game API with the username
    const result = await proxyToGameApi('POST', '/reset-password-request', { username });

    // Always return success message regardless of result (security best practice)
    res.json({ success: true, message: 'If an account with that email exists, a password reset email has been sent.' });
  } catch (error) {
    console.error('Game API reset-password-request error:', error.message);
    // Still return success for security (don't reveal if email exists)
    res.json({ success: true, message: 'If an account with that email exists, a password reset email has been sent.' });
  }
});

// ==================== PASSWORD RESET VIA GAME API ====================
app.post('/api/game/reset-password', async (req, res) => {
  try {
    const { key, password } = req.body;

    if (!key || !password) {
      return res.status(400).json({ error: 'Invalid reset request' });
    }

    // The key format from game API is typically: username:token
    // Try to extract username from the key
    const parts = key.split(':');
    const username = parts[0];
    const requestToken = parts.length > 1 ? parts.slice(1).join(':') : key;

    const result = await proxyToGameApi('POST', '/reset-password', {
      username,
      requestToken,
      newObj: password
    });

    if (result.status === 200 || result.status === 204) {
      res.json({ success: true, message: 'Password reset successfully!' });
    } else {
      res.status(result.status).json({ error: result.data.message || 'Reset failed. The link may have expired.' });
    }
  } catch (error) {
    console.error('Game API reset-password error:', error.message);
    res.status(500).json({ error: 'Unable to connect to game server. Please try again.' });
  }
});

// ==================== PIC RESET (DIRECT DATABASE) ====================
app.post('/api/game/reset-pic', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Verify user credentials from database
    const [users] = await pool.execute(
      'SELECT id, password FROM users WHERE name = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];

    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Clear the PIC (set to empty string or null)
    await pool.execute(
      'UPDATE users SET pic = NULL WHERE id = ?',
      [user.id]
    );

    res.json({ success: true, message: 'PIC reset successfully! You can set a new PIC when you log into the game.' });
  } catch (error) {
    console.error('PIC reset error:', error.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// ==================== SKILL CHANGE INFO VIA GAME API ====================
app.get('/api/game/skillchange', async (req, res) => {
  try {
    const jobId = req.query.jobid;
    const result = await proxyToGameApi('GET', `/skillchange?jobid=${jobId}`);

    if (result.status === 200) {
      res.json(result.data);
    } else {
      res.status(result.status).json({ error: 'Failed to fetch skill info' });
    }
  } catch (error) {
    console.error('Game API skillchange error:', error.message);
    res.status(500).json({ error: 'Unable to connect to game server.' });
  }
});

// ==================== SERVER STATUS API ====================
app.get('/api/status', async (req, res) => {
  try {
    // Get status from game server API
    const gameStatus = await new Promise((resolve) => {
      const request = http.get(`http://${gameApiHost}:${gameApiPort}/api/status`, { timeout: 3000 }, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({
              online: !json.IsShutdown,
              players: json.Playercount || 0,
              version: json.Version || '',
              startTime: json.StartTime || '',
              isShutdown: json.IsShutdown || false,
              shutdownMin: json.ShutdownMin || 0,
              remainingMin: json.RemainingMin || 0
            });
          } catch {
            resolve({ online: false, players: 0 });
          }
        });
      });
      request.on('error', () => resolve({ online: false, players: 0 }));
      request.on('timeout', () => { request.destroy(); resolve({ online: false, players: 0 }); });
    });

    res.json(gameStatus);
  } catch (error) {
    console.error('Status check error:', error);
    res.json({ online: false, players: 0 });
  }
});

// ==================== GTOP100 VOTE PINGBACK ====================
// Vote rewards configuration (from .env)
const VOTE_NX_REWARD = parseInt(process.env.VOTE_NX_REWARD) || 5000;
const VOTE_POINTS_REWARD = parseInt(process.env.VOTE_POINTS_REWARD) || 3;

// GET endpoint for testing - shows that the pingback endpoint is active
app.get('/api/vote/pingback', (req, res) => {
  res.json({
    status: 'active',
    message: 'GTop100 Vote Pingback endpoint is running. This endpoint accepts POST requests from GTop100.',
    rewards: {
      nx: VOTE_NX_REWARD,
      votePoints: VOTE_POINTS_REWARD
    }
  });
});

app.post('/api/vote/pingback', async (req, res) => {
  try {
    const contentType = req.headers['content-type'] || '';
    const pingbackKey = process.env.GTOP100_PINGBACK_KEY;

    if (!pingbackKey) {
      console.error('Vote pingback error: GTOP100_PINGBACK_KEY not configured');
      return res.status(500).send('Pingback key not configured');
    }

    // Handle JSON data (batch votes)
    if (contentType.includes('application/json')) {
      const data = req.body;

      if (!data || !data.Common) {
        return res.status(400).send('Invalid JSON data');
      }

      // Verify pingback key
      if (data.pingbackkey !== pingbackKey) {
        console.error('Vote pingback error: Invalid pingback key');
        return res.status(403).send('Invalid pingback key');
      }

      // Process each vote entry
      for (const entry of data.Common) {
        // Map the array of objects to a single object
        const mappedData = {};
        for (const subEntry of entry) {
          Object.assign(mappedData, subEntry);
        }

        const voterIP = mappedData.ip || null;
        const success = mappedData.success !== undefined ? Math.abs(parseInt(mappedData.success)) : 1;
        const reason = mappedData.reason || null;
        const pingUsername = mappedData.pb_name || null;

        await processVote(voterIP, success, reason, pingUsername);
      }

      return res.status(200).send('JSON data processed successfully');

    } else {
      // Handle POST data (single vote)
      const voterIP = req.body.VoterIP || null;
      const success = req.body.Successful !== undefined ? Math.abs(parseInt(req.body.Successful)) : 1;
      const reason = req.body.Reason || null;
      const pingUsername = req.body.pingUsername || null;
      const receivedKey = req.body.pingbackkey || null;

      // Verify pingback key
      if (receivedKey !== pingbackKey) {
        console.error('Vote pingback error: Invalid pingback key');
        return res.status(403).send('Invalid pingback key');
      }

      await processVote(voterIP, success, reason, pingUsername);

      return res.status(200).send('POST data processed successfully');
    }

  } catch (error) {
    console.error('Vote pingback error:', error);
    return res.status(500).send('Internal server error');
  }
});

// Process individual vote and give rewards
async function processVote(voterIP, success, reason, pingUsername) {
  if (!pingUsername) {
    console.log(`Vote received - IP: ${voterIP}, Success: ${success}, Reason: ${reason}, Username: (none)`);
    return;
  }

  console.log(`Vote received - IP: ${voterIP}, Success: ${success}, Reason: ${reason}, Username: ${pingUsername}`);

  // Only give rewards if vote was successful (success = 0 means successful per GTop100 docs)
  if (success !== 0) {
    console.log(`Vote failed for ${pingUsername}: ${reason}`);
    return;
  }

  try {
    // Find user by username
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE name = ?',
      [pingUsername]
    );

    if (users.length === 0) {
      console.log(`Vote reward failed: User '${pingUsername}' not found`);
      return;
    }

    const userId = users[0].id;

    // Update votepoints in users table
    await pool.execute(
      'UPDATE users SET votepoints = votepoints + ? WHERE id = ?',
      [VOTE_POINTS_REWARD, userId]
    );

    // Update nxCredit in accounts table
    await pool.execute(
      'UPDATE accounts SET nxCredit = nxCredit + ? WHERE userid = ?',
      [VOTE_NX_REWARD, userId]
    );

    console.log(`Vote rewards given to ${pingUsername}: +${VOTE_NX_REWARD} NX, +${VOTE_POINTS_REWARD} Vote Points`);

  } catch (error) {
    console.error(`Vote reward error for ${pingUsername}:`, error.message);
  }
}

// ==================== JOB NAME HELPER ====================
function getJobName(jobId) {
  const jobs = {
    // Explorers
    0: 'Beginner',
    100: 'Warrior', 110: 'Fighter', 111: 'Crusader', 112: 'Hero',
    120: 'Page', 121: 'White Knight', 122: 'Paladin',
    130: 'Spearman', 131: 'Dragon Knight', 132: 'Dark Knight',
    200: 'Magician', 210: 'F/P Wizard', 211: 'F/P Mage', 212: 'F/P Archmage',
    220: 'I/L Wizard', 221: 'I/L Mage', 222: 'I/L Archmage',
    230: 'Cleric', 231: 'Priest', 232: 'Bishop',
    300: 'Bowman', 310: 'Hunter', 311: 'Ranger', 312: 'Bowmaster',
    320: 'Crossbowman', 321: 'Sniper', 322: 'Marksman',
    301: 'Pathfinder', 330: 'Pathfinder', 331: 'Pathfinder', 332: 'Pathfinder',
    400: 'Thief', 410: 'Assassin', 411: 'Hermit', 412: 'Night Lord',
    420: 'Bandit', 421: 'Chief Bandit', 422: 'Shadower',
    430: 'Blade Recruit', 431: 'Blade Acolyte', 432: 'Blade Specialist', 433: 'Blade Lord', 434: 'Blade Master',
    500: 'Pirate', 501: 'Cannoneer', 508: 'Jett',
    510: 'Brawler', 511: 'Marauder', 512: 'Buccaneer',
    520: 'Gunslinger', 521: 'Outlaw', 522: 'Corsair',
    530: 'Cannoneer', 531: 'Cannon Blaster', 532: 'Cannon Master',
    570: 'Jett', 571: 'Jett', 572: 'Jett',
    // GM
    800: 'Manager', 900: 'GM', 910: 'Super GM',
    // Cygnus Knights
    1000: 'Noblesse',
    1100: 'Dawn Warrior', 1110: 'Dawn Warrior', 1111: 'Dawn Warrior', 1112: 'Dawn Warrior',
    1200: 'Blaze Wizard', 1210: 'Blaze Wizard', 1211: 'Blaze Wizard', 1212: 'Blaze Wizard',
    1300: 'Wind Archer', 1310: 'Wind Archer', 1311: 'Wind Archer', 1312: 'Wind Archer',
    1400: 'Night Walker', 1410: 'Night Walker', 1411: 'Night Walker', 1412: 'Night Walker',
    1500: 'Thunder Breaker', 1510: 'Thunder Breaker', 1511: 'Thunder Breaker', 1512: 'Thunder Breaker',
    // Heroes
    2000: 'Legend', 2001: 'Evan',
    2100: 'Aran', 2110: 'Aran', 2111: 'Aran', 2112: 'Aran',
    2210: 'Evan', 2212: 'Evan', 2214: 'Evan', 2217: 'Evan',
    2002: 'Mercedes', 2300: 'Mercedes', 2310: 'Mercedes', 2311: 'Mercedes', 2312: 'Mercedes',
    2003: 'Phantom', 2400: 'Phantom', 2410: 'Phantom', 2411: 'Phantom', 2412: 'Phantom',
    2005: 'Shade', 2500: 'Shade', 2510: 'Shade', 2511: 'Shade', 2512: 'Shade',
    2004: 'Luminous', 2700: 'Luminous', 2710: 'Luminous', 2711: 'Luminous', 2712: 'Luminous',
    // Resistance
    3000: 'Citizen', 3001: 'Demon', 3002: 'Xenon',
    3100: 'Demon Slayer', 3110: 'Demon Slayer', 3111: 'Demon Slayer', 3112: 'Demon Slayer',
    3101: 'Demon Avenger', 3120: 'Demon Avenger', 3121: 'Demon Avenger', 3122: 'Demon Avenger',
    3200: 'Battle Mage', 3210: 'Battle Mage', 3211: 'Battle Mage', 3212: 'Battle Mage',
    3300: 'Wild Hunter', 3310: 'Wild Hunter', 3311: 'Wild Hunter', 3312: 'Wild Hunter',
    3500: 'Mechanic', 3510: 'Mechanic', 3511: 'Mechanic', 3512: 'Mechanic',
    3700: 'Blaster', 3710: 'Blaster', 3711: 'Blaster', 3712: 'Blaster',
    3600: 'Xenon', 3610: 'Xenon', 3611: 'Xenon', 3612: 'Xenon',
    // Sengoku
    4001: 'Hayato', 4100: 'Hayato', 4110: 'Hayato', 4111: 'Hayato', 4112: 'Hayato',
    4002: 'Kanna', 4200: 'Kanna', 4210: 'Kanna', 4211: 'Kanna', 4212: 'Kanna',
    // Mihile
    5000: 'Nameless Warden', 5100: 'Mihile', 5110: 'Mihile', 5111: 'Mihile', 5112: 'Mihile',
    // Nova
    6000: 'Kaiser', 6100: 'Kaiser', 6110: 'Kaiser', 6111: 'Kaiser', 6112: 'Kaiser',
    6001: 'Angelic Buster', 6500: 'Angelic Buster', 6510: 'Angelic Buster', 6511: 'Angelic Buster', 6512: 'Angelic Buster',
    6002: 'Cadena', 6400: 'Cadena', 6410: 'Cadena', 6411: 'Cadena', 6412: 'Cadena',
    6003: 'Kain', 6300: 'Kain', 6310: 'Kain', 6311: 'Kain', 6312: 'Kain',
    // Zero
    10000: 'Zero', 10100: 'Zero', 10110: 'Zero', 10111: 'Zero', 10112: 'Zero',
    // Beast Tamer
    11000: 'Beast Tamer', 11200: 'Beast Tamer', 11210: 'Beast Tamer', 11211: 'Beast Tamer', 11212: 'Beast Tamer',
    // Pink Bean
    13000: 'Pink Bean', 13100: 'Pink Bean',
    // Kinesis
    14000: 'Kinesis', 14200: 'Kinesis', 14210: 'Kinesis', 14211: 'Kinesis', 14212: 'Kinesis',
    // Flora
    15000: 'Illium', 15200: 'Illium', 15210: 'Illium', 15211: 'Illium', 15212: 'Illium',
    15001: 'Ark', 15500: 'Ark', 15510: 'Ark', 15511: 'Ark', 15512: 'Ark',
    15002: 'Adele', 15100: 'Adele', 15110: 'Adele', 15111: 'Adele', 15112: 'Adele',
    // Anima
    16000: 'Ho Young', 16400: 'Ho Young', 16410: 'Ho Young', 16411: 'Ho Young', 16412: 'Ho Young',
    16001: 'Lara', 16200: 'Lara', 16210: 'Lara', 16211: 'Lara', 16212: 'Lara',
  };

  return jobs[jobId] || 'Unknown';
}

// Serve React build in production
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
