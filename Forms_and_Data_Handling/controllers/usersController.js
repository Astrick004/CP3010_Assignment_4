// This just shows the new stuff we're adding to the existing contents
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "Must be a valid email"
const ageErr = "must be a number between 18 and 120"
const bioErr = "must not exceed 200 characters "

const validateUser = [
  body("firstName").trim()
  .isAlpha().withMessage(`First name ${alphaErr}`)
  .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body("email").trim()
    .isEmail().withMessage(`${emailErr}`),
  body("age").optional()
    .isInt({ min: 18, max: 120 }).withMessage(`Age ${ageErr}`),
  body("bio").optional()
    .isLength({ max: 200 }).withMessage(`Bio ${bioErr}`)
];

const usersStorage = require("../storages/usersStorage");

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  }
];

exports.usersUpdateGet = (req, res) => {
const user = usersStorage.getUser(Number(req.params.id));
    res.render("updateUser", {
      title: "Update user",
      user: user,
    });
  };
  
  exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
      const user = usersStorage.getUser(req.params.id);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
          title: "Update user",
          user: user,
          errors: errors.array(),
        });
      }
      const { firstName, lastName, email, age, bio } = req.body;
      usersStorage.updateUser(Number(req.params.id), { firstName, lastName, email, age, bio });
      res.redirect("/");
    }
  ];

  exports.usersStorageGet = (req, res) => {
    const users = usersStorage.getUsers(); 
    res.render('usersStorage', { users: users }); 
};

exports.usersListGet = (req, res) => {
    const users = usersStorage.getUsers();
    res.render("index", { title: "Users List", users: users });
  };

exports.usersCreateGet = (req, res) => {
    res.render("createUser", { title: "Create User" });
};

  // Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(Number(req.params.id));
    res.redirect("/");
  };
  
  exports.usersSearchGet = (req, res) => {
    const { search } = req.query; 
    if (!search || search.trim() === "") {
        return res.status(400).render("search", {
            title: "Search Users",
            users: [],
            search: search || "" 
        });
    }    
    const searchUsers = usersStorage.getUsers().filter(user => 
        user.firstName.includes(search) || user.lastName.includes(search)
    );
    res.render("search", {
        title: "Search Results",
        users: searchUsers,
        search: search
    });
};