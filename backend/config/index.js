module.exports = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
    dbFile: process.env.DB_FILE,
    jwtConfig: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN
    },
    FRONTEND_HOST: 'https://abbeys.onrender.com/',
    FACEBOOK_CLIENT_ID: '1659599684810994',
    FACEBOOK_CLIENT_SECRET: '7256cc624e6f069bf7285c66f57f8542',
};
