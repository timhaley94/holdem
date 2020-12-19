const wrap = ({
  fields,
  permissions,
  mapping,
}) => (
  obj,
  context = null,
) => {
  const copy = {};

  if (obj._id) {
    copy._id = obj._id;
    copy.id = obj._id;
  }

  fields.forEach((field) => {
    const canSee = (
      permissions?.[field]
        ? permissions[field](obj, context)
        : true
    );

    if (canSee) {
      copy[field] = (
        mapping && mapping[field]
          ? mapping[field](obj[field], context)
          : obj[field]
      );
    }
  });

  return copy;
};

module.exports = { wrap };
