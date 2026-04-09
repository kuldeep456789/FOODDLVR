import { randomUUID } from "crypto";
import { DEFAULT_RESTAURANT_ID } from "../config/db.js";
import { query } from "../config/db.js";

const mapFoodRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    image: row.image,
    category: row.category,
    createdAt: row.created_at,
  };
};

class foodModel {
  constructor(data = {}) {
    this._id = data._id || data.id || randomUUID();
    this.restaurantId =
      data.restaurantId || data.restaurant_id || DEFAULT_RESTAURANT_ID;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.image = data.image;
    this.category = data.category;
  }

  async save() {
    const result = await query(
      `
        INSERT INTO foods (id, restaurant_id, name, description, price, image, category)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `,
      [
        this._id,
        this.restaurantId,
        this.name,
        this.description,
        this.price,
        this.image,
        this.category,
      ]
    );

    return mapFoodRow(result.rows[0]);
  }

  static async find(filter = {}) {
    const clauses = [];
    const values = [];

    if (filter.restaurantId) {
      values.push(filter.restaurantId);
      clauses.push(`restaurant_id = $${values.length}`);
    }

    if (filter.category) {
      values.push(filter.category);
      clauses.push(`category = $${values.length}`);
    }

    const whereClause = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const result = await query(
      `
        SELECT * FROM foods
        ${whereClause}
        ORDER BY created_at DESC;
      `,
      values
    );

    return result.rows.map(mapFoodRow);
  }

  static async findByRestaurantId(restaurantId) {
    return this.find({ restaurantId });
  }

  static async findById(id) {
    if (!id) {
      return null;
    }

    const result = await query(
      `
        SELECT * FROM foods
        WHERE id = $1
        LIMIT 1;
      `,
      [id]
    );

    return mapFoodRow(result.rows[0]);
  }

  static async findByIdAndDelete(id) {
    if (!id) {
      return null;
    }

    const result = await query(
      `
        DELETE FROM foods
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );

    return mapFoodRow(result.rows[0]);
  }
}

export default foodModel;
