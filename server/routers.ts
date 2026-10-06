import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createContentItem,
  deleteContentItem,
  listContentItems,
  updateContentItem,
} from "./db";

const contentType = z.enum(["event", "achievement", "topper", "faculty", "alumni", "gallery"]);
const contentFields = {
  type: contentType,
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).nullable().optional(),
  detail: z.string().max(255).nullable().optional(),
  dateLabel: z.string().max(255).nullable().optional(),
  sectionGroup: z.string().max(64).nullable().optional(),
  imageUrl: z.string().max(2000).nullable().optional(),
  color: z.string().max(64).nullable().optional(),
  sortOrder: z.number().int().min(0).default(0),
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  content: router({
    list: publicProcedure
      .input(z.object({ type: contentType.optional() }).optional())
      .query(({ input }) => listContentItems(input?.type)),
    create: adminProcedure
      .input(z.object(contentFields))
      .mutation(({ input }) => createContentItem(input)),
    update: adminProcedure
      .input(z.object({ id: z.number().int().positive(), data: z.object(contentFields).partial() }))
      .mutation(({ input }) => updateContentItem(input.id, input.data)),
    remove: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(({ input }) => deleteContentItem(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
