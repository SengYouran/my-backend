const paginate = async ({
  db,
  dataQuery,
  countQuery,
  page = 1,
  limit = 10,
  params = [],
}) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  if (page < 1) page = 1;
  const offset = (page - 1) * limit;
  const paginatedQuery = `${dataQuery} LIMIT ? OFFSET ?`;
  const [countRows] = await db.query(countQuery, params);
  const total = Object.values(countRows[0])[0] ?? 0;
  // check what is returned

  const [results] = await db.query(paginatedQuery, [...params, limit, offset]);
  const totalPages = Math.ceil(total / limit);

  return {
    results,
    pagination: {
      totalItems: total,
      totalPages,
      currentPage: page,
      limit,
    },
  };
};
module.exports = paginate;
