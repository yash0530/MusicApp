const middleware = {};

middleware.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash('error_msg', 'Please log in first');
    res.redirect('/login');
}

module.exports = middleware;