import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireSuperAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const createSchema = z.object({
  matchName: z.string().trim().min(3).max(200),
  prediction: z.string().trim().min(1).max(200),
  odds: z.number().positive().max(10000).optional(),
  category: z.enum(["FREE", "PREMIUM"]).default("FREE"),
  kickoffAt: z.string().datetime().optional()
});

router.get("/", async (_req, res) => {
  const tips = await prisma.tip.findMany({
    include: { tipster: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
    take: 100
  });
  res.json({ tips });
});

router.post("/", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid tip details" });

  const data = parsed.data;
  const tip = await prisma.tip.create({
    data: {
      tipsterId: req.user.id,
      matchName: data.matchName,
      prediction: data.prediction,
      odds: data.odds,
      category: data.category,
      kickoffAt: data.kickoffAt ? new Date(data.kickoffAt) : undefined
    }
  });
  res.status(201).json({ tip });
});

router.patch("/:id/result", requireSuperAdmin, async (req, res) => {
  const schema = z.object({ result: z.enum(["PENDING", "WON", "LOST", "VOID"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid result" });

  try {
    const tip = await prisma.tip.update({
      where: { id: req.params.id },
      data: { result: parsed.data.result }
    });
    res.json({ tip });
  } catch {
    res.status(404).json({ error: "Tip not found" });
  }
});

export default router;
