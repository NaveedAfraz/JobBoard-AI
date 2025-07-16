import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { UserNotificationSettingsTable } from "./userNotificationSettings";

export const UserTable = pgTable("users", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  imageUrl: varchar().notNull(),
  email: varchar().unique().notNull(),
  password: varchar().notNull(),
  createdAt,
  updatedAt,
});

export const userNotificationSettingsRelation = relations(
  UserNotificationSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserNotificationSettingsTable.userId],
      references: [UserTable.id],
    }),
  })
);
