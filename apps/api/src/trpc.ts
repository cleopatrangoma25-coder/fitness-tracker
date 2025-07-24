import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import type { Context } from './context'
import { UserSchema, WorkoutSchema, GoalSchema, FitnessPlanSchema } from '@fitness-tracker/shared'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

// Middleware to check if user is authenticated
const requireAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

export const protectedProcedure = t.procedure.use(requireAuth)

// User router
const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userDoc = await ctx.db.collection('users').doc(ctx.user!.uid).get()
    if (!userDoc.exists) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    return userDoc.data()
  }),

  updateProfile: protectedProcedure
    .input(UserSchema.partial())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.collection('users').doc(ctx.user!.uid).update(input)
      const updatedDoc = await ctx.db.collection('users').doc(ctx.user!.uid).get()
      return updatedDoc.data()
    }),
})

// Workout router
const workoutRouter = router({
  create: protectedProcedure
    .input(WorkoutSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...workoutDataWithoutId } = input
      const workoutData = {
        ...workoutDataWithoutId,
        userId: ctx.user!.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const docRef = await ctx.db.collection('workouts').add(workoutData)
      return { id: docRef.id, ...workoutData }
    }),

  list: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .collection('workouts')
        .where('userId', '==', ctx.user!.uid)
        .orderBy('createdAt', 'desc')
      
      if (input.limit) {
        query.limit(input.limit)
      }
      
      const snapshot = await query.get()
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const doc = await ctx.db.collection('workouts').doc(input.id).get()
      if (!doc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const data = doc.data()
      if (data?.userId !== ctx.user!.uid) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      return { id: doc.id, ...data }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const doc = await ctx.db.collection('workouts').doc(input.id).get()
      if (!doc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const data = doc.data()
      if (data?.userId !== ctx.user!.uid) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      await ctx.db.collection('workouts').doc(input.id).delete()
      return { success: true }
    }),
})

// Goal router
const goalRouter = router({
  create: protectedProcedure
    .input(GoalSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...goalDataWithoutId } = input
      const goalData = {
        ...goalDataWithoutId,
        userId: ctx.user!.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const docRef = await ctx.db.collection('goals').add(goalData)
      return { id: docRef.id, ...goalData }
    }),

  listActive: protectedProcedure.query(async ({ ctx }) => {
    const snapshot = await ctx.db
      .collection('goals')
      .where('userId', '==', ctx.user!.uid)
      .where('status', '==', 'active')
      .get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }),

  updateProgress: protectedProcedure
    .input(z.object({ id: z.string(), value: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const doc = await ctx.db.collection('goals').doc(input.id).get()
      if (!doc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const data = doc.data()
      if (data?.userId !== ctx.user!.uid) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      
      await ctx.db.collection('goals').doc(input.id).update({
        currentValue: input.value,
        updatedAt: new Date(),
      })
      
      const updatedDoc = await ctx.db.collection('goals').doc(input.id).get()
      return { id: updatedDoc.id, ...updatedDoc.data() }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const doc = await ctx.db.collection('goals').doc(input.id).get()
      if (!doc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const data = doc.data()
      if (data?.userId !== ctx.user!.uid) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      await ctx.db.collection('goals').doc(input.id).delete()
      return { success: true }
    }),
})

// Plan router
const planRouter = router({
  create: protectedProcedure
    .input(FitnessPlanSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...planDataWithoutId } = input
      const planData = {
        ...planDataWithoutId,
        userId: ctx.user!.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const docRef = await ctx.db.collection('plans').add(planData)
      return { id: docRef.id, ...planData }
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const snapshot = await ctx.db
      .collection('plans')
      .where('userId', '==', ctx.user!.uid)
      .orderBy('createdAt', 'desc')
      .get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const doc = await ctx.db.collection('plans').doc(input.id).get()
      if (!doc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const data = doc.data()
      if (data?.userId !== ctx.user!.uid) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      return { id: doc.id, ...data }
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: FitnessPlanSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const doc = await ctx.db.collection('plans').doc(input.id).get()
      if (!doc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const data = doc.data()
      if (data?.userId !== ctx.user!.uid) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      
      await ctx.db.collection('plans').doc(input.id).update({
        ...input.data,
        updatedAt: new Date(),
      })
      
      const updatedDoc = await ctx.db.collection('plans').doc(input.id).get()
      return { id: updatedDoc.id, ...updatedDoc.data() }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const doc = await ctx.db.collection('plans').doc(input.id).get()
      if (!doc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const data = doc.data()
      if (data?.userId !== ctx.user!.uid) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      await ctx.db.collection('plans').doc(input.id).delete()
      return { success: true }
    }),

  activate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const doc = await ctx.db.collection('plans').doc(input.id).get()
      if (!doc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const data = doc.data()
      if (data?.userId !== ctx.user!.uid) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      
      // Deactivate all other plans first
      await ctx.db.collection('plans')
        .where('userId', '==', ctx.user!.uid)
        .where('isActive', '==', true)
        .get()
        .then(snapshot => {
          const batch = ctx.db.batch()
          snapshot.docs.forEach(doc => {
            batch.update(doc.ref, { isActive: false, updatedAt: new Date() })
          })
          return batch.commit()
        })
      
      // Activate the selected plan
      await ctx.db.collection('plans').doc(input.id).update({
        isActive: true,
        updatedAt: new Date(),
      })
      
      const updatedDoc = await ctx.db.collection('plans').doc(input.id).get()
      return { id: updatedDoc.id, ...updatedDoc.data() }
    }),
})

// Main app router
export const appRouter = router({
  user: userRouter,
  workout: workoutRouter,
  goal: goalRouter,
  plan: planRouter,
})

export type AppRouter = typeof appRouter 