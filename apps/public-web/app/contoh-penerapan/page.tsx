import type { Metadata } from "next";
import RecommendationDashboard from "./RecommendationDashboard";

export const metadata: Metadata = { title: "Dashboard Rekomendasi QIRA", description: "Lihat cara QIRA membantu berdasarkan masalah bisnis yang Anda ceritakan." };

export default function RecommendationPage() { return <RecommendationDashboard />; }
