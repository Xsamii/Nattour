const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpasssword', authController.forgotPawword);
router.patch('/resetpassword/:token', authController.resetPassword);
router.patch(
  '/changepassword',
  authController.chechAuth,
  authController.changePassword
);

router
  .route('/')
  .get(
    authController.chechAuth,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(userController.createUser)
  .patch(authController.chechAuth, userController.updateUser)
  .delete(authController.chechAuth, userController.deleteUser);

router.route('/:id').get(userController.getUser);

module.exports = router;
