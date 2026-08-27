'use client';

import { useState } from 'react';
import { Settings, Languages, Volume2, Eye, Check, Save } from 'lucide-react';
import { useLanguage, LanguageCode } from '@/components/language-provider';
import { useTranslation } from '@/hooks/use-translation';

export default function FarmerSettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const [voiceGuidance, setVoiceGuidance] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [phoneReminder, setPhoneReminder] = useState(true);
  const [phoneForCall, setPhoneForCall] = useState("+91 98765 43210");
  const [callFrequency, setCallFrequency] = useState("weekly");
  const [testCallStatus, setTestCallStatus] = useState<string | null>(null);
  const [testingCall, setTestingCall] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestCall = async () => {
    setTestingCall(true);
    setTestCallStatus(null);
    try {
      const res = await fetch('/api/reminders/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneForCall,
          language
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place call');
      
      if (data.mode === 'real') {
        setTestCallStatus(`Real outbound call placed! Twilio SID: ${data.sid}`);
      } else {
        setTestCallStatus(`Simulated Call Dispatched! Voice TTS speaks: "${data.speechText}"`);
      }
    } catch (err: any) {
      console.error(err);
      setTestCallStatus(`Call error: ${err.message}`);
    } finally {
      setTestingCall(false);
    }
  };

  const languagesList: Array<{ code: LanguageCode; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' }
  ];

  // Specific local translations for Settings page labels per language
  const settingsLabels: Record<LanguageCode, any> = {
    en: {
      title: "Settings & Accessibility",
      desc: "Customize UI settings, language translation nodes, and accessibility toggles",
      langSelect: "Select Portal Language",
      voiceOption: "Enable Voice Guidance Instructions",
      voiceDesc: "Provides spoken notifications for daily biosecurity checklists.",
      contrastOption: "High Contrast Mode",
      contrastDesc: "Increases text visibility for outdoor sunlight operation.",
      previewTitle: "Live Translation Preview",
      saveBtn: "Save Preferences"
    },
    ta: {
      title: "அமைப்புகள் & அணுகல் வசதி",
      desc: "வலைதள அமைப்புகள், மொழி பெயர்ப்பு மற்றும் அணுகல் தேவைகளைத் தனிப்பயனாக்குங்கள்",
      langSelect: "வலைதள மொழியைத் தேர்ந்தெடுக்கவும்",
      voiceOption: "குரல் வழிகாட்டுதல் வழிமுறைகளை இயக்கு",
      voiceDesc: "தினசரி உயிரி பாதுகாப்பு சரிபார்ப்பு பட்டியல்களுக்கான அறிவிப்புகளை குரல் மூலம் வழங்குகிறது.",
      contrastOption: "அதிக மாறுபட்ட வண்ணம் (High Contrast)",
      contrastDesc: "வெளியே சூரிய ஒளியில் பார்க்கும்போது உரை தெரிவுநிலையை அதிகரிக்கிறது.",
      previewTitle: "நேரடி மொழிபெயர்ப்பு முன்னோட்டம்",
      saveBtn: "விருப்பங்களைச் சேமி"
    },
    ml: {
      title: "ക്രമീകരണങ്ങൾ",
      desc: "ഇന്റർഫേസ് ക്രമീകരണങ്ങളും ഭാഷാ വിവർത്തനങ്ങളും ക്രമീകരിക്കുക",
      langSelect: "ഭാഷ തിരഞ്ഞെടുക്കുക",
      voiceOption: "വോയിസ് ഗൈഡൻസ് പ്രവർത്തനക്ഷമമാക്കുക",
      voiceDesc: "ദിനചര്യകൾക്കായി ഓഡിയോ സഹായം നൽകുന്നു.",
      contrastOption: "ഹൈ കോൺട്രാസ്റ്റ് മോഡ്",
      contrastDesc: "വെളിച്ചമുള്ള സാഹചര്യങ്ങളിൽ കൂടുതൽ വ്യക്തത നൽകുന്നു.",
      previewTitle: "തത്സമയ വിവർത്തന പരീക്ഷണ രൂപം",
      saveBtn: "തിരഞ്ഞെടുപ്പുകൾ സംരക്ഷിക്കുക"
    },
    hi: {
      title: "सेटिंग्स और सुलभता",
      desc: "इंटरफ़ेस सेटिंग्स, भाषा अनुवाद नोड्स और सुलभता प्राथमिकताओं को अनुकूलित करें",
      langSelect: "पोर्टल भाषा चुनें",
      voiceOption: "आवाज मार्गदर्शन निर्देश सक्षम करें",
      voiceDesc: "दैनिक जैव-सुरक्षा चेकलिस्ट के लिए मौखिक सूचनाएं प्रदान करता है।",
      contrastOption: "उच्च कंट्रास्ट मोड",
      contrastDesc: "बाहरी धूप में काम करने के लिए टेक्स्ट की दृश्यता बढ़ाता है।",
      previewTitle: "लाइव अनुवाद पूर्वावलोकन",
      saveBtn: "प्राथमिकताएं सहेजें"
    },
    mr: {
      title: "सेटिंग्ज आणि सुलभता",
      desc: "भाषा निवड आणि सुलभता प्राधान्ये बदला",
      langSelect: "भाषा निवडा",
      voiceOption: "आवाज मार्गदर्शन सक्षम करा",
      voiceDesc: "चेकलिस्टसाठी ऑडिओ सूचना प्रदान करते.",
      contrastOption: "हाय कॉन्ट्रास्ट मोड",
      contrastDesc: "सूर्यप्रकाशात अधिक स्पष्ट दिसण्यासाठी मदत करते.",
      previewTitle: "थेट अनुवाद पूर्वावलोकन",
      saveBtn: "बदल जतन करा"
    },
    gu: {
      title: "સેટિંગ્સ અને સુલભતા",
      desc: "ઇન્ટરફેસ સેટિંગ્સ અને ભાષા પસંદગીઓ કસ્ટમાઇઝ કરો",
      langSelect: "ભાષા પસંદ કરો",
      voiceOption: "વોઇસ ગાઇડન્સ સક્ષમ કરો",
      voiceDesc: "દૈનિક ચેકલિસ્ટ માટે ઓડિયો સૂચનાઓ આપે છે.",
      contrastOption: "હાઇ કોન્ટ્રાસ્ટ મોડ",
      contrastDesc: "સૂર્યપ્રકાશમાં ટેક્સ્ટની દૃશ્યતા વધારે છે.",
      previewTitle: "લાઈવ અનુવાદ પૂર્વાવલોકન",
      saveBtn: "સેટિંગ્સ સાચવો"
    }
  };

  const labels = settingsLabels[language] || settingsLabels.en;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{labels.title}</h2>
        <p className="text-xs text-muted-foreground">{labels.desc}</p>
      </div>

      {saved && (
        <p className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
          <Check size={14} /> Preferences saved to local profile cache.
        </p>
      )}

      {/* Settings Panel */}
      <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 space-y-6 text-xs colorful-card-primary">
        
        {/* Language switcher */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
            <Languages size={16} className="text-primary" />
            {labels.langSelect}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold">
            {languagesList.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3 border rounded-xl transition-all cursor-pointer text-center hover:scale-105 active:scale-95 ${
                  language === lang.code
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
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
                {labels.voiceOption}
              </label>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {labels.voiceDesc}
              </p>
            </div>
            <input
              type="checkbox"
              id="voice"
              checked={voiceGuidance}
              onChange={e => setVoiceGuidance(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary mt-1 shrink-0 cursor-pointer"
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-start justify-between gap-4 p-3 border border-border rounded-xl">
            <div className="space-y-0.5">
              <label htmlFor="contrast" className="text-xs font-bold text-foreground cursor-pointer">
                {labels.contrastOption}
              </label>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {labels.contrastDesc}
              </p>
            </div>
            <input
              type="checkbox"
              id="contrast"
              checked={highContrast}
              onChange={e => setHighContrast(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary mt-1 shrink-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Automated Voice Call Reminders */}
        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground flex items-center gap-2">
            <Volume2 size={16} className="text-primary" />
            {language === 'ta' ? 'தானியங்கி அழைப்பு நினைவூட்டல்கள்' : 'Automated Outbound Voice Reminders'}
          </h3>

          <div className="flex items-start justify-between gap-4 p-3 border border-border rounded-xl">
            <div className="space-y-0.5">
              <label htmlFor="phoneReminder" className="text-xs font-bold text-foreground cursor-pointer">
                {language === 'ta' ? 'குரல் அழைப்பு நினைவூட்டலை இயக்கு' : 'Enable Outbound Call Reminders'}
              </label>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {language === 'ta' 
                  ? 'வாராந்திர தரவை நீங்கள் பதிவு செய்யவில்லை என்றால் தானியங்கி அழைப்பைத் தொடங்கும்.' 
                  : 'Triggers automated phone call alerts if weekly health logs are missing.'}
              </p>
            </div>
            <input
              type="checkbox"
              id="phoneReminder"
              checked={phoneReminder}
              onChange={e => setPhoneReminder(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary mt-1 shrink-0 cursor-pointer"
            />
          </div>

          {phoneReminder && (
            <div className="grid gap-4 sm:grid-cols-2 p-3 bg-secondary/20 border border-border rounded-xl">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  {language === 'ta' ? 'தொலைபேசி எண்' : 'Farmer Mobile Number'}
                </label>
                <input
                  type="text"
                  value={phoneForCall}
                  onChange={(e) => setPhoneForCall(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  {language === 'ta' ? 'அழைப்பு அதிர்வெண்' : 'Call Trigger Alert Frequency'}
                </label>
                <select
                  value={callFrequency}
                  onChange={(e) => setCallFrequency(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="weekly">{language === 'ta' ? 'வாரம் ஒருமுறை (ஞாயிறு)' : 'Weekly if logs missing'}</option>
                  <option value="3days">{language === 'ta' ? 'ஒவ்வொரு 3 நாட்களுக்கு ஒருமுறை' : 'Every 3 Days'}</option>
                  <option value="daily">{language === 'ta' ? 'தினசரி' : 'Daily'}</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={handleTestCall}
                  disabled={testingCall}
                  className="w-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {testingCall ? 'Placing Voice Call...' : 'Test Outbound Reminder Call'}
                </button>
                {testCallStatus && (
                  <p className="mt-2 text-[10px] bg-card p-2 border border-border rounded text-muted-foreground font-mono leading-relaxed">
                    {testCallStatus}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic preview block */}
        <div className="border-t border-border pt-6 space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <Eye size={14} className="text-primary" />
            {labels.previewTitle}
          </h4>

          <div className="bg-secondary/40 p-4 border border-border rounded-xl space-y-3 text-xs shadow-inner">
            <div className="flex items-center justify-between border-b border-border/80 pb-1">
              <span className="font-bold text-foreground">{t.dashboard}</span>
              <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">Sri Murugan Farm</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-2.5 rounded border border-border/80 shadow-sm">
                <span className="text-[10px] text-muted-foreground block">{t.deathsToday}</span>
                <span className="text-base font-extrabold text-risk-critical">1</span>
              </div>
              <div className="bg-card p-2.5 rounded border border-border/80 shadow-sm">
                <span className="text-[10px] text-muted-foreground block">{t.sickBirdsToday}</span>
                <span className="text-base font-extrabold text-risk-medium">20</span>
              </div>
            </div>

            <div className="bg-card p-2.5 rounded border border-border/80 flex justify-between items-center shadow-sm">
              <span className="text-[10px] text-muted-foreground">{t.complianceRate}</span>
              <span className="font-extrabold text-primary">92%</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save size={16} />
          {labels.saveBtn}
        </button>

      </form>

    </div>
  );
}
