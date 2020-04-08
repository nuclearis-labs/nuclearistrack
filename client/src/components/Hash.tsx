function Hash({ hash, lengthBothSides = 6 } = {}) {
  const start = hash.substr(0, lengthBothSides);
  const end = hash.substr(-lengthBothSides);
  return `${start}...${end}`;
}

export default Hash;
