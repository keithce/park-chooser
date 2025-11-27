"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

/**
 * Track a visit to a park when user clicks "Open in Google Maps".
 * This action wraps the internal mutation so it can be called via HTTP.
 */
export const trackVisit = action({
  args: { parkId: v.id("parks") },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.parks.incrementVisitCount, {
      parkId: args.parkId,
    });
  },
});
