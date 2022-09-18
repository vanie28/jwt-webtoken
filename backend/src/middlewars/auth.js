const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

/* modele avec async await */
// try {
//   const hash = await argon2.hash("password");
// } catch (err) {
//   //...
// }

const hashPassword = (req, res, next) => {
  const { password } = req.body;
  argon2
    .hash(password)
    .then((hashedPassword) => {
      req.body.hashPassword = hashedPassword;
      delete req.body.password;
      next(); /* permet de transférer les éléments du req dans le router */
    })
    .catch((err) => {
      console.warn(`ERR IN hashpassword ${err}`);
    });
};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    const [type, token] =
      authorizationHeader.split(
        " "
      ); /* créer un tableau ["string 1","string 2"] en destructuring */
    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }
    req.payload = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.warn(err);
    res.sendStatus(401);
  }
};

module.exports = {
  hashPassword,
  verifyToken,
};
