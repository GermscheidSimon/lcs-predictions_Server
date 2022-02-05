const rejectUnauthenticated = (req, res, next) => {
    // check if logged in
    console.log(req.user)
    console.log(req.isAuthenticated)
    if (req.isAuthenticated()) {
      // They were authenticated! User may do the next thing
      // Note! They may not be Authorized to do all things
      next();
    } else {
      // failure best handled on the server. do redirect here.
      res.send({
          message: "Forbidden"
      });
    }
  };
  
module.exports = { rejectUnauthenticated };