const jwt = require("jsonwebtoken");
const { sqlDB } = require("../../db");

const createUser = ({ name, email, hashPassword }) => {
  const hashedPassword = hashPassword;
  return sqlDB
    .query("INSERT INTO users (name, email, hashedPassword) VALUES (?,?,?)", [
      name,
      email,
      hashedPassword,
    ])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return null;
      }
      return result.insertId;
    })
    .catch((err) => {
      console.warn("ERROR IN createUser", err);
    });
};

const signUp = (req, res) => {
  const { name, email, hashPassword } = req.body;
  return createUser({ name, email, hashPassword })
    .then((id) => {
      const token = jwt.sign({ sub: id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({
        msg: "User created with succes",
        token,
        user: { name, email },
      });
    })
    .catch((err) => {
      console.warn(`ERROR IN signup: ${err}`);
      res.sendStatus(500);
    });
};

module.exports = {
  signUp,
};
