import express, { Router } from "express";
import authMiddleware, { IGetUserAuthInfoRequest } from "../../middleware";
import { prisma } from "@repo/db/client";

const chatRouter: Router = express.Router();

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    }
  | {
      type: "text";
      x1: number;
      y1: number;
      text: string | null;
    }
  | {
      type: "free";
      path: { x: number; y: number }[];
    };

chatRouter.get("/shapes/:roomId", async function (req: IGetUserAuthInfoRequest, res) {
  const roomId = req.params.roomId;

  try {
    const shapes = await prisma.shape.findMany({
      where: { roomId: Number(roomId) },
      select: {
        type: true,
        circle: true,
        free: true,
        line: true,
        rect: true,
        text: true,
      },
    });

    const result: Shape[] = shapes.map((shape) => {
      switch (shape.type) {
        case "rect":
          return {
            type: "rect",
            x: shape.rect?.x || 0,
            y: shape.rect?.y || 0,
            width: shape.rect?.width || 0,
            height: shape.rect?.height || 0,
          };
        case "line":
          return {
            type: "line",
            x1: shape.line?.x1 || 0,
            y1: shape.line?.y1 || 0,
            x2: shape.line?.x2 || 0,
            y2: shape.line?.y2 || 0,
          };
        case "circle":
          return {
            type: "circle",
            x: shape.circle?.x || 0,
            y: shape.circle?.y || 0,
            radius: shape.circle?.radius || 0,
          };
        case "text":
          return {
            type: "text",
            x1: shape.text?.x1 || 0,
            y1: shape.text?.y1 || 0,
            text: shape.text?.text || null,
          };
        case "free":
          // Safely parse `path` as an array of points
          const path = Array.isArray(shape.free?.path)
            ? shape.free!.path.map((point: any) => ({
                x: point.x || 0,
                y: point.y || 0,
              }))
            : [];
          return {
            type: "free",
            path,
          };
        default:
          throw new Error("Unknown shape type");
      }
    });

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default chatRouter;
