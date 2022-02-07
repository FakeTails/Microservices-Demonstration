module.exports = {
    session: {
        secret: 'Your mother was a hamster',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // This needs to be true if in prod under https
    }
};