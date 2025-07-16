import {
  pgTable,
  varchar,
  text,
  integer,
  pgEnum,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers";
import { OrganizationTable } from "./organization";
import { relations } from "drizzle-orm";
import { JobListingApplicationTable } from "./jobListingApplications";

export const wageIntervals = ["hourly", "yearly"] as const;
type WageInterval = (typeof wageIntervals)[number];
export const wageIntervalEnum = pgEnum(
  "job_listings_wage_interval",
  wageIntervals
);

export const locationRequirements = ["on-site", "remote", "hybrid"] as const;
type LocationRequirement = (typeof locationRequirements)[number];
export const locationRequirementEnum = pgEnum(
  "job_listings_location_requirement",
  locationRequirements
);

export const experienceLevels = [
  "entry-level",
  "mid-level",
  "senior-level",
] as const;
type ExperienceLevel = (typeof experienceLevels)[number];
export const experienceLevelEnum = pgEnum(
  "job_listings_experience_level",
  experienceLevels
);

export const jobListingStatuses = ["draft", "published", "delisted"] as const;
type JobListingStatus = (typeof jobListingStatuses)[number];
export const jobListingStatusEnum = pgEnum(
  "job_listings_status",
  jobListingStatuses
);

export const jobListingTypes = [
  "full-time",
  "part-time",
  "contract",
  "internship",
] as const;
type JobListingType = (typeof jobListingTypes)[number];
export const jobListingTypeEnum = pgEnum("job_listings_type", jobListingTypes);

export const JobListingTable = pgTable(
  "job_listings",
  {
    id: id,
    organizationId: varchar()
      .references(() => OrganizationTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    title: varchar().notNull(),
    description: text().notNull(),
    wage: integer().notNull(),
    wage_interval: wageIntervalEnum(),
    state_abbreviation: varchar(),
    city: varchar(),
    is_featured: boolean().notNull().default(false),
    location_requirement: locationRequirementEnum().notNull(),
    experience_level: experienceLevelEnum().notNull(),
    status: jobListingStatusEnum().notNull(),
    type: jobListingTypeEnum().notNull(),
    posted_at: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [index().on(table.state_abbreviation)]
);

export const jobListingReference = relations(JobListingTable, ({
  one , many 
}) => ({
      organization : one(OrganizationTable, {
        fields: [JobListingTable.organizationId],
        references: [OrganizationTable.id],
      }) ,
      applications : many(JobListingApplicationTable)       
    }
))