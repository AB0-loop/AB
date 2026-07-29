import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/** Consultation requests submitted through the booking form. */
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 160 }),
  city: varchar("city", { length: 160 }).notNull(),
  preferredDate: varchar("preferred_date", { length: 40 }),
  requirement: varchar("requirement", { length: 160 }).notNull(),
  notes: text("notes"),
  source: varchar("source", { length: 40 }).default("website").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
