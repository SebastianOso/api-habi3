const jwt = require("jsonwebtoken");
const db = require('../../database');
require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES;
const REFRESH_TOKEN_RENEWAL_THRESHOLD = process.env.REFRESH_TOKEN_RENEWAL_THRESHOLD;


const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.userId, email: user.email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
    );
};

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
        { userId: user.userId, email: user.email },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    // Store refresh token in the database
    await db.execute(
        'INSERT INTO refresh_tokens (userId, token, expiresAt) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
        [user.userId, refreshToken]
    );

    return refreshToken;
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw new Error('Invalid access token');
    }
};

const verifyRefreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        const [rows] = await db.execute(
            'SELECT * FROM refresh_tokens WHERE userId = ? AND token = ? AND expiresAt > NOW()',
            [decoded.userId, token]
        );

        if (rows.length === 0) {
            throw new Error('Invalid or expired refresh token');
        }

        return { decoded, expiresAt: rows[0].expiresAt }; // Return object with decoded and expiresAt
    } catch (err) {
        throw new Error('Invalid refresh token: ' + err.message);
    }
};

const invalidateRefreshToken = async (token) => {
    await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
};

const shouldRenewRefreshToken = (expiresAt) => {
    const now = new Date();
    const timeLeft = (new Date(expiresAt) - now) / 1000; // Time left in seconds
    return timeLeft < REFRESH_TOKEN_RENEWAL_THRESHOLD;
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    invalidateRefreshToken,
    shouldRenewRefreshToken
};