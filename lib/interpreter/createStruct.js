module.exports = (struct) => {
  const newStruct = {
    type: `struct<${struct.name}>`,
    value: {},
  };
  struct.props.forEach((prop) => {
    newStruct.value[prop.value] = undefined;
  });
  return newStruct;
};
