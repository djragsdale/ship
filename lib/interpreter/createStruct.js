module.exports = (struct) => {
  const newStruct = {
    STRUCT: struct.name,
    value: {},
  };
  struct.props.forEach((prop) => {
    newStruct.value[prop.value] = undefined;
  });
  return newStruct;
};
