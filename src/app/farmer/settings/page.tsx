'use client';

import { useState } from 'react';
import { Settings, Languages, Volume2, Eye, ShieldCheck, Check } from 'lucide-react';

export default function FarmerSettingsPage() {
  const [language, setLanguage] = useState<'en' | 'ta' | 'hi'>('en');
  const [voiceGuidance, setVoiceGuidance] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Translations dictionary for demo preview
  const translations = {
    en: {
      title: "Settings & Accessibility",
      desc: "Customize UI settings, language translation nodes, and offline synchronization schedules",
      langSelect: "Portal Interface Language",
      voiceOption: "Enable Voice Guidance Instructions",
      voiceDesc: "Provides spoken notifications for daily biosecurity checklists.",
      contrastOption: "High Contrast Mode",
      contrastDesc: "Increases text visibility for outdoor sunlight operation.",
      previewTitle: "Live Translation Preview (Farmer Dashboard)",
      dashboardLabel: "Dashboard Overview",
      mortalityLabel: "Deaths Today",
      sickLabel: "Sick Animals",
      scoreLabel: "Biosecurity Compliance Rate",
      saveBtn: "Save Preferences"
    },
    ta: {
      title: "அமைப்புகள் & அணுகல் வசதி",
      desc: "வலைதள அமைப்புகள், மொழி பெயர்ப்பு மற்றும் ஆஃப்லைன் ஒத்திசைவு அட்டவணைகளைத் தனிப்பயனாக்குங்கள்",
      langSelect: "வலைதள இடைமுக மொழி",
      voiceOption: "குரல் வழிகாட்டுதல் வழிமுறைகளை இயக்கு",
      voiceDesc: "தினசரி உயிரி பாதுகாப்பு சரிபார்ப்பு பட்டியல்களுக்கான அறிவிப்புகளை குரல் மூலம் வழங்குகிறது.",
      contrastOption: "அதிக மாறுபட்ட வண்ணம் (High Contrast Mode)",
      contrastDesc: "வெளியே சூரிய ஒளியில் பார்க்கும்போது உரை தெரிவுநிலையை அதிகரிக்கிறது.",
      previewTitle: "நேரடி மொழிபெயர்ப்பு முன்னோட்டம் (விவசாயி முகப்பு)",
      dashboardLabel: "கண்காணிப்பு முகப்பு",
      mortalityLabel: "இன்றைய இறப்புகள்",
      sickLabel: "நோய்வாய்ப்பட்ட பறவைகள்",
      scoreLabel: "உயிரி பாதுகாப்பு இணக்க வீதம்",
      saveBtn: "விருப்பங்களைச் சேமி"
    },
    hi: {
      title: "सेटिंग्स और सुलभता",
      desc: "इंटरफ़ेस सेटिंग्स, भाषा अनुवाद नोड्स और ऑफ़लाइन समन्वयन को अनुकूलित करें",
      langSelect: "पोर्टल भाषा",
      voiceOption: "आवाज मार्गदर्शन निर्देश सक्षम करें",
      voiceDesc: "दैनिक जैव-सुरक्षा चेकलिस्ट के लिए मौखिक सूचनाएं प्रदान करता है।",
      contrastOption: "उच्च कंट्रास्ट मोड",
      contrastDesc: "बाहरी धूप में काम करने के लिए टेक्स्ट की दृश्यता बढ़ाता है।",
      previewTitle: "लाइव अनुवाद पूर्वावलोकन (किसान डैशबोर्ड)",
      dashboardLabel: "डैशबोर्ड अवलोकन",
      mortalityLabel: "आज की मृत्यु संख्या",
      sickLabel: "बीमार जानवर",
      scoreLabel: "जैव-सुरक्षा अनुपालन दर",
      saveBtn: "प्राथमिकताएं सहेजें"
    }
  };

  const t = translations[language];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">{t.title}</h2>
        <p className="text-xs text-muted-foreground">{t.desc}</p>
      </div>

      {saved && (
        <p className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
          <Check size={14} /> Preferences saved to local profile cache.
        </p>
      )}

      {/* Settings Panel */}
      <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 space-y-6">
        
        {/* Language switcher */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
            <Languages size={16} className="text-primary" />
            {t.langSelect}
          </label>
          <div className="grid grid-cols-3 gap-3 text-xs font-bold">
            {[
              { code: 'en', label: 'English' },
              { code: 'ta', label: 'தமிழ் (Tamil)' },
              { code: 'hi', label: 'हिन्दी (Hindi)' }
            ].map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`p-3 border rounded-xl transition-colors cursor-pointer text-center ${
                  language === lang.code
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-secondary/40'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility features */}
        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground flex items-center gap-2">
            <Volume2 size={16} className="text-primary" />
            Accessibility & A11y Toggles
          </h3>

          {/* Voice Guidance */}
          <div className="flex items-start justify-between gap-4 p-3 border border-border rounded-xl">
            <div className="space-y-0.5">
              <label htmlFor="voice" className="text-xs font-bold text-foreground cursor-pointer">
                {t.voiceOption}
              </label>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t.voiceDesc}
              </p>
            </div>
            <input
              type="checkbox"
              id="voice"
              checked={voiceGuidance}
              onChange={e => setVoiceGuidance(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary mt-1 shrink-0"
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-start justify-between gap-4 p-3 border border-border rounded-xl">
            <div className="space-y-0.5">
              <label htmlFor="contrast" className="text-xs font-bold text-foreground cursor-pointer">
                {t.contrastOption}
              </label>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t.contrastDesc}
              </p>
            </div>
            <input
              type="checkbox"
              id="contrast"
              checked={highContrast}
              onChange={e => setHighContrast(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary mt-1 shrink-0"
            />
          </div>
        </div>

        {/* Dynamic preview block */}
        <div className="border-t border-border pt-6 space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <Eye size={14} className="text-primary" />
            {t.previewTitle}
          </h4>

          <div className="bg-secondary/40 p-4 border border-border rounded-xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-1">
              <span className="font-bold text-foreground">{t.dashboardLabel}</span>
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">Sri Murugan Farm</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-2.5 rounded border border-border/80">
                <span className="text-[10px] text-muted-foreground block">{t.mortalityLabel}</span>
                <span className="text-base font-extrabold text-risk-critical">1</span>
              </div>
              <div className="bg-card p-2.5 rounded border border-border/80">
                <span className="text-[10px] text-muted-foreground block">{t.sickLabel}</span>
                <span className="text-base font-extrabold text-risk-medium">20</span>
              </div>
            </div>

            <div className="bg-card p-2.5 rounded border border-border/80 flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground">{t.scoreLabel}</span>
              <span className="font-extrabold text-primary">92%</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-colors shadow-sm"
        >
          {t.saveBtn}
        </button>

      </form>

    </div>
  );
}
