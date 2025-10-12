import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, displayName, photos } = profile;
        const email = emails[0].value;
        const picture = photos[0].value;

        // Check if user exists
        let result = await pool.query(
          'SELECT * FROM users WHERE google_id = $1',
          [id]
        );

        let user;

        if (result.rows.length === 0) {
          // Create new user
          result = await pool.query(
            `INSERT INTO users (google_id, email, name, picture, role) 
             VALUES ($1, $2, $3, $4, 'user') 
             RETURNING *`,
            [id, email, displayName, picture]
          );
          user = result.rows[0];
        } else {
          user = result.rows[0];
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

export const googleAuthCallback = (req, res) => {
  const token = jwt.sign(
    { userId: req.user.id, email: req.user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Redirect to frontend with token
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
};

export const getCurrentUser = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, name, picture, role, is_banned, created_at 
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export default passport;