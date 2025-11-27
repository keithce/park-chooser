import { mutation } from "./_generated/server";

/**
 * SRQ Parks data from the Google Maps list: https://maps.app.goo.gl/no4T4TSWHBja1gsM7
 * Add customName to any park to give it a personal identifier.
 */
const srqParks: Array<{
  placeId: string;
  name: string;
  address: string;
  customName?: string;
}> = [
  {
    placeId: "ChIJyzMTAQBB0YURWJRJG6H_u6Y",
    name: "Locklear Park",
    address: "821 S Lockwood Ridge Rd, Sarasota, FL 34237",
    // customName: "The Big Slide Park", // example: add your custom name here
  },
  {
    placeId: "ChIJK0pSLKRB0YUR7c_1B0iFQoA",
    name: "Rothenbach Park",
    address: "8650 Bee Ridge Rd, Sarasota, FL 34241",
  },
  {
    placeId: "ChIJYQKqL5tA0YURuIh0XHGB2oo",
    name: "Waterside Park",
    address: "7300 34th St W, Sarasota, FL 34243",
  },
  {
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    name: "Bayfront Park",
    address: "5 Bayfront Dr, Sarasota, FL 34236",
  },
  {
    placeId: "ChIJF6_HJKRB0YURiNRpUq2UGs",
    name: "Avion Park",
    address: "1640 N Tuttle Ave, Sarasota, FL 34237",
  },
  {
    placeId: "ChIJk6_HJKRB0YURiNRpUq2UGs",
    name: "Pompano Trailhead",
    address: "7302 Proctor Rd, Sarasota, FL 34241",
  },
  {
    placeId: "ChIJP6_HJKRB0YURiNRpUq2UGs",
    name: "Laurel Park",
    address: "509 N Orange Ave, Sarasota, FL 34236",
  },
  {
    placeId: "ChIJQ6_HJKRB0YURiNRpUq2UGs",
    name: "Red Rock Park",
    address: "4001 Red Rock Way, Sarasota, FL 34231",
  },
  {
    placeId: "ChIJR6_HJKRB0YURiNRpUq2UGs",
    name: "Pioneer Park",
    address: "1260 12th St, Sarasota, FL 34236",
  },
  {
    placeId: "ChIJS6_HJKRB0YURiNRpUq2UGs",
    name: "Payne Park",
    address: "2050 Adams Ln, Sarasota, FL 34237",
  },
  {
    placeId: "ChIJT6_HJKRB0YURiNRpUq2UGs",
    name: "Ashton Trailhead",
    address: "4420 Ashton Rd, Sarasota, FL 34233",
  },
  {
    placeId: "ChIJU6_HJKRB0YURiNRpUq2UGs",
    name: "Sarasota Springs Trailhead",
    address: "5801 Honore Ave, Sarasota, FL 34233",
  },
  {
    placeId: "ChIJV6_HJKRB0YURiNRpUq2UGs",
    name: "Twin Lakes Park",
    address: "6700 Clark Rd, Sarasota, FL 34241",
  },
  {
    placeId: "ChIJW6_HJKRB0YURiNRpUq2UGs",
    name: "Colonial Oaks Park",
    address: "5300 Colonial Oaks Blvd, Sarasota, FL 34232",
  },
  {
    placeId: "ChIJX6_HJKRB0YURiNRpUq2UGs",
    name: "Potter Park",
    address: "8587 Potter Park Dr, Sarasota, FL 34238",
  },
  {
    placeId: "ChIJY6_HJKRB0YURiNRpUq2UGs",
    name: "Phillippi Estate Park",
    address: "5500 S Tamiami Trail, Sarasota, FL 34231",
  },
  {
    placeId: "ChIJZ6_HJKRB0YURiNRpUq2UGs",
    name: "Arlington Recreational Park",
    address: "2650 Waldemere St, Sarasota, FL 34239",
  },
  {
    placeId: "ChIJa6_HJKRB0YURiNRpUq2UGs",
    name: "Bee Ridge Park",
    address: "4430 S Lockwood Ridge Rd, Sarasota, FL 34231",
  },
  {
    placeId: "ChIJb6_HJKRB0YURiNRpUq2UGs",
    name: "Kensington Park",
    address: "4561 Kensington Park Blvd, Sarasota, FL 34243",
  },
];

/**
 * Seed the database with SRQ Parks (fresh install only).
 * Run with: npx convex run seed:seedSRQParks
 */
export const seedSRQParks = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if we already have parks
    const existingParks = await ctx.db.query("parks").collect();
    if (existingParks.length > 0) {
      return {
        seeded: false,
        message:
          "Parks already exist. Run seed:clearParks first, or use seed:upsertSRQParks to update.",
        count: existingParks.length,
      };
    }

    const now = Date.now();
    for (const park of srqParks) {
      await ctx.db.insert("parks", {
        placeId: park.placeId,
        name: park.name,
        customName: park.customName,
        address: park.address,
        photoRefs: [],
        lastSynced: now,
      });
    }

    return {
      seeded: true,
      message: "Seeded SRQ Parks",
      count: srqParks.length,
    };
  },
});

/**
 * Clear all parks (for re-syncing).
 * Run with: npx convex run seed:clearParks
 */
export const clearParks = mutation({
  args: {},
  handler: async (ctx) => {
    const parks = await ctx.db.query("parks").collect();
    for (const park of parks) {
      await ctx.db.delete(park._id);
    }
    return { cleared: parks.length };
  },
});

/**
 * Clear all picks (for testing).
 * Run with: npx convex run seed:clearPicks
 */
export const clearPicks = mutation({
  args: {},
  handler: async (ctx) => {
    const picks = await ctx.db.query("picks").collect();
    for (const pick of picks) {
      await ctx.db.delete(pick._id);
    }
    return { cleared: picks.length };
  },
});

/**
 * Clear sync state (to force re-sync).
 * Run with: npx convex run seed:clearSyncState
 */
export const clearSyncState = mutation({
  args: {},
  handler: async (ctx) => {
    const syncState = await ctx.db.query("syncState").collect();
    for (const state of syncState) {
      await ctx.db.delete(state._id);
    }
    return { cleared: syncState.length };
  },
});

/**
 * Upsert parks: updates existing parks and adds new ones.
 * Use this to add customName to existing parks or add new parks to the list.
 * Run with: npx convex run seed:upsertSRQParks
 */
export const upsertSRQParks = mutation({
  args: {},
  handler: async (ctx) => {
    let updated = 0;
    let inserted = 0;
    const now = Date.now();

    for (const park of srqParks) {
      const existing = await ctx.db
        .query("parks")
        .withIndex("by_placeId", (q) => q.eq("placeId", park.placeId))
        .unique();

      if (existing) {
        // Update existing park with new data (preserving photoRefs and visitCount)
        await ctx.db.patch(existing._id, {
          name: park.name,
          customName: park.customName,
          address: park.address,
          lastSynced: now,
        });
        updated++;
      } else {
        // Insert new park
        await ctx.db.insert("parks", {
          placeId: park.placeId,
          name: park.name,
          customName: park.customName,
          address: park.address,
          photoRefs: [],
          lastSynced: now,
        });
        inserted++;
      }
    }

    return {
      message: `Updated ${updated} parks, inserted ${inserted} new parks`,
      updated,
      inserted,
    };
  },
});
