import { randomUUID } from "crypto";
import { query } from "../config/db.js";

const mapUserRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    cartData: row.cart_data ?? {},
    createdAt: row.created_at,
  };
};

const toJsonValue = (value) => JSON.stringify(value ?? {});

class userModel {
  constructor(data = {}) {
    this._id = data._id || data.id || randomUUID();
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || "user";
    this.cartData = data.cartData ?? data.cart_data ?? {};
  }

  async save() {
    const result = await query(
      `
        INSERT INTO users (id, name, email, password, role, cart_data)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `,
      [
        this._id,
        this.name,
        this.email,
        this.password,
        this.role,
        toJsonValue(this.cartData),
      ]
    );

    return mapUserRow(result.rows[0]);
  }

  static async findOne(filter = {}) {
    if (!filter.email) {
      return null;
    }

    const result = await query(
      `
        SELECT * FROM users
        WHERE email = $1
        LIMIT 1;
      `,
      [filter.email]
    );

    return mapUserRow(result.rows[0]);
  }

  static async findById(id) {
    if (!id) {
      return null;
    }

    const result = await query(
      `
        SELECT * FROM users
        WHERE id = $1
        LIMIT 1;
      `,
      [id]
    );

    return mapUserRow(result.rows[0]);
  }

  static async findByIdAndUpdate(id, updates = {}) {
    const parts = [];
    const values = [];

    const pushUpdate = (column, value) => {
      values.push(value);
      parts.push(`${column} = $${values.length}`);
    };

    if (Object.prototype.hasOwnProperty.call(updates, "name")) {
      pushUpdate("name", updates.name);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "email")) {
      pushUpdate("email", updates.email);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "password")) {
      pushUpdate("password", updates.password);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "role")) {
      pushUpdate("role", updates.role);
    }
    if (
      Object.prototype.hasOwnProperty.call(updates, "cartData") ||
      Object.prototype.hasOwnProperty.call(updates, "cart_data")
    ) {
      pushUpdate(
        "cart_data",
        toJsonValue(updates.cartData ?? updates.cart_data ?? {})
      );
    }

    if (parts.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `
        UPDATE users
        SET ${parts.join(", ")}
        WHERE id = $${values.length}
        RETURNING *;
      `,
      values
    );

    return mapUserRow(result.rows[0]);
  }

  static async findByIdAndDelete(id) {
    if (!id) {
      return null;
    }

    const result = await query(
      `
        DELETE FROM users
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );

    return mapUserRow(result.rows[0]);
  }
}

export default userModel;
