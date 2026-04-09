import validator from "validator";

const reject = (res, message) =>
  res.status(400).json({
    success: false,
    message,
  });

export const validateRegisterRequest = (req, res, next) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!name) {
    return reject(res, "Please enter your name.");
  }

  if (!validator.isEmail(email)) {
    return reject(res, "Please enter a valid email.");
  }

  if (password.length < 8) {
    return reject(res, "Please enter a strong password.");
  }

  req.body.name = name;
  req.body.email = email;
  req.body.password = password;
  next();
};

export const validateLoginRequest = (req, res, next) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!validator.isEmail(email)) {
    return reject(res, "Please enter a valid email.");
  }

  if (!password) {
    return reject(res, "Please enter your password.");
  }

  req.body.email = email;
  req.body.password = password;
  next();
};

export const validateFoodRequest = (req, res, next) => {
  const name = String(req.body.name || "").trim();
  const description = String(req.body.description || "").trim();
  const category = String(req.body.category || "").trim();
  const price = Number(req.body.price);

  if (!name) {
    return reject(res, "Food name is required.");
  }

  if (!description) {
    return reject(res, "Food description is required.");
  }

  if (!category) {
    return reject(res, "Food category is required.");
  }

  if (!Number.isFinite(price) || price <= 0) {
    return reject(res, "Food price must be a positive number.");
  }

  if (!req.file) {
    return reject(res, "Food image is required.");
  }

  req.body.name = name;
  req.body.description = description;
  req.body.category = category;
  req.body.price = price;
  next();
};

export const validateCheckoutRequest = (req, res, next) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const address = req.body.address;

  if (!items.length) {
    return reject(res, "Order items are required.");
  }

  if (!address || typeof address !== "object") {
    return reject(res, "Delivery address is required.");
  }

  req.body.items = items;
  next();
};

