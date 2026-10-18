"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

type Point = readonly [number, number];

interface NodeSpec {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  emphasis?: boolean;
}

/*
 * A schematic of the stack named in the CV for the BKPM Investment Learning Center work:
 * Golang REST APIs in a microservices architecture, Redis for caching, RabbitMQ for
 * asynchronous processing (e.g. certificate generation) and PostgreSQL for data.
 * It is deliberately labelled "illustrative" in the hero: it is a drawing, not a claim
 * about a specific deployment.
 */
const NODES: NodeSpec[] = [
  { id: "client", x: 200, y: 84, w: 104, h: 32, label: "Client" },
  { id: "api", x: 200, y: 196, w: 172, h: 54, label: "REST API", sub: "Golang", emphasis: true },
  { id: "redis", x: 78, y: 330, w: 100, h: 34, label: "Redis" },
  { id: "pg", x: 200, y: 330, w: 112, h: 34, label: "PostgreSQL" },
  { id: "mq", x: 322, y: 330, w: 100, h: 34, label: "RabbitMQ" },
  { id: "jobs", x: 322, y: 432, w: 124, h: 34, label: "Background jobs" },
];

interface EdgeSpec {
  id: string;
  from: Point;
  to: Point;
  /** Seconds into each pulse cycle at which the pulse leaves `from`. */
  pulseAt: number;
}

const EDGES: EdgeSpec[] = [
  { id: "client-api", from: [200, 100], to: [200, 169], pulseAt: 0 },
  { id: "api-redis", from: [152, 223], to: [78, 313], pulseAt: 1.4 },
  { id: "api-pg", from: [200, 223], to: [200, 313], pulseAt: 1.4 },
  { id: "api-mq", from: [248, 223], to: [322, 313], pulseAt: 1.4 },
  { id: "mq-jobs", from: [322, 347], to: [322, 415], pulseAt: 2.8 },
];

const INK = "#062326";
const PAPER = "#F4F1EA";
const PULSE_SECONDS = 1.1;
const CYCLE_SECONDS = 6.4;

function Pulse({ from, to, at }: { from: Point; to: Point; at: number }) {
  const loop = { repeat: Infinity, repeatDelay: CYCLE_SECONDS - PULSE_SECONDS, delay: at + 2.2 };
  return (
    <motion.circle
      r={4}
      fill="#0A858C"
      initial={{ cx: from[0], cy: from[1], opacity: 0 }}
      animate={{ cx: [from[0], to[0]], cy: [from[1], to[1]], opacity: [0, 1, 1, 0] }}
      transition={{
        cx: { ...loop, duration: PULSE_SECONDS, ease: "easeInOut" },
        cy: { ...loop, duration: PULSE_SECONDS, ease: "easeInOut" },
        opacity: { ...loop, duration: PULSE_SECONDS, ease: "linear", times: [0, 0.18, 0.82, 1] },
      }}
    />
  );
}

/** Animated service-topology drawing used as the hero visual. Edges draw in, data pulses travel. */
export function ServiceTopology({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();

  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-labelledby="topology-title"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="topology-title">
        Illustrative backend architecture: a client calls a Golang REST API, which uses a Redis cache, a
        PostgreSQL database and a RabbitMQ queue that feeds background jobs.
      </title>

      {/* edges */}
      {EDGES.map((edge, i) => (
        <motion.path
          key={edge.id}
          d={`M${edge.from[0]} ${edge.from[1]} L${edge.to[0]} ${edge.to[1]}`}
          fill="none"
          stroke={INK}
          strokeWidth={1.25}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.9 + i * 0.14, ease: EASE_OUT }}
        />
      ))}

      {/* nodes */}
      {NODES.map((node, i) => {
        const left = node.x - node.w / 2;
        const top = node.y - node.h / 2;
        const textColor = node.emphasis ? PAPER : INK;
        return (
          <motion.g
            key={node.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 + i * 0.1, ease: EASE_OUT }}
          >
            <rect
              x={left}
              y={top}
              width={node.w}
              height={node.h}
              rx={node.h / 2}
              fill={node.emphasis ? INK : PAPER}
              stroke={INK}
              strokeWidth={1.25}
            />
            {node.sub ? (
              <>
                <text
                  x={node.x}
                  y={node.y - 6}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textColor}
                  fontSize={13}
                  letterSpacing="0.08em"
                  className="font-mono"
                >
                  {node.label.toUpperCase()}
                </text>
                <text
                  x={node.x}
                  y={node.y + 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#77DAD7"
                  fontSize={10.5}
                  letterSpacing="0.16em"
                  className="font-mono"
                >
                  {node.sub.toUpperCase()}
                </text>
              </>
            ) : (
              <text
                x={node.x}
                y={node.y + 0.5}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textColor}
                fontSize={11.5}
                letterSpacing="0.08em"
                className="font-mono"
              >
                {node.label.toUpperCase()}
              </text>
            )}
          </motion.g>
        );
      })}

      {/* travelling data pulses (skipped entirely with reduced motion) */}
      {reduce
        ? null
        : EDGES.map((edge) => <Pulse key={edge.id} from={edge.from} to={edge.to} at={edge.pulseAt} />)}
    </svg>
  );
}
