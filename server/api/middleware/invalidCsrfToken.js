function invalidCsrfToken(err, req, res, next) {
    if(err.code != 'EBADCSRFTOKEN') return next(err)
    //handle csrf token errors here
    res.status(403)
    res.send('session expired..');
}

module.exports = invalidCsrfToken;