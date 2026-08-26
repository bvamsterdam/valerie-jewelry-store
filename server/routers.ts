import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  addCartLines,
  createCart,
  getCatalog,
  getProduct,
  isShopifyConfigured,
  removeCartLine,
  updateCartLine,
} from "./shopify";

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
  storefront: router({
    status: publicProcedure.query(() => ({
      configured: isShopifyConfigured(),
    })),
    catalog: publicProcedure.query(() => getCatalog()),
    product: publicProcedure
      .input(z.object({ handle: z.string().min(1).max(255) }))
      .query(({ input }) => getProduct(input.handle)),
    cartCreate: publicProcedure
      .input(
        z.object({
          merchandiseId: z.string().min(1),
          quantity: z.number().int().min(1).max(20).default(1),
        }),
      )
      .mutation(({ input }) => createCart(input.merchandiseId, input.quantity)),
    cartLinesAdd: publicProcedure
      .input(
        z.object({
          cartId: z.string().min(1),
          merchandiseId: z.string().min(1),
          quantity: z.number().int().min(1).max(20).default(1),
        }),
      )
      .mutation(({ input }) =>
        addCartLines(input.cartId, input.merchandiseId, input.quantity),
      ),
    cartLineUpdate: publicProcedure
      .input(
        z.object({
          cartId: z.string().min(1),
          lineId: z.string().min(1),
          quantity: z.number().int().min(1).max(20),
        }),
      )
      .mutation(({ input }) =>
        updateCartLine(input.cartId, input.lineId, input.quantity),
      ),
    cartLineRemove: publicProcedure
      .input(z.object({ cartId: z.string().min(1), lineId: z.string().min(1) }))
      .mutation(({ input }) => removeCartLine(input.cartId, input.lineId)),
  }),
});

export type AppRouter = typeof appRouter;
