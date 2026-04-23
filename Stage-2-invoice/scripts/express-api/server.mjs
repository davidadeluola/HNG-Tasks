import express from "express";
import cors from "cors";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "data", "invoices.json");
const PORT = Number(process.env.API_PORT || 4000);

const ALLOWED_STATUS = new Set(["draft", "pending", "paid"]);

const app = express();
app.use(cors());
app.use(express.json());

async function readStore() {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed || !Array.isArray(parsed.invoices)) {
      return { invoices: [] };
    }
    return parsed;
  } catch {
    return { invoices: [] };
  }
}

async function writeStore(store) {
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2) + "\n", "utf-8");
}

function makeId() {
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26))
    + String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}${numbers}`;
}

function invoiceTotal(items) {
  return items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0);
}

function hydrateItems(items) {
  return items.map((item) => ({
    ...item,
    total: Number(item.quantity) * Number(item.price),
  }));
}

function addDays(isoDate, days) {
  const source = new Date(isoDate);
  const target = new Date(source);
  target.setDate(source.getDate() + Number(days));
  return target.toISOString().slice(0, 10);
}

function validateInput(payload) {
  const errors = [];

  if (!payload || typeof payload !== "object") {
    errors.push("Body must be an object.");
    return errors;
  }

  if (!payload.clientName || !String(payload.clientName).trim()) {
    errors.push("clientName is required.");
  }

  if (!payload.clientEmail || !String(payload.clientEmail).trim()) {
    errors.push("clientEmail is required.");
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.push("At least one invoice item is required.");
  }

  if (Array.isArray(payload.items)) {
    payload.items.forEach((item, index) => {
      if (!item.name || !String(item.name).trim()) {
        errors.push(`items[${index}].name is required.`);
      }
      if (!(Number(item.quantity) > 0)) {
        errors.push(`items[${index}].quantity must be greater than zero.`);
      }
      if (!(Number(item.price) > 0)) {
        errors.push(`items[${index}].price must be greater than zero.`);
      }
    });
  }

  return errors;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "invoice-express-api" });
});

app.get("/api/invoices", async (req, res) => {
  const store = await readStore();
  const status = String(req.query.status || "").trim();

  if (!status) {
    res.json(store.invoices);
    return;
  }

  const filters = status.split(",").map((value) => value.trim()).filter(Boolean);
  const filtered = store.invoices.filter((invoice) => filters.includes(invoice.status));
  res.json(filtered);
});

app.get("/api/invoices/:id", async (req, res) => {
  const store = await readStore();
  const target = store.invoices.find((invoice) => invoice.id === req.params.id);

  if (!target) {
    res.status(404).json({ message: "Invoice not found." });
    return;
  }

  res.json(target);
});

app.post("/api/invoices", async (req, res) => {
  const status = req.body.status || "pending";
  const errors = validateInput(req.body);

  if (!ALLOWED_STATUS.has(status)) {
    errors.push("status must be draft, pending, or paid.");
  }

  if (errors.length > 0) {
    res.status(400).json({ message: "Validation failed.", errors });
    return;
  }

  const store = await readStore();
  const invoice = {
    ...req.body,
    id: makeId(),
    status,
    paymentDue: addDays(req.body.createdAt, req.body.paymentTerms),
    items: hydrateItems(req.body.items),
    total: invoiceTotal(req.body.items),
  };

  store.invoices.unshift(invoice);
  await writeStore(store);
  res.status(201).json(invoice);
});

app.put("/api/invoices/:id", async (req, res) => {
  const status = req.body.status || "pending";
  const errors = validateInput(req.body);

  if (!ALLOWED_STATUS.has(status)) {
    errors.push("status must be draft, pending, or paid.");
  }

  if (errors.length > 0) {
    res.status(400).json({ message: "Validation failed.", errors });
    return;
  }

  const store = await readStore();
  const index = store.invoices.findIndex((invoice) => invoice.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ message: "Invoice not found." });
    return;
  }

  const existing = store.invoices[index];
  const nextStatus = existing.status === "paid" ? "paid" : status;

  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    status: nextStatus,
    paymentDue: addDays(req.body.createdAt, req.body.paymentTerms),
    items: hydrateItems(req.body.items),
    total: invoiceTotal(req.body.items),
  };

  store.invoices[index] = updated;
  await writeStore(store);
  res.json(updated);
});

app.patch("/api/invoices/:id/mark-paid", async (req, res) => {
  const store = await readStore();
  const index = store.invoices.findIndex((invoice) => invoice.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ message: "Invoice not found." });
    return;
  }

  store.invoices[index] = {
    ...store.invoices[index],
    status: "paid",
  };

  await writeStore(store);
  res.json(store.invoices[index]);
});

app.delete("/api/invoices/:id", async (req, res) => {
  const store = await readStore();
  const next = store.invoices.filter((invoice) => invoice.id !== req.params.id);

  if (next.length === store.invoices.length) {
    res.status(404).json({ message: "Invoice not found." });
    return;
  }

  store.invoices = next;
  await writeStore(store);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Invoice API listening on http://localhost:${PORT}`);
});
