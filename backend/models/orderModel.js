import { randomUUID } from "crypto";
import { DEFAULT_RESTAURANT_ID } from "../config/db.js";
import { query } from "../config/db.js";

const toJsonValue = (value) => JSON.stringify(value ?? {});

const mapOrderRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    restaurantId: row.restaurant_id,
    items: row.items ?? [],
    amount: Number(row.amount),
    address: row.address ?? {},
    status: row.status,
    payment: row.payment,
    date: row.created_at,
  };
};

class orderModel {
  constructor(data = {}) {
    this._id = data._id || data.id || randomUUID();
    this.userId = data.userId;
    this.restaurantId =
      data.restaurantId || data.restaurant_id || DEFAULT_RESTAURANT_ID;
    this.items = data.items ?? [];
    this.amount = data.amount;
    this.address = data.address ?? {};
    this.status = data.status || "Food Processing";
    this.payment = data.payment ?? false;
  }

  async save() {
    const result = await query(
      `
        INSERT INTO orders (id, user_id, restaurant_id, items, amount, address, status, payment)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `,
      [
        this._id,
        this.userId,
        this.restaurantId,
        toJsonValue(this.items),
        this.amount,
        toJsonValue(this.address),
        this.status,
        this.payment,
      ]
    );

    return mapOrderRow(result.rows[0]);
  }

  static async find(filter = {}) {
    const clauses = [];
    const values = [];

    if (filter.userId) {
      values.push(filter.userId);
      clauses.push(`user_id = $${values.length}`);
    }

    if (filter.restaurantId) {
      values.push(filter.restaurantId);
      clauses.push(`restaurant_id = $${values.length}`);
    }

    if (filter.status) {
      values.push(filter.status);
      clauses.push(`status = $${values.length}`);
    }

    if (Object.prototype.hasOwnProperty.call(filter, "payment")) {
      values.push(filter.payment);
      clauses.push(`payment = $${values.length}`);
    }

    const whereClause = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const result = await query(
      `
        SELECT * FROM orders
        ${whereClause}
        ORDER BY created_at DESC;
      `,
      values
    );

    return result.rows.map(mapOrderRow);
  }

  static async findById(id) {
    if (!id) {
      return null;
    }

    const result = await query(
      `
        SELECT * FROM orders
        WHERE id = $1
        LIMIT 1;
      `,
      [id]
    );

    return mapOrderRow(result.rows[0]);
  }

  static async findByIdAndUpdate(id, updates = {}) {
    const parts = [];
    const values = [];

    const pushUpdate = (column, value) => {
      values.push(value);
      parts.push(`${column} = $${values.length}`);
    };

    if (Object.prototype.hasOwnProperty.call(updates, "userId")) {
      pushUpdate("user_id", updates.userId);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "restaurantId")) {
      pushUpdate("restaurant_id", updates.restaurantId);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "items")) {
      pushUpdate("items", toJsonValue(updates.items));
    }
    if (Object.prototype.hasOwnProperty.call(updates, "amount")) {
      pushUpdate("amount", updates.amount);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "address")) {
      pushUpdate("address", toJsonValue(updates.address));
    }
    if (Object.prototype.hasOwnProperty.call(updates, "status")) {
      pushUpdate("status", updates.status);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "payment")) {
      pushUpdate("payment", updates.payment);
    }

    if (parts.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `
        UPDATE orders
        SET ${parts.join(", ")}
        WHERE id = $${values.length}
        RETURNING *;
      `,
      values
    );

    return mapOrderRow(result.rows[0]);
  }

  static async findByIdAndDelete(id) {
    if (!id) {
      return null;
    }

    const result = await query(
      `
        DELETE FROM orders
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );

    return mapOrderRow(result.rows[0]);
  }
}

export default orderModel;
