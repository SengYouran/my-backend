const db = require("../db");
const paginate = require("../Utility/paginate");
const Employee = {
  getAll: async (page, limit) => {
    const dataQuery = `
      SELECT 
      emp.id,emp.emp_id, emp.first_name, emp.last_name, emp.gender, emp.dob, emp.status,emp.hire_date,
      emp.telephone, emp.address, emp.description, emp.profile, emp.is_active,
      u.email, u.password, u.roles, s.salary, s.experience ,s.hire_date
      FROM employee_tbl emp
      LEFT JOIN useraccount u ON emp.id = u.employee_id
      LEFT JOIN salary_tbl s ON emp.id = s.employee_id
      WHERE emp.is_active = 1
      ORDER BY emp.id DESC
    `;
    const countQuery = `
      SELECT 
      COUNT(*) AS total_employees
      FROM employee_tbl
    `;
    const total_deactive = `
    SELECT 
    COUNT(CASE WHEN is_active = 1 THEN 1 END) AS active_employees,
    COUNT(CASE WHEN is_active = 0 THEN 1 END) AS deactive_employees
    FROM employee_tbl;
    `;
    const totalPagination = await paginate({
      db,
      dataQuery,
      countQuery,
      page,
      limit,
      params: [],
    });
    
    const [summayDeactive] = await db.query(total_deactive);
    const totalDeactive = summayDeactive[0];
    return {
      results: totalPagination.results,
      pagination: totalPagination.pagination,
      totalDeactive,
    };
  },
  getOneEmp: async (employee_id) => {
    const sql = `
      SELECT emp.id,emp.emp_id, emp.first_name, emp.last_name,emp.gender, emp.dob,
       emp.status, emp.hire_date, emp.profile, emp.address, emp.is_active,emp.description,
       ua.roles, ua.email, ua.password, s.salary, s.experience
      FROM employee_tbl emp
      LEFT JOIN useraccount ua ON emp.id = ua.employee_id 
      LEFT JOIN salary_tbl s ON emp.id = s.employee_id
      WHERE emp.is_active = 1 AND emp.id = ?
    `;
    const [rows] = await db.query(sql, [employee_id]);
    return rows[0];
  },
  insert: async (conn, data) => {
    const sql = `
      INSERT INTO employee_tbl
      (emp_id,first_name, last_name, profile, gender, dob, status, hire_date ,telephone, address, description, is_active)
      VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
    const values = [
      data.emp_id,
      data.first_name,
      data.last_name,
      data.profile,
      data.gender,
      data.dob,
      data.status,
      data.hire_date,
      data.telephone,
      data.address,
      data.description,
      data.is_active,
    ];
    //db.query(sql, values, callback);
    const [results] = await conn.query(sql, values);
    return {
      id: results.insertId,
      ...data,
    };
  },

  update: async (conn, id, data) => {
    let sql = `
      UPDATE employee_tbl
      SET emp_id = ?, first_name = ?, last_name = ?, gender = ?, dob = ?, status = ?,hire_date=?,
          telephone = ?, address = ?, description = ?, is_active = ?
    `;
    const values = [
      data.emp_id,
      data.first_name,
      data.last_name,
      data.gender,
      data.dob,
      data.status,
      data.hire_date,
      data.telephone,
      data.address,
      data.description,
      data.is_active,
    ];

    if (data.profile) {
      sql += `, profile = ?`;
      values.push(data.profile);
    }

    sql += ` WHERE id = ?`;
    values.push(id);

    //conn.query(sql, values, callback);
    const [results] = await conn.query(sql, values);
    return [results.affectedRows > 0];
  },
};

module.exports = Employee;
