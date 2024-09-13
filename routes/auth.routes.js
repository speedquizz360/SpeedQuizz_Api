const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join("public/uploads/signupImages");

    // Create the folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/auth/signin", controller.signin);
  app.post("/auth/logout/:id", controller.logout);
  app.post("/auth/forgot-password", controller.forgotPassword);
  app.post("/auth/reset-password", controller.resetPassword);
  
  app.post("/auth/signup-images", [authJwt.verifyToken, authJwt.isAdmin], upload.single("image"), userController.postSignupImages);
  app.put("/auth/signup-images/:id", [authJwt.verifyToken, authJwt.isAdmin], upload.single("image"), userController.putSignupImages);
  app.get("/auth/signup-images", userController.getSignupImages);
};
