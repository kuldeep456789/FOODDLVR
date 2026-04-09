import { randomUUID } from "crypto";
import { query } from "../config/db.js";

const mapRestaurantRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    description: row.description,
    location: row.location,
    image: row.image,
    rating: Number(row.rating),
    isOpen: row.is_open,
    openingHours: row.opening_hours,
    createdAt: row.created_at,
  };
};

class restaurantModel {
  constructor(data = {}) {
    this._id = data._id || data.id || randomUUID();
    this.name = data.name;
    this.description = data.description;
    this.location = data.location;
    this.image = data.image || "";
    this.rating = data.rating ?? 4.5;
    this.isOpen = data.isOpen ?? data.is_open ?? true;
    this.openingHours = data.openingHours || data.opening_hours || "09:00-23:00";
  }

  static async find() {
    const result = await query(`
      SELECT * FROM restaurants
      ORDER BY created_at DESC;
    `);

    return result.rows.map(mapRestaurantRow);
  }

  static async findById(id) {
    if (!id) {
      return null;
    }

    const result = await query(
      `
        SELECT * FROM restaurants
        WHERE id = $1
        LIMIT 1;
      `,
      [id]
    );

    return mapRestaurantRow(result.rows[0]);
  }
}

export default restaurantModel;
