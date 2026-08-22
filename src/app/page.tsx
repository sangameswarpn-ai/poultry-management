'use client';

import Link from 'next/link';
import { Sprout, ShieldAlert, Users, TrendingUp, ChevronRight, Lock, Languages } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useLanguage, LanguageCode } from '@/components/language-provider';

const landingTranslations = {
  en: {
    title: "Digital Farm Management & Biosecurity Portal",
    subtitle: "A state-of-the-art diagnostic system mapping disease transmission risks, animal mortalities, and visitor logs across poultry grids. Enabling instant coordination between Farmers, Veterinary Officers, and State Admins.",
    signIn: "Portal Sign-In",
    registeredFarms: "Registered Farms",
    biosecurityCompliance: "Biosecurity Compliance",
    activeAlerts: "Active Risk Alerts",
    territorialGrid: "Territorial Grid",
    districtsVal: "3 Districts",
    farmerTitle: "Farmer Portal",
    farmerDesc: "Submit daily biosecurity checklists, record flock mortality rates, log vehicle disinfection, report suspect symptoms, and receive government advisories.",
    farmerBtn: "Access Farmer Panel",
    vetTitle: "Veterinary Officer",
    vetDesc: "Monitor regional GIS maps, inspect high-mortality alerts, schedule diagnostic field visits, input inspection notes, and issue quarantine notices.",
    vetBtn: "Access Officer Panel",
    adminTitle: "Admin Directory",
    adminDesc: "Analyze state-wide compliance levels, inspect mortality curves, monitor district response rates, and coordinate epidemic containment measures.",
    adminBtn: "Access Admin Panel",
    footerTitle: "Developed for biosecurity management in pig & poultry farms across Indian districts."
  },
  ta: {
    title: "டிஜிட்டல் பண்ணை மேலாண்மை மற்றும் உயிரி பாதுகாப்பு போர்டல்",
    subtitle: "பறவை பண்ணைகளில் பரவும் நோய்கள், இறப்புகள் மற்றும் வருகையாளர் பதிவுகளைக் கண்காணிக்கும் நவீன கண்டறியும் அமைப்பு. பண்ணையாளர்கள், கால்நடை மருத்துவர்கள் மற்றும் நிர்வாகிகளிடையே உடனடி தொடர்பை ஏற்படுத்துகிறது.",
    signIn: "போர்டல் உள்நுழைவு",
    registeredFarms: "பதிவுசெய்யப்பட்ட பண்ணைகள்",
    biosecurityCompliance: "உயிரி பாதுகாப்பு இணக்கம்",
    activeAlerts: "செயலில் உள்ள எச்சரிக்கைகள்",
    territorialGrid: "பிராந்திய கட்டம்",
    districtsVal: "3 மாவட்டங்கள்",
    farmerTitle: "பண்ணையாளர் போர்டல்",
    farmerDesc: "தினசரி உயிரி பாதுகாப்பு சரிபார்ப்பு பட்டியல்களைச் சமர்ப்பிக்கவும், பறவைகளின் இறப்பு விகிதங்களைப் பதிவு செய்யவும், கிருமிநாசினிப் பதிவுகளை மேற்கொள்ளவும்.",
    farmerBtn: "பண்ணையாளர் பேனலை அணுகவும்",
    vetTitle: "கால்நடை அலுவலர்",
    vetDesc: "பிராந்திய வரைபடங்களைக் கண்காணிக்கவும், அதிக இறப்பு விகித எச்சரிக்கைகளை ஆய்வு செய்யவும், கால்நடை கள ஆய்வுகளைத் திட்டமிடவும்.",
    vetBtn: "அதிகாரிகள் பேனலை அணுகவும்",
    adminTitle: "நிர்வாகி அடைவு",
    adminDesc: "மாநில அளவிலான இணக்க நிலைகளை பகுப்பாய்வு செய்யவும், இறப்பு விகிதங்களை ஆய்வு செய்யவும் மற்றும் அவசர தடுப்பு நடவடிக்கைகளை ஒருங்கிணைக்கவும்.",
    adminBtn: "நிர்வாகிகள் பேனலை அணுகவும்",
    footerTitle: "இந்திய மாவட்டங்களில் உள்ள பண்ணைகளில் உயிரி பாதுகாப்பு மேலாண்மைக்காக உருவாக்கப்பட்டது."
  },
  ml: {
    title: "ഡിജിറ്റൽ ഫാം മാനേജ്മെന്റ് & ബയോസെക്യൂരിറ്റി പോർട്ടൽ",
    subtitle: "കോഴി ഫാമുകളിലെ രോഗവ്യാപനം, കോഴികളുടെ മരണം, സന്ദർശക വിവരങ്ങൾ എന്നിവ വിലയിരുത്തുന്ന ആധുനിക ഡയഗ്നോസ്റ്റിക് സിസ്റ്റം. കർഷകർ, വെറ്ററിനറി ഡോക്ടർമാർ, അഡ്മിൻമാർ എന്നിവരെ തത്സമയം ബന്ധിപ്പിക്കുന്നു.",
    signIn: "പോർട്ടൽ സൈൻ ഇൻ",
    registeredFarms: "രജിസ്റ്റർ ചെയ്ത ഫാമുകൾ",
    biosecurityCompliance: "ബയോസെക്യൂരിറ്റി പാലിക്കൽ",
    activeAlerts: "സജീവ മുന്നറിയിപ്പുകൾ",
    territorialGrid: "പ്രാദേശിക ശൃംഖല",
    districtsVal: "3 ജില്ലകൾ",
    farmerTitle: "കർഷക പോർട്ടൽ",
    farmerDesc: "ദൈനംദിന ബയോസെക്യൂരിറ്റി വിവരങ്ങൾ സമർപ്പിക്കുക, മരണനിരക്ക് രേഖപ്പെടുത്തുക, സന്ദർശക വിവരങ്ങൾ ചേർക്കുക, നിർദ്ദേശങ്ങൾ സ്വീകരിക്കുക.",
    farmerBtn: "കർഷക പാനൽ തുറക്കുക",
    vetTitle: "വെറ്ററിനറി ഓഫീസർ",
    vetDesc: "പ്രാദേശിക ജി.ഐ.എസ് ഭൂപടങ്ങൾ നിരീക്ഷിക്കുക, മരണനിരക്ക് സംബന്ധിച്ച മുന്നറിയിപ്പുകൾ പരിശോധിക്കുക, ഫാം പരിശോധനകൾ ഷെഡ്യൂൾ ചെയ്യുക.",
    vetBtn: "ഓഫീസർ പാനൽ തുറക്കുക",
    adminTitle: "അഡ്മിൻ ഡയറക്ടറി",
    adminDesc: "സംസ്ഥാനത്തെ ബയോസെക്യൂരിറ്റി പാലിക്കൽ നിലവാരം വിലയിരുത്തുക, മരണനിരക്കുകൾ വിശകലനം ചെയ്യുക, രോഗനിയന്ത്രണ പ്രവർത്തനങ്ങൾ ഏകോപിപ്പിക്കുക.",
    adminBtn: "അഡ്മിൻ പാനൽ തുറക്കുക",
    footerTitle: "ഇന്ത്യയിലെ വിവിധ ജില്ലകളിലെ ബയോസെക്യൂരിറ്റി ഫാം മാനേജ്മെന്റിനായി വികസിപ്പിച്ചത്."
  },
  hi: {
    title: "डिजिटल फार्म प्रबंधन और जैव-सुरक्षा पोर्टल",
    subtitle: "पोल्ट्री ग्रिड में रोग संचरण जोखिमों, पशु मृत्यु दर और विज़िटर लॉग का मानचित्रण करने वाली अत्याधुनिक नैदानिक प्रणाली। किसानों, पशु चिकित्सा अधिकारियों और राज्य प्रशासकों के बीच त्वरित समन्वय सक्षम करना।",
    signIn: "पोर्टल साइन-इन",
    registeredFarms: "पंजीकृत फार्म",
    biosecurityCompliance: "जैव-सुरक्षा अनुपालन",
    activeAlerts: "सक्रिय जोखिम अलर्ट",
    territorialGrid: "क्षेत्रीय ग्रिड",
    districtsVal: "3 जिले",
    farmerTitle: "किसान पोर्टल",
    farmerDesc: "दैनिक जैव-सुरक्षा चेकलिस्ट जमा करें, झुंड की मृत्यु दर रिकॉर्ड करें, वाहन कीटाणुशोधन लॉग करें और सरकारी सलाह प्राप्त करें।",
    farmerBtn: "किसान पैनल तक पहुंचें",
    vetTitle: "पशु चिकित्सा अधिकारी",
    vetDesc: "क्षेत्रीय जीआईएस मानचित्रों की निगरानी करें, उच्च-मृत्यु दर अलर्ट का निरीक्षण करें, और संगरोध नोटिस जारी करें।",
    vetBtn: "अधिकारी पैनल तक पहुंचें",
    adminTitle: "एडमिन निर्देशिका",
    adminDesc: "राज्य-व्यापी अनुपालन स्तरों का विश्लेषण करें, मृत्यु दर वक्रों का निरीक्षण करें, और महामारी रोकथाम उपायों का समन्वय करें।",
    adminBtn: "एडमिन पैनल तक पहुंचें",
    footerTitle: "भारतीय जिलों में पोल्ट्री और सुअर फार्मों में जैव-सुरक्षा प्रबंधन के लिए विकसित किया गया।"
  },
  mr: {
    title: "डिजिटल फार्म व्यवस्थापन आणि जैव-सुरक्षा पोर्टल",
    subtitle: "पोल्ट्री ग्रिडमधील रोग प्रसार, प्राण्यांचे मृत्यू आणि भेट देणाऱ्यांची माहिती दर्शवणारी अत्याधुनिक प्रणाली. शेतकरी, पशुवैद्यकीय अधिकारी आणि प्रशासकांमध्ये त्वरित समन्वय निर्माण करते.",
    signIn: "पोर्टल साइन-इन",
    registeredFarms: "नोंदणीकृत फार्म",
    biosecurityCompliance: "जैव-सुरक्षा पालन",
    activeAlerts: "सक्रिय धोका इशारे",
    territorialGrid: "प्रादेशिक विभाग",
    districtsVal: "३ जिल्हे",
    farmerTitle: "शेतकरी पोर्टल",
    farmerDesc: "दैनिक जैव-सुरक्षा चेकलिस्ट सबमिट करा, मृत्यू दर नोंदवा, वाहन निर्जंतुकीकरण लॉग करा आणि मार्गदर्शक सूचना मिळवा.",
    farmerBtn: "शेतकरी पॅनेल उघडा",
    vetTitle: "पशुवैद्यकीय अधिकारी",
    vetDesc: "प्रादेशिक नकाशांचे निरीक्षण करा, उच्च मृत्यू दरांचे निरीक्षण करा आणि फाम भेटींचे नियोजन करा.",
    vetBtn: "अधिकारी पॅनेल उघडा",
    adminTitle: "प्रशासक निर्देशिका",
    adminDesc: "राज्यभरातील नियमांचे पालन तपासा, मृत्यू वक्र तपासा आणि नियंत्रण उपायांचे समन्वय साधा.",
    adminBtn: "प्रशासक पॅनेल उघडा",
    footerTitle: "भारतीय जिल्ह्यांमधील पोल्ट्री आणि डुक्कर फार्म व्यवस्थापनासाठी विकसित केले गेले."
  },
  gu: {
    title: "ડિજિટલ ફાર્મ મેનેજમેન્ટ અને જૈવ-સુરક્ષા પોર્ટલ",
    subtitle: "પોલ્ટ્રી ગ્રીડમાં રોગના ફેલાવા, પક્ષીઓના મૃત્યુ અને મુલાકાતીઓના લોગનું નિરીક્ષણ કરતી આધુનિક સિસ્ટમ. ખેડૂતો, પશુ ચિકિત્સકો અને એડમિન વચ્ચે ત્વરિત તાલમેલ બનાવે છે.",
    signIn: "પોર્ટલ સાઇન-ઇન",
    registeredFarms: "નોંધાયેલ ફાર્મ",
    biosecurityCompliance: "જૈવ-સુરક્ષા પાલન",
    activeAlerts: "સક્રિય જોખમ એલર્ટ",
    territorialGrid: "પ્રાદેશિક ગ્રીડ",
    districtsVal: "3 જિલ્લાઓ",
    farmerTitle: "ખેડૂત પોર્ટલ",
    farmerDesc: "દૈનિક જૈવ-સુરક્ષા ચેકલિસ્ટ સબમિટ કરો, પક્ષીઓના મૃત્યુઆંક રેકોર્ડ કરો, વાહનોના સેનિટાઈઝેશન લોગ ભરો અને સરકારી સૂચનાઓ મેળવો.",
    farmerBtn: "ખેડૂત પેનલ ઍક્સેસ કરો",
    vetTitle: "પશુ ચિકિત્સક અધિકારી",
    vetDesc: "પ્રાદેશિક જીઆઈએસ નકશા તપાસો, વધુ મૃત્યુદર વાળા એલર્ટ ચેક કરો અને ક્વોરન્ટાઇન નોટિસ જાહેર કરો.",
    vetBtn: "અધિકારી પેનલ ઍક્સેસ કરો",
    adminTitle: "એડમિન ડિરેક્ટરી",
    adminDesc: "રાજ્ય સ્તરે નિયમોના પાલનનું વિશ્લેષણ કરો, મૃત્યુદર વળાંક તપાસો અને રોગ અટકાવવાના પગલાં સંકલિત કરો.",
    adminBtn: "એડમિન પેનલ ઍક્સેસ કરો",
    footerTitle: "ભારતીય જિલ્લાઓમાં પોલ્ટ્રી અને ડુક્કર ફાર્મ વ્યવસ્થાપન માટે વિકસિત કરાયું."
  }
};

export default function LandingPage() {
  const { language, setLanguage } = useLanguage();
  const t = landingTranslations[language] || landingTranslations.en;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">PoultryLens AI</span>
        </div>
        <div className="flex items-center gap-4">
          
          {/* Global Language Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-secondary border border-border px-2.5 py-1.5 rounded-lg shadow-sm">
            <Languages size={14} className="text-primary shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent border-none text-foreground text-[11px] font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-popover text-popover-foreground">EN</option>
              <option value="ta" className="bg-popover text-popover-foreground">தமிழ்</option>
              <option value="ml" className="bg-popover text-popover-foreground">മലയാളം</option>
              <option value="hi" className="bg-popover text-popover-foreground">हिन्दी</option>
              <option value="mr" className="bg-popover text-popover-foreground">मराठी</option>
              <option value="gu" className="bg-popover text-popover-foreground">ગુજરાતી</option>
            </select>
          </div>

          <ThemeToggle />
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Lock size={14} />
            {t.signIn}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Core Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mb-12">
          {[
            { value: "15", label: t.registeredFarms, icon: Sprout },
            { value: "82.4%", label: t.biosecurityCompliance, icon: TrendingUp },
            { value: "4", label: t.activeAlerts, icon: ShieldAlert, alert: true },
            { value: t.districtsVal, label: t.territorialGrid, icon: Users }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-card border border-border p-5 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                  <Icon size={16} className={stat.alert ? 'text-risk-high animate-pulse' : 'text-primary'} />
                </div>
                <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
              </div>
            );
          })}
        </div>

        {/* User Role Access Cards */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Farmer Portal */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Sprout size={24} />
              </div>
              <h3 className="text-lg font-bold">{t.farmerTitle}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {t.farmerDesc}
              </p>
            </div>
            <Link
              href="/farmer/dashboard"
              className="mt-6 flex items-center justify-between text-sm font-bold text-primary hover:underline group"
            >
              {t.farmerBtn}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Officer Portal */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold">{t.vetTitle}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {t.vetDesc}
              </p>
            </div>
            <Link
              href="/officer/dashboard"
              className="mt-6 flex items-center justify-between text-sm font-bold text-primary hover:underline group"
            >
              {t.vetBtn}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Admin Portal */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold">{t.adminTitle}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {t.adminDesc}
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="mt-6 flex items-center justify-between text-sm font-bold text-primary hover:underline group"
            >
              {t.adminBtn}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card text-center py-6 text-xs text-muted-foreground">
        <p>© 2026 PoultryLens AI.</p>
        <p className="mt-1">{t.footerTitle}</p>
      </footer>
    </div>
  );
}
