import { lazy, Suspense, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import IntakeSection from "./components/intake/IntakeSection";
import Resources from "./components/Resources";
import ScheduleMatrix from "./components/ScheduleMatrix";
import Testimonials from "./components/Testimonials";
import { ThemeProvider } from "./lib/theme";

const ZoomDirectory = lazy(() => import("./components/ZoomDirectory"));

export default function App() {
  const [intake, setIntake] = useState<{ slot?: string; referral?: boolean }>({});

  const enroll = (slot: string, referral: boolean) => {
    setIntake({ slot, referral });
    document.getElementById("intake")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ThemeProvider>
      <Header />
      <main>
        <Hero />
        <ScheduleMatrix onEnroll={enroll} />
        <IntakeSection presetSlot={intake.slot} referral={intake.referral} />
        <Testimonials />
        <Resources />
        <Suspense fallback={<div className="h-96" />}>
          <ZoomDirectory />
        </Suspense>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
