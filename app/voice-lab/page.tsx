import VoicePersonasLab from "../../apps/web-replycontrol/app/voice-lab/page";

export const metadata = {
  title: "Voice Persona Lab | MindReply",
  description: "2027 voice persona roster and safe receptionist-flow preview.",
  robots: { index: false, follow: false },
};

export default function VoiceLabPage() {
  return <VoicePersonasLab />;
}
