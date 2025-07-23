"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.protectedProcedure = exports.publicProcedure = exports.router = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const shared_1 = require("@fitness-tracker/shared");
const t = server_1.initTRPC.context().create();
exports.router = t.router;
exports.publicProcedure = t.procedure;
// Middleware to check if user is authenticated
const requireAuth = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
        },
    });
});
exports.protectedProcedure = t.procedure.use(requireAuth);
// User router
const userRouter = (0, exports.router)({
    getProfile: exports.protectedProcedure.query(async ({ ctx }) => {
        const userDoc = await ctx.db.collection('users').doc(ctx.user.uid).get();
        if (!userDoc.exists) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }
        return userDoc.data();
    }),
    updateProfile: exports.protectedProcedure
        .input(shared_1.userSchema.partial())
        .mutation(async ({ ctx, input }) => {
        await ctx.db.collection('users').doc(ctx.user.uid).update(input);
        const updatedDoc = await ctx.db.collection('users').doc(ctx.user.uid).get();
        return updatedDoc.data();
    }),
});
// Workout router
const workoutRouter = (0, exports.router)({
    create: exports.protectedProcedure
        .input(shared_1.workoutSchema)
        .mutation(async ({ ctx, input }) => {
        const workoutData = {
            ...input,
            userId: ctx.user.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const docRef = await ctx.db.collection('workouts').add(workoutData);
        return { id: docRef.id, ...workoutData };
    }),
    list: exports.protectedProcedure
        .input(zod_1.z.object({ limit: zod_1.z.number().optional() }))
        .query(async ({ ctx, input }) => {
        const query = ctx.db
            .collection('workouts')
            .where('userId', '==', ctx.user.uid)
            .orderBy('date', 'desc');
        if (input.limit) {
            query.limit(input.limit);
        }
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }),
    getById: exports.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ ctx, input }) => {
        const doc = await ctx.db.collection('workouts').doc(input.id).get();
        if (!doc.exists) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        }
        const data = doc.data();
        if (data?.userId !== ctx.user.uid) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN' });
        }
        return { id: doc.id, ...data };
    }),
    delete: exports.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(async ({ ctx, input }) => {
        const doc = await ctx.db.collection('workouts').doc(input.id).get();
        if (!doc.exists) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        }
        const data = doc.data();
        if (data?.userId !== ctx.user.uid) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN' });
        }
        await ctx.db.collection('workouts').doc(input.id).delete();
        return { success: true };
    }),
});
// Goal router
const goalRouter = (0, exports.router)({
    create: exports.protectedProcedure
        .input(shared_1.goalSchema)
        .mutation(async ({ ctx, input }) => {
        const goalData = {
            ...input,
            userId: ctx.user.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const docRef = await ctx.db.collection('goals').add(goalData);
        return { id: docRef.id, ...goalData };
    }),
    listActive: exports.protectedProcedure.query(async ({ ctx }) => {
        const snapshot = await ctx.db
            .collection('goals')
            .where('userId', '==', ctx.user.uid)
            .where('status', '==', 'active')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }),
    updateProgress: exports.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string(), value: zod_1.z.number() }))
        .mutation(async ({ ctx, input }) => {
        const doc = await ctx.db.collection('goals').doc(input.id).get();
        if (!doc.exists) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        }
        const data = doc.data();
        if (data?.userId !== ctx.user.uid) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN' });
        }
        await ctx.db.collection('goals').doc(input.id).update({
            currentValue: input.value,
            updatedAt: new Date(),
        });
        const updatedDoc = await ctx.db.collection('goals').doc(input.id).get();
        return { id: updatedDoc.id, ...updatedDoc.data() };
    }),
});
// Main app router
exports.appRouter = (0, exports.router)({
    user: userRouter,
    workout: workoutRouter,
    goal: goalRouter,
});
//# sourceMappingURL=trpc.js.map