import { pgTable, text, timestamp, integer, boolean, serial, varchar, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Roles table
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(), // 'user', 'admin', etc.
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  avatar: text('avatar'),
  phone: varchar('phone', { length: 20 }),
  roleId: integer('role_id').notNull().references(() => roles.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  roleIdIdx: index('role_id_idx').on(table.roleId),
}))

// Movie lists (containers/folders for organizing movies)
export const movieLists = pgTable('movie_lists', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(), // e.g., "My Favorites", "Watch Later"
  description: text('description'),
  isDefault: boolean('is_default').default(false).notNull(), // e.g., default "My List"
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('movie_lists_user_id_idx').on(table.userId),
}))

// Movie list items (the actual movies in a list)
export const movieListItems = pgTable('movie_list_items', {
  id: serial('id').primaryKey(),
  listId: integer('list_id').notNull().references(() => movieLists.id, { onDelete: 'cascade' }),
  omdbId: varchar('omdb_id', { length: 50 }).notNull(), // OMDB ID (e.g., tt1375666)
  addedAt: timestamp('added_at').defaultNow().notNull(),
  // Optional: Cache some movie data to avoid constant OMDB calls
  movieTitle: varchar('movie_title', { length: 500 }),
  moviePoster: text('movie_poster'),
  movieYear: varchar('movie_year', { length: 10 }),
  movieType: varchar('movie_type', { length: 20 }), // movie, series, episode
}, (table) => ({
  listIdIdx: index('movie_list_items_list_id_idx').on(table.listId),
  omdbIdIdx: index('movie_list_items_omdb_id_idx').on(table.omdbId),
  listMovieIdx: index('movie_list_items_list_movie_idx').on(table.listId, table.omdbId),
}))

// Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  omdbId: varchar('omdb_id', { length: 50 }).notNull(), // OMDB ID
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment').notNull(),
  likes: integer('likes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('reviews_user_id_idx').on(table.userId),
  omdbIdIdx: index('reviews_omdb_id_idx').on(table.omdbId),
  createdAtIdx: index('reviews_created_at_idx').on(table.createdAt),
}))

// Review likes table (to track which users liked which reviews)
export const reviewLikes = pgTable('review_likes', {
  id: serial('id').primaryKey(),
  reviewId: integer('review_id').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  reviewUserIdx: index('review_likes_review_user_idx').on(table.reviewId, table.userId),
  userIdIdx: index('review_likes_user_id_idx').on(table.userId),
}))

// Payment types table (credit_card, debit_card, paypal, etc.)
export const paymentTypes = pgTable('payment_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(), // 'credit_card', 'debit_card', 'paypal'
  displayName: varchar('display_name', { length: 100 }).notNull(), // 'Credit Card', 'Debit Card', 'PayPal'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Payment methods table
export const paymentMethods = pgTable('payment_methods', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  paymentTypeId: integer('payment_type_id').notNull().references(() => paymentTypes.id),
  cardLast4: varchar('card_last4', { length: 4 }), // Last 4 digits of card
  cardBrand: varchar('card_brand', { length: 50 }), // 'visa', 'mastercard', etc.
  expiryMonth: varchar('expiry_month', { length: 2 }),
  expiryYear: varchar('expiry_year', { length: 4 }),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('payment_methods_user_id_idx').on(table.userId),
  paymentTypeIdIdx: index('payment_methods_type_id_idx').on(table.paymentTypeId),
}))

// Subscription plans table
export const subscriptionPlans = pgTable('subscription_plans', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(), // 'Basic', 'Standard', 'Premium'
  description: text('description'),
  price: integer('price').notNull(), // Price in cents (e.g., 999 = $9.99)
  billingPeriod: varchar('billing_period', { length: 20 }).notNull().default('monthly'), // 'monthly', 'yearly'
  features: text('features'), // JSON string with plan features
  maxDevices: integer('max_devices').default(1).notNull(),
  maxQuality: varchar('max_quality', { length: 20 }).default('HD').notNull(), // 'SD', 'HD', '4K'
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// User subscriptions table
export const userSubscriptions = pgTable('user_subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: integer('plan_id').notNull().references(() => subscriptionPlans.id),
  status: varchar('status', { length: 20 }).notNull().default('active'), // 'active', 'cancelled', 'expired', 'trial'
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date'), // Null for ongoing subscriptions
  autoRenew: boolean('auto_renew').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_subscriptions_user_id_idx').on(table.userId),
  planIdIdx: index('user_subscriptions_plan_id_idx').on(table.planId),
  statusIdx: index('user_subscriptions_status_idx').on(table.status),
}))

// Relations
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  movieLists: many(movieLists),
  reviews: many(reviews),
  reviewLikes: many(reviewLikes),
  paymentMethods: many(paymentMethods),
  subscriptions: many(userSubscriptions),
}))

export const movieListsRelations = relations(movieLists, ({ one, many }) => ({
  user: one(users, {
    fields: [movieLists.userId],
    references: [users.id],
  }),
  items: many(movieListItems),
}))

export const movieListItemsRelations = relations(movieListItems, ({ one }) => ({
  list: one(movieLists, {
    fields: [movieListItems.listId],
    references: [movieLists.id],
  }),
}))

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  likes: many(reviewLikes),
}))

export const reviewLikesRelations = relations(reviewLikes, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewLikes.reviewId],
    references: [reviews.id],
  }),
  user: one(users, {
    fields: [reviewLikes.userId],
    references: [users.id],
  }),
}))

export const paymentTypesRelations = relations(paymentTypes, ({ many }) => ({
  paymentMethods: many(paymentMethods),
}))

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
  paymentType: one(paymentTypes, {
    fields: [paymentMethods.paymentTypeId],
    references: [paymentTypes.id],
  }),
}))

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(userSubscriptions),
}))

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [userSubscriptions.userId],
    references: [users.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [userSubscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}))

