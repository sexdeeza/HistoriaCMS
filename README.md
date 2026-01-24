# HistoriaCMS

## Prerequisites

- Node.js 18+
- MySQL database (Swordie232)
- Game server with Web API enabled

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `example.env` to `.env` and edit with your settings:
   ```bash
   cp example.env .env
   ```

   Then edit `.env`:
   ```env
   # Website Configuration
   REACT_APP_SERVER_NAME=YourStory

   # Server Rates (displayed on homepage)
   REACT_APP_EXP_RATE=5
   REACT_APP_MESO_RATE=2
   REACT_APP_DROP_RATE=2

   # Vote Configuration
   REACT_APP_GTOP100_SITE_ID=your_site_id
   GTOP100_PINGBACK_KEY=your_pingback_key
   VOTE_NX_REWARD=5000
   VOTE_POINTS_REWARD=3

   # Download Configuration
   REACT_APP_DOWNLOAD_URL=https://your-download-link.com/client.zip

   # Server Port
   PORT=3000

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=swordie

   # Game Server API (leave the port the same)
   GAME_SERVER_HOST=your_game_server_ip
   GAME_API_PORT=3000
   ```

3. **Build the website**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The website will be available at `http://localhost:3000`

## Features

- **Home Page** - Server info, rates, and features
- **Rankings** - Player leaderboard with search
- **Download** - Game client download page
- **Skills** - Custom skill changes viewer
- **Account Management** (For password reset and Username forgot you need to setup email service and fix it i wont update that anytime soon so your on ur own.)
  - Login / Register
  - Password Reset
  - PIC Reset
  - Forgot Username
- **Voting System** - GTop100 integration with rewards

## GTop100 Vote Setup

1. Go to your site settings on gtop100.com
2. In "Reward Voters" section:
   - **Pingback URL:** `http://YOUR_SERVER_IP:3000/api/vote/pingback`
   - **Pingback Key:** Copy and paste into `.env` as `GTOP100_PINGBACK_KEY`

## Skill Changes

The Skills page displays custom skill modifications from the game server.

To update skill changes:
1. Edit `SkillChangeConstants.java` in your Swordie source
2. Rebuild the game server
3. Restart the game server

## Project Structure

```
maplestory-website/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── VoteModal.tsx
│   │   └── FallingBlossoms.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Account.tsx
│   │   ├── Rankings.tsx
│   │   ├── Download.tsx
│   │   ├── SkillCalculator.tsx
│   │   ├── ForgotUsername.tsx
│   │   ├── ResetPassword.tsx
│   │   └── ResetPIC.tsx
│   ├── context/
│   │   └── ThemeContext.tsx
│   ├── App.tsx
│   └── index.tsx
├── server.js
├── .env
├── package.json
└── tailwind.config.js
```

## API Endpoints

### Website API (server.js)
- `GET /api/rankings` - Player rankings
- `POST /api/vote/pingback` - GTop100 vote callback

### Game Server Proxy
- `GET /api/status` - Server status
- `POST /api/game/login` - User login
- `POST /api/game/register` - User registration
- `POST /api/game/forgot-username` - Recover username
- `POST /api/game/reset-password` - Reset password
- `POST /api/game/reset-pic` - Reset PIC
- `GET /api/game/skillchange` - Skill changes

## License


Made by lynx