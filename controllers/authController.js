const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });

  const token = signToken(newUser._id);

  res.status(201).json({ status: 'success', token, data: { user: newUser } });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1)Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide credentials', 400));
  }
  //2)Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid credentials', 401));
  }
  // console.log(user);

  //3)If everything is ok, send token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

//MIDDLEWARE FOR PROTECTED ROUTES
exports.protect = catchAsync(async (req, res, next) => {
  //1)Get token and checking that it exists (headers)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Please log in to get access', 401));
  }
  //2)Validate token === Verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //3)Check if that user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('This user no longer exists', 401));
  }
  //4)Check if user changes pwd after the JWT was issued-->[Model]=>changedPasswordAfter
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'The password was recently changed. Please log in again',
        401
      )
    );
  }
  //next() === Grant access to the protected route
  req.user = freshUser;
  next();
});

//MIDDLEWARE FOR RESTRICTED PRIVILEGES
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

//User sends post request to inform that he/she forgot his/her password and receives an email with a token
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user was found with that email address', 404));
  }
  //2)Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3)Send randomly generated token to user
});

exports.resetPassword = (req, res, next) => {};
