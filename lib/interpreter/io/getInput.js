module.exports = ({ stdin }) => () => new Promise((resolve) => {
  let input = '';
  stdin.once('readable', () => {
    input += stdin.read();
    resolve(input.split('\n')[0]);
  });
});
