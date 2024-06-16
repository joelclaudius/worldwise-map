// delayMiddleware.js
module.exports = (req, res, next) => {
  setTimeout(() => {
    next();
  }, 500); // 500 milliseconds delay
};
