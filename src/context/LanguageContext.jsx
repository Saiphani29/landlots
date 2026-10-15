import React, { createContext, useContext, useState, useEffect } from 'react';

// Comprehensive dictionary for English, Telugu (తెలుగు), and Hindi (हिन्दी)
export const TRANSLATIONS = {
  en: {
    // Top Bar & Nav
    nav_home: 'Home',
    nav_plots: 'Residential Plots',
    nav_agro: 'Agro Lands',
    nav_tools: 'Area Converter',
    nav_agents: 'Verified Advisors',
    nav_office_login: 'Office Login',
    nav_post_free: 'Post Free',
    nav_book_token: 'Book Token',
    campaign_tag: 'RERA & DTCP CERTIFIED PLOTS',
    campaign_headline: 'Direct Developer Land Deals with 0% Brokerage & 100% Clear Titles',
    campaign_cta: 'Claim Site Visit Free',

    // Hero Search
    hero_badge: '100% LEGALLY VERIFIED PLOTS',
    hero_title_prefix: 'Pure by Title,',
    hero_title_highlight: 'Verified by Law.',
    hero_subtitle: 'Explore DTCP, APCRDA & HMDA approved plots in Vijayawada, Guntur, Amaravati, and Hyderabad with guaranteed clear title deeds.',
    search_tab_plots: 'Plots & Layouts',
    search_tab_agro: 'Agricultural Farmlands',
    search_tab_commercial: 'Commercial Sites',
    search_placeholder: 'Search by locality (e.g. Kankipadu, Mangalagiri, Ibrahimpatnam)...',
    budget_all: 'All Budgets',
    budget_under30: 'Under ₹30 Lakhs',
    budget_30_50: '₹30L - ₹50 Lakhs',
    budget_50_1cr: '₹50L - ₹1 Crore',
    budget_above1cr: 'Above ₹1 Crore',
    facing_all: 'Any Facing',
    facing_east: 'East Facing',
    facing_west: 'West Facing',
    facing_north: 'North Facing',
    facing_south: 'South Facing',
    btn_search: 'Search Plots',
    btn_reset: 'Reset Filters',

    // Stats
    stat_properties: '1,450+ Verified Plots',
    stat_deals: '₹120+ Cr Land Transacted',
    stat_buyers: '3,800+ Happy Families',
    stat_rera: '100% RERA/DTCP Checked',

    // Category Explorer
    cat_title: 'Curated Land Categories',
    cat_all: 'All Properties',
    cat_plots: 'Residential Plots',
    cat_agro: 'Farm Lands',
    cat_commercial: 'Commercial Lands',
    cat_villas: 'Gated Communities',

    // Grid & Rail
    grid_title: 'Available Verified Land Parcels',
    grid_subtitle: 'Live verified registry plots ready for immediate spot registration & construction.',
    view_scroll: 'Scrollable Rail',
    view_grid: 'Standard Grid',
    sort_featured: 'Featured First',
    sort_low_high: 'Price: Low to High',
    sort_high_low: 'Price: High to Low',
    btn_site_visit: 'Site Visit',
    btn_book_token: 'Hold / Book Plot',
    btn_whatsapp: 'WhatsApp',
    badge_verified: 'VERIFIED',
    badge_sale: 'FOR SALE',

    // Property Specs
    spec_plot_area: 'Plot Area',
    spec_facing: 'Facing',
    spec_road: 'Road Width',

    // Payment & Booking Page
    pay_title: 'Official Plot Token Advance & Holding',
    pay_subtitle: 'Secure your exclusive plot reservation with 100% refundable token deposit under RERA guidelines.',
    pay_inventory_lock: 'Plot Reserved for You',
    pay_lock_desc: 'This plot is temporarily locked exclusively for your session. Complete payment to secure title rights.',
    pay_expires_in: 'Expires in',
    pay_buyer_details: '1. Buyer KYC Information',
    pay_name: 'Full Name (as per Aadhaar / PAN)',
    pay_phone: 'Mobile Number (for WhatsApp Receipt)',
    pay_email: 'Email Address',
    pay_pan: 'PAN Card Number (RERA Required)',
    pay_summary: 'Plot Reservation Summary',
    pay_plot_id: 'Plot ID',
    pay_total_price: 'Total Plot Consideration',
    pay_token_amount: 'Token Advance Due Now',
    pay_token_sub: 'Adjustable in final sale deed registration',
    pay_method_title: '2. Select Secure Payment Channel',
    pay_upi: 'UPI (GPay / PhonePe / Paytm / QR)',
    pay_netbanking: 'Internet Banking',
    pay_cards: 'Debit / Credit Card',
    pay_escrow: 'RERA Bank NEFT / RTGS',
    pay_upi_instruction: 'Scan QR with any UPI App or click your preferred app below:',
    pay_btn_confirm: 'Pay ₹25,000 & Confirm Plot Hold',
    pay_security_notice: 'Secured via 256-Bit SSL Encryption. Token deposited into Escrow Bank Account. 100% refund guarantee if not satisfied within 48 hours of physical inspection.',
    
    // Receipt
    receipt_title: 'Plot Reservation Confirmed!',
    receipt_subtitle: 'Your token advance has been recorded in the blockchain-backed office ledger.',
    receipt_tx_id: 'Transaction Reference',
    receipt_date: 'Date & Timestamp',
    receipt_plot: 'Property Reserved',
    receipt_amount_paid: 'Amount Paid',
    receipt_escrow: 'Designated RERA Escrow Account',
    receipt_print: 'Download Official Receipt (PDF)',
    receipt_done: 'Return to Website'
  },

  te: {
    // Telugu (తెలుగు)
    nav_home: 'హోమ్',
    nav_plots: 'రెసిడెన్షియల్ ప్లాట్లు',
    nav_agro: 'వ్యవసాయ భూములు',
    nav_tools: 'భూమి కొలతల కాలిక్యులేటర్',
    nav_agents: 'ధృవీకరించబడిన సలహాదారులు',
    nav_office_login: 'ఆఫీస్ లాగిన్',
    nav_post_free: 'ఉచితంగా పోస్ట్ చేయండి',
    nav_book_token: 'ప్లాట్ బుక్ చేయండి',
    campaign_tag: 'RERA & DTCP ఆమోదిత ప్లాట్లు',
    campaign_headline: '0% బ్రోకరేజ్ మరియు 100% స్పష్టమైన టైటిల్ డీడ్లతో నేరుగా భూమి ఒప్పందాలు',
    campaign_cta: 'ఉచిత సైట్ సందర్శనను బుక్ చేసుకోండి',

    // Hero Search
    hero_badge: '100% చట్టబద్ధంగా ధృవీకరించబడిన ప్లాట్లు',
    hero_title_prefix: 'స్పష్టమైన టైటిల్,',
    hero_title_highlight: 'చట్టపరంగా సురక్షితం.',
    hero_subtitle: 'విజయవాడ, గుంటూరు, అమరావతి మరియు హైదరాబాద్‌లలో DTCP, APCRDA & HMDA ఆమోదం పొందిన ప్లాట్లను తక్షణ రిజిస్ట్రేషన్‌తో ఎంచుకోండి.',
    search_tab_plots: 'ప్లాట్లు & లేఅవుట్లు',
    search_tab_agro: 'వ్యవసాయ భూములు',
    search_tab_commercial: 'వాణిజ్య స్థలాలు',
    search_placeholder: 'ప్రాంతం ద్వారా వెతకండి (ఉదా: కంకిపాడు, మంగళగిరి, ఇబ్రహీంపట్నం)...',
    budget_all: 'అన్ని బడ్జెట్లు',
    budget_under30: '₹30 లక్షల లోపు',
    budget_30_50: '₹30L - ₹50 లక్షలు',
    budget_50_1cr: '₹50L - ₹1 కోటి',
    budget_above1cr: '₹1 కోటి పైన',
    facing_all: 'ఏ ముఖమైనా',
    facing_east: 'తూర్పు ముఖం (East)',
    facing_west: 'పడమర ముఖం (West)',
    facing_north: 'ఉత్తర ముఖం (North)',
    facing_south: 'దక్షిణ ముఖం (South)',
    btn_search: 'ప్లాట్లను శోధించండి',
    btn_reset: 'ఫిల్టర్లు రీసెట్ చేయండి',

    // Stats
    stat_properties: '1,450+ ధృవీకరించిన ప్లాట్లు',
    stat_deals: '₹120+ కోట్ల లావాదేవీలు',
    stat_buyers: '3,800+ సంతృప్తి చెందిన కుటుంబాలు',
    stat_rera: '100% RERA/DTCP ఆమోదం',

    // Category Explorer
    cat_title: 'భూమి వర్గాలు',
    cat_all: 'అన్ని ఆస్తులు',
    cat_plots: 'రెసిడెన్షియల్ ప్లాట్లు',
    cat_agro: 'తోటలు & పొలాలు',
    cat_commercial: 'కమర్షియల్ స్థలాలు',
    cat_villas: 'గేటెడ్ కమ్యూనిటీలు',

    // Grid & Rail
    grid_title: 'అందుబాటులో ఉన్న ధృవీకరించిన ప్లాట్లు',
    grid_subtitle: 'స్పాట్ రిజిస్ట్రేషన్ మరియు తక్షణ గృహ నిర్మాణానికి సిద్ధంగా ఉన్న క్లియర్ టైటిల్ లేఅవుట్లు.',
    view_scroll: 'స్క్రోల్ వీక్షణ',
    view_grid: 'గ్రిడ్ వీక్షణ',
    sort_featured: 'ప్రత్యేకమైనవి ముందు',
    sort_low_high: 'ధర: తక్కువ నుండి ఎక్కువ',
    sort_high_low: 'ధర: ఎక్కువ నుండి తక్కువ',
    btn_site_visit: 'సైట్ విజిట్',
    btn_book_token: 'ప్లాట్ టోకెన్ బుకింగ్',
    btn_whatsapp: 'వాట్సాప్',
    badge_verified: 'ధృవీకరించబడింది',
    badge_sale: 'అమ్మకానికి ఉంది',

    // Property Specs
    spec_plot_area: 'ప్లాట్ విస్తీర్ణం',
    spec_facing: 'ముఖం',
    spec_road: 'రోడ్డు వెడల్పు',

    // Payment & Booking Page
    pay_title: 'అధికారిక ప్లాట్ టోకెన్ అడ్వాన్స్ & రిజర్వేషన్',
    pay_subtitle: 'RERA మార్గదర్శకాల ప్రకారం 100% వాపసు హామీతో మీ ప్రత్యేక ప్లాట్‌ను రిజర్వ్ చేసుకోండి.',
    pay_inventory_lock: 'మీ కోసం లాక్ చేయబడింది',
    pay_lock_desc: 'ఈ ప్లాట్ మీ కోసం ప్రత్యేకంగా 15 నిమిషాలు లాక్ చేయబడింది. ప్లాట్ హక్కులను భద్రపరచడానికి టోకెన్ పూర్తి చేయండి.',
    pay_expires_in: 'గడువు సమయం',
    pay_buyer_details: '1. కొనుగోలుదారు వివరాలు (KYC)',
    pay_name: 'పూర్తి పేరు (ఆధార్ / పాన్ ప్రకారం)',
    pay_phone: 'మొబైల్ నంబర్ (రసీదు కొరకు)',
    pay_email: 'ఈమెయిల్ చిరునామా',
    pay_pan: 'పాన్ కార్డ్ నంబర్ (RERA నిబంధన)',
    pay_summary: 'ప్లాట్ బుకింగ్ వివరాలు',
    pay_plot_id: 'ప్లాట్ నంబర్/ID',
    pay_total_price: 'మొత్తం ప్లాట్ విలువ',
    pay_token_amount: 'చెల్లించాల్సిన టోకెన్ అడ్వాన్స్',
    pay_token_sub: 'రిజిస్ట్రేషన్ సమయంలో మొత్తం ధరలో సర్దుబాటు చేయబడుతుంది',
    pay_method_title: '2. సురక్షిత చెల్లింపు పద్ధతిని ఎంచుకోండి',
    pay_upi: 'UPI (GPay / PhonePe / Paytm / QR)',
    pay_netbanking: 'నెట్ బ్యాంకింగ్',
    pay_cards: 'డెబిట్ / క్రెడిట్ కార్డు',
    pay_escrow: 'RERA ఎస్క్రో బ్యాంక్ NEFT / RTGS',
    pay_upi_instruction: 'ఏదైనా UPI యాప్‌తో QR కోడ్‌ను స్కాన్ చేయండి లేదా క్రింద ఎంచుకోండి:',
    pay_btn_confirm: '₹25,000 చెల్లించి ప్లాట్ బుక్ చేయండి',
    pay_security_notice: '256-బిట్ SSL ఎన్క్రిప్షన్ ద్వారా రక్షించబడింది. చెల్లింపు RERA ఎస్క్రో ఖాతాలో జమ అవుతుంది. 48 గంటల్లో సైట్ నచ్చకపోతే 100% పూర్తి వాపసు హామీ.',

    // Receipt
    receipt_title: 'ప్లాట్ రిజర్వేషన్ విజయవంతమైంది!',
    receipt_subtitle: 'మీ టోకెన్ చెల్లింపు కార్యాలయ లెడ్జర్‌లో నమోదు చేయబడింది.',
    receipt_tx_id: 'లావాదేవీ సంఖ్య (Tx ID)',
    receipt_date: 'తేదీ & సమయం',
    receipt_plot: 'రిజర్వ్ చేసిన ప్లాట్',
    receipt_amount_paid: 'చెల్లించిన మొత్తం',
    receipt_escrow: 'RERA అధికారిక ఎస్క్రో ఖాతా',
    receipt_print: 'అధికారిక రసీదును డౌన్‌లోడ్ చేయండి (PDF)',
    receipt_done: 'తిరిగి హోమ్‌పేజీకి వెళ్ళండి'
  },

  hi: {
    // Hindi (हिन्दी)
    nav_home: 'होम',
    nav_plots: 'आवासीय प्लॉट्स',
    nav_agro: 'कृषि भूमि',
    nav_tools: 'भूमि क्षेत्र कनवर्टर',
    nav_agents: 'सत्यापित सलाहकार',
    nav_office_login: 'कार्यालय लॉगिन',
    nav_post_free: 'मुफ़्त लिस्टिंग करें',
    nav_book_token: 'प्लॉट बुक करें',
    campaign_tag: 'RERA एवं DTCP स्वीकृत प्लॉट्स',
    campaign_headline: '0% ब्रोकरेज और 100% स्पष्ट टाइटल विलेखों के साथ सीधे ज़मीन के सौदे',
    campaign_cta: 'मुफ्त साइट विजिट बुक करें',

    // Hero Search
    hero_badge: '100% कानूनी रूप से सत्यापित प्लॉट्स',
    hero_title_prefix: 'स्पष्ट विलेख,',
    hero_title_highlight: 'कानूनी रूप से सुरक्षित।',
    hero_subtitle: 'विजयवाड़ा, गुंटूर, अमरावती और हैदराबाद में DTCP, APCRDA एवं HMDA द्वारा स्वीकृत प्लॉट्स का तत्काल पंजीकरण कराएं।',
    search_tab_plots: 'प्लॉट्स और लेआउट',
    search_tab_agro: 'कृषि फार्मलैंड्स',
    search_tab_commercial: 'वाणिज्यिक भूमि',
    search_placeholder: 'इलाके द्वारा खोजें (जैसे: कंकिपाडु, मंगलागिरी, इब्राहिमपटनम)...',
    budget_all: 'सभी बजट',
    budget_under30: '₹30 लाख से कम',
    budget_30_50: '₹30L - ₹50 लाख',
    budget_50_1cr: '₹50L - ₹1 करोड़',
    budget_above1cr: '₹1 करोड़ से अधिक',
    facing_all: 'कोई भी दिशा',
    facing_east: 'पूर्व दिशा (East)',
    facing_west: 'पश्चिम दिशा (West)',
    facing_north: 'उत्तर दिशा (North)',
    facing_south: 'दक्षिण दिशा (South)',
    btn_search: 'प्लॉट खोजें',
    btn_reset: 'फ़िल्टर हटाएं',

    // Stats
    stat_properties: '1,450+ सत्यापित प्लॉट्स',
    stat_deals: '₹120+ करोड़ के सौदे',
    stat_buyers: '3,800+ संतुष्ट परिवार',
    stat_rera: '100% RERA/DTCP प्रमाणित',

    // Category Explorer
    cat_title: 'भूमि श्रेणियां',
    cat_all: 'सभी संपत्तियां',
    cat_plots: 'आवासीय प्लॉट्स',
    cat_agro: 'फार्म लैंड्स',
    cat_commercial: 'व्यावसायिक भूमि',
    cat_villas: 'गेटेड कम्युनिटीज',

    // Grid & Rail
    grid_title: 'उपलब्ध सत्यापित प्लॉट्स',
    grid_subtitle: 'तत्काल स्पॉट रजिस्ट्रेशन और तुरंत निर्माण के लिए पूरी तरह से तैयार लेआउट्स।',
    view_scroll: 'स्क्रोल दृश्य',
    view_grid: 'ग्रिड दृश्य',
    sort_featured: 'विशेष प्लॉट्स पहले',
    sort_low_high: 'कीमत: कम से ज्यादा',
    sort_high_low: 'कीमत: ज्यादा से कम',
    btn_site_visit: 'साइट विजिट',
    btn_book_token: 'प्लॉट टोकन बुक करें',
    btn_whatsapp: 'व्हाट्सएप',
    badge_verified: 'सत्यापित',
    badge_sale: 'बिक्री हेतु',

    // Property Specs
    spec_plot_area: 'प्लॉट का आकार',
    spec_facing: 'दिशा',
    spec_road: 'सड़क की चौड़ाई',

    // Payment & Booking Page
    pay_title: 'आधिकारिक प्लॉट टोकन अग्रिम एवं आरक्षण',
    pay_subtitle: 'RERA नियमों के तहत 100% रिफंडेबल गारंटी के साथ अपना विशेष प्लॉट तुरंत लॉक करें।',
    pay_inventory_lock: 'आपके लिए आरक्षित',
    pay_lock_desc: 'यह प्लॉट आपके लिए 15 मिनट के लिए लॉक है। प्लॉट को सुरक्षित करने हेतु टोकन भुगतान पूरा करें।',
    pay_expires_in: 'शेष समय',
    pay_buyer_details: '1. खरीदार की जानकारी (KYC)',
    pay_name: 'पूरा नाम (आधार / पैन के अनुसार)',
    pay_phone: 'मोबाइल नंबर (व्हाट्सएप रसीद के लिए)',
    pay_email: 'ईमेल पता',
    pay_pan: 'पैन कार्ड नंबर (RERA आवश्यकता)',
    pay_summary: 'प्लॉट आरक्षण सारांश',
    pay_plot_id: 'प्लॉट आईडी',
    pay_total_price: 'कुल प्लॉट मूल्य',
    pay_token_amount: 'देय टोकन अग्रिम',
    pay_token_sub: 'अंतिम बिक्री पंजीकरण विलेख में समायोजित किया जाएगा',
    pay_method_title: '2. सुरक्षित भुगतान माध्यम चुनें',
    pay_upi: 'UPI (GPay / PhonePe / Paytm / QR)',
    pay_netbanking: 'इंटरनेट बैंकिंग',
    pay_cards: 'डेबिट / क्रेडिट कार्ड',
    pay_escrow: 'RERA एस्क्रो बैंक NEFT / RTGS',
    pay_upi_instruction: 'किसी भी UPI ऐप से QR कोड स्कैन करें या नीचे क्लिक करें:',
    pay_btn_confirm: '₹25,000 भुगतान करें और प्लॉट आरक्षित करें',
    pay_security_notice: '256-बिट SSL एन्क्रिप्शन द्वारा सुरक्षित। टोकन राशि RERA एस्क्रो खाते में जमा होती है। 48 घंटे के भीतर निरीक्षण पसंद न आने पर 100% धन वापसी गारंटी।',

    // Receipt
    receipt_title: 'प्लॉट आरक्षण सफल रहा!',
    receipt_subtitle: 'आपका टोकन अग्रिम आधिकारिक बहीखाते (Ledger) में दर्ज कर लिया गया है।',
    receipt_tx_id: 'लेन-देन संदर्भ संख्या (Tx ID)',
    receipt_date: 'दिनांक एवं समय',
    receipt_plot: 'आरक्षित संपत्ति',
    receipt_amount_paid: 'भुगतान की गई राशि',
    receipt_escrow: 'RERA आधिकारिक एस्क्रो खाता',
    receipt_print: 'आधिकारिक रसीद डाउनलोड करें (PDF)',
    receipt_done: 'वेबसाइट पर वापस जाएं'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Check local storage for language, default to 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('landlots_lang') || 'en';
  });

  const changeLanguage = (langCode) => {
    if (['en', 'te', 'hi'].includes(langCode)) {
      setLanguage(langCode);
      localStorage.setItem('landlots_lang', langCode);
    }
  };

  const t = (key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
