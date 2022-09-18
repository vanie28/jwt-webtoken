const express = require("express");

const router = express.Router();

const authMiddlewares = require("./middlewars/auth");
const userControllers = require("./controllers/userControllers");

router.post("/signup", authMiddlewares.hashPassword, userControllers.signUp);

const getMovies = (req, res) => {
  res
    .status(200)
    .json({ movies: [{ name: "Kung Fu Panda" }, { name: "Superman" }] });
};

/* Authentification wall afin que movies ne soit accessible qu'à une personne authentifier */

router.use(authMiddlewares.verifyToken);

router.get(
  "/movies",
  getMovies
); /* sera exécuté seulement après le middleware router.use */

module.exports = router;
