import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, Sparkles, Languages, ArrowRight, Play, RefreshCw, CheckCircle2 } from "lucide-react";

export const LiveTranslationDemo = () => {
  const [sourceLang, setSourceLang] = useState("en-US");
  const [targetLang, setTargetLang] = useState("es-ES");
  const [inputText, setInputText] = useState("Welcome to PrimeTalker! How can I assist your team today?");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [result, setResult] = useState<{
    original: string;
    translated: string;
    sourceName: string;
    targetName: string;
  }>({
    original: "Welcome to PrimeTalker! How can I assist your team today?",
    translated: "¡Bienvenido a PrimeTalker! ¿Cómo puedo ayudar a su equipo hoy?",
    sourceName: "English (US)",
    targetName: "Spanish",
  });

  const languageOptions = [
    { code: "en-US", name: "English (US)" },
    { code: "te-IN", name: "Telugu (తెలుగు)" },
    { code: "hi-IN", name: "Hindi (हिन्दी)" },
    { code: "es-ES", name: "Spanish (Español)" },
    { code: "ja-JP", name: "Japanese (日本語)" },
    { code: "de-DE", name: "German (Deutsch)" },
    { code: "fr-FR", name: "French (Français)" },
    { code: "ta-IN", name: "Tamil (தமிழ்)" },
  ];

  const presets = [
    "Let's review our quarterly project timeline together.",
    "Can you hear me clearly? We are ready to start the presentation.",
    "PrimeTalker translates our voice instantly without any lag.",
    "మన డిజైన్ రివ్యూ మీటింగ్ సమయానికి ప్రారంభిద్దాం."
  ];

  const translationsMap: Record<string, Record<string, string>> = {
    "Let's review our quarterly project timeline together.": {
      "es-ES": "Revisemos juntos el cronograma de nuestro proyecto trimestral.",
      "te-IN": "మన త్రైమాసిక ప్రాజెక్ట్ సమయపట్టికను కలిసి సమీక్షిద్దాం.",
      "hi-IN": "आइए एक साथ हमारी तिमाही परियोजना की समयरेखा की समीक्षा करें।",
      "ja-JP": "四半期プロジェクトのタイムラインを一緒に確認しましょう。",
      "de-DE": "Lassen Sie uns den Zeitplan unseres Quartalsprojekts gemeinsam überprüfen.",
      "fr-FR": "Examinons ensemble le calendrier de notre projet trimestriel.",
      "ta-IN": "நமது காலாண்டு திட்ட காலவரிசையை ஒன்றாக மதிப்பாய்வு செய்வோம்.",
    },
    "Can you hear me clearly? We are ready to start the presentation.": {
      "es-ES": "¿Me escuchas claramente? Estamos listos para comenzar la presentación.",
      "te-IN": "మీరు నన్ను స్పష్టంగా వినగలరా? ప్రెజెంటేషన్ ప్రారంభించడానికి సిద్ధంగా ఉన్నాము.",
      "hi-IN": "क्या आप मुझे स्पष्ट रूप से सुन सकते हैं? हम प्रस्तुति शुरू करने के लिए तैयार हैं।",
      "ja-JP": "はっきりと聞こえますか？プレゼンテーションを開始する準備ができました。",
      "de-DE": "Können Sie mich deutlich hören? Wir sind bereit, mit der Präsentation zu beginnen.",
      "fr-FR": "M'entendez-vous clairement ? Nous sommes prêts à commencer la présentation.",
      "ta-IN": "நான் பேசுவது தெளிவாகக் கேட்கிறதா? விளக்கக்காட்சியைத் தொடங்க நாங்கள் தயாராக உள்ளோம்.",
    },
    "PrimeTalker translates our voice instantly without any lag.": {
      "es-ES": "PrimeTalker traduce nuestra voz al instante sin ningún retraso.",
      "te-IN": "ప్రైమ్‌టాకర్ మన వాయిస్‌ని ఎలాంటి ఆలస్యం లేకుండా తక్షణమే అనువదిస్తుంది.",
      "hi-IN": "प्राइमटॉकर हमारी आवाज का बिना किसी देरी के तुरंत अनुवाद करता है।",
      "ja-JP": "PrimeTalkerは、ラグなしで音声を即座に翻訳します。",
      "de-DE": "PrimeTalker übersetzt unsere Stimme sofort und ohne Verzögerung.",
      "fr-FR": "PrimeTalker traduit notre voix instantanément sans aucun décalage.",
      "ta-IN": "ப்ரைம்டாக்கர் எவ்வித தாமதமும் இன்றி நமது குரலை உடனடியாக மொழிபெயர்க்கிறது.",
    },
    "మన డిజైన్ రివ్యూ మీటింగ్ సమయానికి ప్రారంభిద్దాం.": {
      "en-US": "Let's start our design review meeting on time.",
      "es-ES": "Comencemos a tiempo nuestra reunión de revisión de diseño.",
      "hi-IN": "आइए अपनी डिज़ाइन समीक्षा बैठक समय पर शुरू करें।",
      "ja-JP": "デザインレビュー会議を時間通りに始めましょう。",
      "de-DE": "Beginnen wir unser Design-Review-Meeting pünktlich.",
      "fr-FR": "Commençons notre réunion de revue de conception à l'heure.",
      "ta-IN": "நமது வடிவமைப்பு ஆய்வு கூட்டத்தை உரிய நேரத்தில் தொடங்குவோம்.",
    }
  };

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);

    setTimeout(() => {
      const srcObj = languageOptions.find((l) => l.code === sourceLang);
      const tgtObj = languageOptions.find((l) => l.code === targetLang);

      let translatedStr = "";
      if (translationsMap[inputText] && translationsMap[inputText][targetLang]) {
        translatedStr = translationsMap[inputText][targetLang];
      } else {
        translatedStr = `[Translated to ${tgtObj?.name}]: ${inputText}`;
      }

      setResult({
        original: inputText,
        translated: translatedStr,
        sourceName: srcObj?.name || "English",
        targetName: tgtObj?.name || "Target",
      });

      setIsTranslating(false);
    }, 450);
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    // Use Web Speech API if supported for real speech, fallback to timer
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(result.translated);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

  return (
    <section id="demo-section" className="py-20 bg-accent/20 border-y border-border/60 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Experience Live Speech Translation
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Test how PrimeTalker captures spoken sentences, converts them instantly through our streaming WebSocket server, and outputs Neural2 voice audio.
          </p>
        </div>

        {/* Main Card Console */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-6">
          {/* Language Selector Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-2 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-primary" />
                SOURCE LANGUAGE (SPEAKER)
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-2 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-purple-400" />
                TARGET LANGUAGE (LISTENER AUDIO)
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-xs text-muted-foreground font-mono mb-2 block">QUICK SAMPLE PHRASES:</span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(preset)}
                  className="text-xs bg-accent/60 hover:bg-primary/20 hover:text-primary border border-border px-3 py-1.5 rounded-lg transition text-left"
                >
                  "{preset.slice(0, 42)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Box */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-muted-foreground">
              INPUT PHRASE TO TRANSLATE & SYNTHESIZE:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              className="w-full bg-background border border-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-sans"
              placeholder="Type any sentence here..."
            />
          </div>

          {/* Action Trigger Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="px-6 py-5 rounded-xl shadow-primary gap-2"
            >
              {isTranslating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Voice Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simulate Real-Time Translation</span>
                </>
              )}
            </Button>
          </div>

          {/* Translation Output Box */}
          <div className="mt-6 border-t border-border/60 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                STREAMING AUDIO TRANSLATION RESULT
              </span>
              <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Latency: 210ms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Original Transcript */}
              <div className="bg-background/80 border border-border/80 rounded-xl p-4 space-y-2">
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-primary" />
                  {result.sourceName} Transcript:
                </div>
                <p className="text-sm font-medium text-foreground">{result.original}</p>
              </div>

              {/* Right: Translated Transcript & Audio Button */}
              <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-4 space-y-3">
                <div className="text-xs font-mono text-purple-300 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-purple-400" />
                  {result.targetName} Output:
                </div>
                <p className="text-base font-semibold text-purple-100">{result.translated}</p>

                {/* Audio Playback Button */}
                <div className="pt-2 flex items-center justify-between border-t border-purple-500/20">
                  <Button
                    size="sm"
                    onClick={handlePlayAudio}
                    disabled={isPlayingAudio}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs gap-1.5 px-3 py-1.5 shadow-sm"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-bounce" : ""}`} />
                    <span>{isPlayingAudio ? "Playing Voice Synthesis..." : "Listen Voice Synthesis"}</span>
                  </Button>

                  {isPlayingAudio && (
                    <div className="flex items-center gap-1">
                      <span className="w-1 bg-purple-400 h-3 animate-bounce" />
                      <span className="w-1 bg-purple-400 h-4 animate-bounce" style={{ animationDelay: "100ms" }} />
                      <span className="w-1 bg-purple-400 h-2 animate-bounce" style={{ animationDelay: "200ms" }} />
                      <span className="w-1 bg-purple-400 h-5 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
