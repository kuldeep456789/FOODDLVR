import { randomUUID } from "crypto";
import { query } from "../config/db.js";

const mapPaymentRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    orderId: row.order_id,
    userId: row.user_id,
    provider: row.provider,
    sessionId: row.session_id,
    status: row.status,
    currency: row.currency,
    amount: Number(row.amount),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

class paymentModel {
  constructor(data = {}) {
    this._id = data._id || data.id || randomUUID();
    this.orderId = data.orderId || data.order_id;
    this.userId = data.userId || data.user_id;
    this.provider = data.provider || "stripe";
    this.sessionId = data.sessionId || data.session_id || null;
    this.status = data.status || "pending";
    this.currency = data.currency || "usd";
    this.amount = data.amount;
  }

  async save() {
    return paymentModel.upsertByOrderId(this);
  }

  static async upsertByOrderId(paymentData = {}) {
    const payment =
      paymentData instanceof paymentModel
        ? paymentData
        : new paymentModel(paymentData);

    const result = await query(
      `
        INSERT INTO payments (id, order_id, user_id, provider, session_id, status, currency, amount)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (order_id) DO UPDATE SET
          user_id = EXCLUDED.user_id,
          provider = EXCLUDED.provider,
          session_id = EXCLUDED.session_id,
          status = EXCLUDED.status,
          currency = EXCLUDED.currency,
          amount = EXCLUDED.amount,
          updated_at = NOW()
        RETURNING *;
      `,
      [
        payment._id,
        payment.orderId,
        payment.userId,
        payment.provider,
        payment.sessionId,
        payment.status,
        payment.currency,
        payment.amount,
      ]
    );

    return mapPaymentRow(result.rows[0]);
  }

  static async findByOrderId(orderId) {
    if (!orderId) {
      return null;
    }

    const result = await query(
      `
        SELECT * FROM payments
        WHERE order_id = $1
        LIMIT 1;
      `,
      [orderId]
    );

    return mapPaymentRow(result.rows[0]);
  }

  static async findBySessionId(sessionId) {
    if (!sessionId) {
      return null;
    }

    const result = await query(
      `
        SELECT * FROM payments
        WHERE session_id = $1
        LIMIT 1;
      `,
      [sessionId]
    );

    return mapPaymentRow(result.rows[0]);
  }

  static async updateByOrderId(orderId, updates = {}) {
    const parts = [];
    const values = [];

    const pushUpdate = (column, value) => {
      values.push(value);
      parts.push(`${column} = $${values.length}`);
    };

    if (Object.prototype.hasOwnProperty.call(updates, "userId")) {
      pushUpdate("user_id", updates.userId);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "provider")) {
      pushUpdate("provider", updates.provider);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "sessionId")) {
      pushUpdate("session_id", updates.sessionId);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "status")) {
      pushUpdate("status", updates.status);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "currency")) {
      pushUpdate("currency", updates.currency);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "amount")) {
      pushUpdate("amount", updates.amount);
    }

    if (parts.length === 0) {
      return this.findByOrderId(orderId);
    }

    values.push(orderId);
    const result = await query(
      `
        UPDATE payments
        SET ${parts.join(", ")}, updated_at = NOW()
        WHERE order_id = $${values.length}
        RETURNING *;
      `,
      values
    );

    return mapPaymentRow(result.rows[0]);
  }

  static async deleteByOrderId(orderId) {
    if (!orderId) {
      return null;
    }

    const result = await query(
      `
        DELETE FROM payments
        WHERE order_id = $1
        RETURNING *;
      `,
      [orderId]
    );

    return mapPaymentRow(result.rows[0]);
  }
}

export default paymentModel;
