module.exports = (sec) => new Promise((resolve) => {
  setTimeout(() => resolve(), sec * 1000);
});
