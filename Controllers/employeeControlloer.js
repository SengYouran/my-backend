const Employee = require("../Models/employees");
const Useraccount = require("../Models/useraccount");
const Employee_Salary = require("../Models/salary");
const db = require("../db");

// GET all
exports.getAllEmployees = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  try {
    const rows = await Employee.getAll(page, limit);
    res.status(200).json(rows);
  } catch (err) {
    console.error("GET EMPLOYEES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};
//GET One
exports.getOneEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await Employee.getOneEmp(id);
    if (!rows) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(rows);
  } catch (err) {
    console.error("GET EMPLOYEES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch a employee" });
  }
};

// INSERT
exports.insertEmployees = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      emp_id,
      first_name,
      last_name,
      gender,
      dob,
      status,
      hire_date,
      telephone,
      address,
      description,
      is_active,
      email,
      password,
      roles,
      salary,
      experience,
    } = req.body;

    const profile = req.file ? req.file.filename : "default.png";
    const empSalary = salary ? parseFloat(salary) : 0;

    // 1 Insert employee
    const empResult = await Employee.insert(connection, {
      emp_id,
      first_name,
      last_name,
      profile,
      gender,
      dob,
      status,
      hire_date,
      telephone,
      address,
      description,
      is_active: is_active ?? 1,
    });

    const employee_id = empResult.id;

    // 2 Insert user account
    await Useraccount.insert(connection, {
      employee_id,
      email,
      password,
      roles,
    });

    // 3 Insert salary
    await Employee_Salary.insert(connection, {
      employee_id,
      hire_date,
      salary: empSalary,
      experience,
    });

    await connection.commit();

    res.status(201).json({
      message: "In sert successful ✅",
      employee_id,
    });
  } catch (err) {
    await connection.rollback();
    console.error("INSERT EMPLOYEE ERROR:", err);

    res.status(500).json({
      message: err.sqlMessage || err.message,
    });
  } finally {
    connection.release();
  }
};

// UPDATE (transaction)
exports.updateEmployees = async (req, res) => {
  const { id } = req.params;
  const {
    emp_id,
    first_name,
    last_name,
    gender,
    dob,
    status,
    hire_date,
    telephone,
    address,
    description,
    is_active,
    email,
    roles,
    salary,
    experience,
  } = req.body;

  const profile = req.file ? req.file.filename : undefined;
  const empSalary = salary ? parseFloat(salary) : 0;

  let conn;

  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    // 1 Update employee
    const updated = await Employee.update(conn, id, {
      emp_id,
      first_name,
      last_name,
      profile,
      gender,
      dob,
      status,
      hire_date,
      telephone,
      address,
      description,
      is_active: is_active ?? 1,
    });
    if (!updated) {
      throw new Error("Employee not found");
    }

    // 2 Update user account
    await Useraccount.updateByEmployeeId(conn, id, {
      email,
      roles,
    });

    // 3 Update salary
    await Employee_Salary.updateByEmployeeId(conn, id, {
      hire_date,
      salary: empSalary,
      experience,
    });

    // COMMIT
    await conn.commit();
    res.json({ message: "Update successful" });
  } catch (err) {
    if (conn) await conn.rollback();
    res.status(500).json({
      message: err.message || "Update transaction failed",
    });
  } finally {
    if (conn) conn.release();
  }
};

// DELETE employee (soft delete all related tables)
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  let conn;

  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    // Soft delete employee
    await conn.query(`UPDATE employee_tbl SET is_active = 0 WHERE id = ?`, [
      id,
    ]);

    // Soft delete useraccount
    await conn.query(
      `UPDATE useraccount SET is_active = 0 WHERE employee_id = ?`,
      [id],
    );

    //  Soft delete salary
    await conn.query(
      `UPDATE salary_tbl SET is_active = 0 WHERE employee_id = ?`,
      [id],
    );

    // COMMIT
    await conn.commit();
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    if (conn) await conn.rollback();
    res.status(500).json({
      message: err.message || "Delete transaction failed",
    });
  } finally {
    if (conn) conn.release();
  }
};
