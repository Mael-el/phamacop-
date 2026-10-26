import type { NextConfig } from "next";

/**
 * Origines autorisées pour les ressources de développement (HMR, React Refresh).
 * La prévisualisation est servie depuis un hôte `*.e2b.app` qui change à chaque
 * session : on autorise le domaine entier pour éviter un rechargement à chaud
 * bloqué, qui laisserait le navigateur sur une version périmée du CSS.
 */
const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.e2b.app", "localhost:3000", "127.0.0.1:3000"],
};

export default nextConfig;
