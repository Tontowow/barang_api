module.exports = {
  googleCallback: (req, res) => {
    // Redirect atau kirim token di sini. Untuk API, kita bisa kirim pesan sukses.
    res.status(200).json({ message: 'Successfully logged in', user: req.user });
  },

  logout: (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.session.destroy();
      res.status(200).json({ message: 'Successfully logged out.' });
    });
  },

  status: (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({ loggedIn: true, user: req.user });
    } else {
      res.status(200).json({ loggedIn: false });
    }
  }
};