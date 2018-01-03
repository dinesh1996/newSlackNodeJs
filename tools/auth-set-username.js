module.exports = {
    setUsername: (req, res, next) => {
        // if user is authenticated in the session, carry on
        User.findOne({'username': req.body.username}, function (err, user) {
            if (err) {

                res.redirect('/');
            }
            if (user) {

                res.redirect('/');
            } else {
                res.username = req.body.username;
                next();
            }

        });

        // if they aren't redirect them to the home page

    }
}
