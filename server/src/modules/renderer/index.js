const wrap = ({ fields, mapping }) => (obj) => {
  const copy = {};

  if (obj._id) {
    copy.id = obj._id;
  }

  fields.forEach((field) => {
    copy[field] = (
      mapping && mapping[field]
        ? mapping[field](obj[field])
        : obj[field]
    );
  });

  return copy;
};

module.exports = { wrap };
