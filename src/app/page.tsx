'use client';

import Link from 'next/link';
import { Sprout, ShieldAlert, Users, TrendingUp, ChevronRight, Lock, Languages, ClipboardCheck, PhoneCall, MailCheck } from 'lucide-react';
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
    footerTitle: "Developed for biosecurity management in pig & poultry farms across Indian districts.",
    
    // Feature Grid
    featuresTitle: "Core Platform Capabilities",
    feature1Title: "GIS Outbreak Mapping",
    feature1Desc: "Real-time threat tracking with color-coded disease hotspots and coordinates popup grids.",
    feature2Title: "Biosecurity Auditing",
    feature2Desc: "Structured daily checklist logs computing compliance rates and rolling average scores.",
    feature3Title: "Contact Tracing Log",
    feature3Desc: "Log visitors, verify entry authorizations, and confirm vehicle disinfection protocols.",
    feature4Title: "Incident Alerting",
    feature4Desc: "Immediate alert routing to veterinary containment officers upon detection of anomalous mortality spikes.",

    // Workflow
    workflowTitle: "How the Platform Works",
    step1Title: "1. Daily Checklist & Logging",
    step1Desc: "Farmers log flock counts, symptoms, and biosecurity checklists on their dashboards.",
    step2Title: "2. Real-Time Risk Analysis",
    step2Desc: "System aggregates data, computes scores, and updates regional threat maps.",
    step3Title: "3. Field Audits & Containment",
    step3Desc: "Veterinary officers check alerts, inspect sites, and issue quarantine advisories.",

    // Helpline
    helplineTitle: "Emergency Containment & Helpdesk",
    helplineDesc: "If you notice high mortality rates, abnormal flock symptoms, or need biosecurity assistance, contact your regional containment officers immediately.",
    phoneCall: "Call State Advisory Helpdesk:",
    emailCall: "Email Vet Incident Response:"
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
    footerTitle: "இந்திய மாவட்டங்களில் உள்ள பண்ணைகளில் உயிரி பாதுகாப்பு மேலாண்மைக்காக உருவாக்கப்பட்டது.",

    featuresTitle: "தளத்தின் முக்கிய அம்சங்கள்",
    feature1Title: "GIS நோய் கண்காணிப்பு வரைபடம்",
    feature1Desc: "அபாயங்களை உடனுக்குடன் வரைபடத்தில் காட்டுதல் மற்றும் நோய் பாதிப்புகளை கண்டறிதல்.",
    feature2Title: "உயிரி பாதுகாப்பு தணிக்கை",
    feature2Desc: "தினசரி இணக்க விகிதங்களை கணக்கிட்டு பண்ணையின் சராசரி நிலையை கண்காணித்தல்.",
    feature3Title: "வருகையாளர்கள் கண்காணிப்பு",
    feature3Desc: "பண்ணையினுள் நுழையும் நபர்கள் மற்றும் வாகனங்களின் கிருமிநாசினி தகவல்களை பதிவு செய்தல்.",
    feature4Title: "அபாய எச்சரிக்கை அமைப்பு",
    feature4Desc: "திடீர் இறப்புகள் அல்லது அறிகுறிகள் ஏற்பட்டால் உடனடியாக கால்நடை மருத்துவர்களுக்கு தெரிவித்தல்.",

    workflowTitle: "இயங்கும் முறை",
    step1Title: "1. தினசரி பதிவுகள்",
    step1Desc: "பண்ணையாளர்கள் தங்களின் தினசரி விவரங்களை தளத்தில் பதிவு செய்கிறார்கள்.",
    step2Title: "2. தானியங்கி பகுப்பாய்வு",
    step2Desc: "அமைப்பானது தரவுகளை ஒருங்கிணைத்து பண்ணையின் ஆபத்து குறியீட்டை கணக்கிடுகிறது.",
    step3Title: "3. கள ஆய்வு & தடுப்பு",
    step3Desc: "அதிகாரிகள் எச்சரிக்கைகளை சரிபார்த்து நோய்த்தடுப்பு பணிகளை மேற்கொள்கின்றனர்.",

    helplineTitle: "அவசர உதவி மற்றும் கட்டுப்பாட்டு மையம்",
    helplineDesc: "பண்ணையில் அதிக இறப்புகள் அல்லது வழக்கத்திற்கு மாறான அறிகுறிகள் தென்பட்டால் உடனடியாக கால்நடை அதிகாரிகளை தொடர்பு கொள்ளவும்.",
    phoneCall: "மாநில ஆலோசனை உதவி எண்:",
    emailCall: "மின்னஞ்சல் முகவரி:"
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
    footerTitle: "ഇന്ത്യയിലെ വിവിധ ജില്ലകളിലെ ബയോസെക്യൂരിറ്റി ഫാം മാനേജ്മെന്റിനായി വികസിപ്പിച്ചത്.",

    featuresTitle: "പ്രധാന സവിശേഷതകൾ",
    feature1Title: "ജി.ഐ.എസ് രോഗവ്യാപന മാപ്പിംഗ്",
    feature1Desc: "രോഗ ബാധിത പ്രദേശങ്ങൾ ഭൂപടത്തിൽ തത്സമയം അടയാളപ്പെടുത്തുന്നു.",
    feature2Title: "ബയോസെക്യൂരിറ്റി ഓഡിറ്റിംഗ്",
    feature2Desc: "ദൈനംദിന വിവരങ്ങളിലൂടെ ഫാമുകളുടെ സുരക്ഷാ നിലവാരം വിലയിരുത്തുന്നു.",
    feature3Title: "സന്ദർശക നിരീക്ഷണം",
    feature3Desc: "വാഹന ശുചീകരണ വിവരങ്ങളും സന്ദർശക വിവരങ്ങളും രേഖപ്പെടുത്തുന്നു.",
    feature4Title: "അടിയന്തിര മുന്നറിയിപ്പ്",
    feature4Desc: "അസ്വാഭാവിക മരണം സംഭവിച്ചാൽ ഉദ്യോഗസ്ഥരെ ഉടൻ അറിയിക്കുന്നു.",

    workflowTitle: "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു",
    step1Title: "1. വിവരങ്ങൾ രേഖപ്പെടുത്തുക",
    step1Desc: "കർഷകർ ഫാമിലെ വിവരങ്ങൾ ദിവസേന പോർട്ടലിൽ അപ്ഡേറ്റ് ചെയ്യുന്നു.",
    step2Title: "2. സുരക്ഷാ വിശകലനം",
    step2Desc: "സിസ്റ്റം വിവരങ്ങൾ വിശകലനം ചെയ്ത് സുരക്ഷാ ഇൻഡക്സ് കണക്കാക്കുന്നു.",
    step3Title: "3. രോഗനിയന്ത്രണം",
    step3Desc: "ഉദ്യോഗस्थർ വിവരങ്ങൾ പരിശോധിച്ച് ആവശ്യമായ പ്രതിരോധ മാർഗ്ഗങ്ങൾ നൽകുന്നു.",

    helplineTitle: "അടിയന്തിര സഹായ കേന്ദ്രം",
    helplineDesc: "അസ്വാഭാവിക ലക്ഷണങ്ങളോ മരണങ്ങളോ കാണുകയാണെങ്കിൽ ഉടൻ വെറ്ററിനറി ഉദ്യോഗസ്ഥരുമായി ബന്ധപ്പെടുക.",
    phoneCall: "സംസ്ഥാന കൺട്രോൾ റൂം നമ്പർ:",
    emailCall: "ഇമെയിൽ വിലാസം:"
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
    footerTitle: "भारतीय जिलों में पोल्ट्री और सुअर फार्मों में जैव-सुरक्षा प्रबंधन के लिए विकसित किया गया।" ,

    featuresTitle: "प्रमुख विशेषताएं",
    feature1Title: "जीआईएस हॉटस्पॉट मैपिंग",
    feature1Desc: "बीमारी प्रभावित क्षेत्रों का लाइव मानचित्रण और त्वरित जोखिम ट्रैकिंग।",
    feature2Title: "जैव-सुरक्षा ऑडिटिंग",
    feature2Desc: "दैनिक रिपोर्टों के माध्यम से अनुपालन दर और औसत स्कोर की गणना।",
    feature3Title: "संपर्क ट्रेसिंग",
    feature3Desc: "आगंतुकों और वाहनों के सैनिटाइजेशन रिकॉर्ड को दर्ज करना।",
    feature4Title: "त्वरित अलर्ट प्रेषण",
    feature4Desc: "असामान्य पक्षी मृत्यु की स्थिति में पशु चिकित्सकों को तत्काल सूचना भेजना।",

    workflowTitle: "कार्यप्रणाली",
    step1Title: "1. दैनिक जानकारी दर्ज करें",
    step1Desc: "किसान अपने डैशबोर्ड पर पक्षियों की संख्या और जैव-सुरक्षा विवरण दर्ज करते हैं।",
    step2Title: "2. जोखिम गणना",
    step2Desc: "सिस्टम डेटा एकत्र करके जोखिम सूचकांक तैयार करता है।",
    step3Title: "3. रोकथाम एवं उपचार",
    step3Desc: "अधिकारी अलर्ट का विश्लेषण करके निवारक उपाय लागू करते हैं।",

    helplineTitle: "आपातकालीन सहायता और नियंत्रण कक्ष",
    helplineDesc: "किसी भी असामान्य लक्षण या बीमारी के मामले में तुरंत पशु चिकित्सा अधिकारियों से संपर्क करें।",
    phoneCall: "राज्य हेल्पलाइन नंबर:",
    emailCall: "ईमेल आईडी:"
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
    footerTitle: "भारतीय जिल्ह्यांमधील पोल्ट्री आणि डुक्कर फार्म व्यवस्थापनासाठी विकसित केले गेले.",

    featuresTitle: "व्यासपीठाची वैशिष्ट्ये",
    feature1Title: "जीआयएस हॉटस्पॉट मॅपिंग",
    feature1Desc: "नकाशाद्वारे बाधित क्षेत्रांचे थेट ट्रॅकिंग आणि व्यवस्थापन करणे.",
    feature2Title: "जैव-सुरक्षा ऑडिट",
    feature2Desc: "दैनिक अहवालांद्वारे सुरक्षितता निर्देशांक मोजणे.",
    feature3Title: "संपर्क ट्रेसिंग",
    feature3Desc: "भेट देणाऱ्या व्यक्तींची आणि वाहनांची माहिती नोंदवणे.",
    feature4Title: "तातडीची सूचना",
    feature4Desc: "पक्षी मृत्यू वाढल्यास पशुवैद्यकीय डॉक्टरांना त्वरित इशारा देणे.",

    workflowTitle: "कार्यपद्धती कशी आहे?",
    step1Title: "1. दैनिक नोंद",
    step1Desc: "शेतकरी त्यांच्या डैशबोर्डवरून दैनंदिन कामांचे तपशील भरतात.",
    step2Title: "2. जोखीम विश्लेषण",
    step2Desc: "सिस्टम माहिती तपासून धोका स्तर निश्चित करते.",
    step3Title: "3. नियंत्रण व उपाय",
    step3Desc: "अधिकारी नोंदी तपासून त्वरित उपाययोजना सुचवतात आणि अमलात आणतात.",

    helplineTitle: "अतिदक्षता व नियंत्रण कक्ष",
    helplineDesc: "कोणतीही आजाराची लक्षणे किंवा जास्त पक्षी मृत्यू आढळल्यास नियंत्रण कक्षाशी संपर्क साधा.",
    phoneCall: "हेल्पलाइन क्रमांक:",
    emailCall: "ईमेल पत्ता:"
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
    footerTitle: "ભારતીય જિલ્લાઓમાં પોલ્ટ્રી અને ડુક્કર ફાર્મ વ્યવસ્થાપન માટે વિકસિત કરાયું.",

    featuresTitle: "પ્લેટફોર્મની સુવિધાઓ",
    feature1Title: "જીઆઈએસ હોટસ્પોટ મેપિંગ",
    feature1Desc: "રોગગ્રસ્ત વિસ્તારોનું જીવંત મેપિંગ અને વિઝ્યુઅલ ટ્રેકિંગ.",
    feature2Title: "જૈવ-સુરક્ષા ઓડિટ",
    feature2Desc: "દૈનિક રિપોર્ટ્સ દ્વારા સુરક્ષા અને પાલન દરની ગણતરી.",
    feature3Title: "મુલાકાતી ટ્રેકિંગ",
    feature3Desc: "ફાર્મમાં મુલાકાતીઓ અને વાહનોના સેનિટાઈઝેશનની નોંધણી.",
    feature4Title: "ઝડપી એલર્ટ સિસ્ટમ",
    feature4Desc: "રોગના ચિહ્નો અથવા પક્ષીઓના મોત પર પશુ ચિકિત્સકોને તાત્કાલિક જાણ કરવી.",

    workflowTitle: "કાર્યપ્રણાલી",
    step1Title: "1. દૈનિક વિગતો નોંધો",
    step1Desc: "ખેડૂતો ફાર્મના પક્ષીઓની સંખ્યા અને જૈવ-સુરક્ષાના આંકડા પોર્ટલમાં ભરે છે.",
    step2Title: "2. જોખમ વિશ્લેષણ",
    step2Desc: "સિસ્ટમ ડેટા પ્રોસેસ કરીને ફાર્મનો રિસ્ક ઇન્ડેક્સ તૈયાર કરે છે.",
    step3Title: "3. રોગ નિયંત્રણ",
    step3Desc: "અધિકારીઓ એલર્ટનું નિરીક્ષણ કરીને સ્થળ પર જરૂરી કામગીરી હાથ ધરે છે.",

    helplineTitle: "ઇમરજન્સી હેલ્પડેસ્ક અને કંટ્રોલ રૂમ",
    helplineDesc: "કોઈપણ ગંભીર લક્ષણો અથવા પક્ષીઓના મોતના કિસ્સામાં હેલ્પલાઇનનો ત્વરિત સંપર્ક કરો.",
    phoneCall: "રાજ્ય હેલ્પલાઇન નંબર:",
    emailCall: "ઈમેઈલ આઈડી:"
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

        {/* Features Capabilities Grid */}
        <div className="w-full max-w-5xl mt-20 space-y-6">
          <h3 className="text-xl font-bold text-center text-foreground">{t.featuresTitle}</h3>
          <div className="grid gap-6 md:grid-cols-2">
            
            <div className="bg-card border border-border p-5 rounded-2xl flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary p-3 rounded-xl shrink-0">
                <Sprout size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{t.feature1Title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.feature1Desc}</p>
              </div>
            </div>
            
            <div className="bg-card border border-border p-5 rounded-2xl flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary p-3 rounded-xl shrink-0">
                <ClipboardCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{t.feature2Title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.feature2Desc}</p>
              </div>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary p-3 rounded-xl shrink-0">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{t.feature3Title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.feature3Desc}</p>
              </div>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-500/10 text-risk-critical p-3 rounded-xl shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{t.feature4Title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.feature4Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Diagram */}
        <div className="w-full max-w-5xl mt-20 space-y-6 bg-secondary/30 border border-border p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-center text-foreground">{t.workflowTitle}</h3>
          <div className="grid gap-6 md:grid-cols-3 relative">
            <div className="space-y-2 text-center p-4 bg-card rounded-2xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto text-sm">1</div>
              <h4 className="font-bold text-xs text-foreground mt-2">{t.step1Title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{t.step1Desc}</p>
            </div>
            
            <div className="space-y-2 text-center p-4 bg-card rounded-2xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto text-sm">2</div>
              <h4 className="font-bold text-xs text-foreground mt-2">{t.step2Title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{t.step2Desc}</p>
            </div>

            <div className="space-y-2 text-center p-4 bg-card rounded-2xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto text-sm">3</div>
              <h4 className="font-bold text-xs text-foreground mt-2">{t.step3Title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{t.step3Desc}</p>
            </div>
          </div>
        </div>

        {/* Advisory / Helpline */}
        <div className="w-full max-w-5xl mt-20 space-y-4 bg-red-500/5 border border-red-500/20 p-6 rounded-2xl text-center">
          <h3 className="text-base font-bold text-risk-critical flex items-center justify-center gap-2">
            <ShieldAlert size={18} />
            {t.helplineTitle}
          </h3>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.helplineDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-2 text-xs font-bold">
            <div className="flex items-center gap-2 text-foreground">
              <PhoneCall size={14} className="text-primary" />
              <span>{t.phoneCall} <span className="font-mono text-primary">+91 44 2432 1000</span></span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <MailCheck size={14} className="text-primary" />
              <span>{t.emailCall} <span className="font-mono text-primary">incident-response@vet.gov.in</span></span>
            </div>
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
