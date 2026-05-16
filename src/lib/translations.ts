
export type Language = 'en' | 'bn';

export const translations = {
  en: {
    dashboard: {
      welcomeMorning: "Good Morning",
      welcomeAfternoon: "Good Afternoon",
      welcomeEvening: "Good Evening",
      workspaceTitle: "Your professional digital workspace. Everything you need to create, edit, and manage your digital assets in one place.",
      activeTools: "Active Tools",
      trial: "Trial",
      freeUseAvailable: "1 Free Use Available",
      freeAccountSmall: "1 CV / 2 Tool uses",
      freeAccountNotice: "You have 1 free coin. Use it for 1 CV or 2 other tools.",
      premiumBanner: "GET PREMIUM ACCESS:",
      adminLogin: "Admin Login",
      logout: "Logout",
      newUserGift: "New User? Get Free Access!",
      newUserInfo: "Includes 1 CV and 2 uses of all other tools.",
      getFreeAccess: "Get Free Access",
      freeAccessSuccess: "Congratulations! You have got free access.",
      home: "Home",
      pricing: "Pricing",
      contactUs: "Contact Us",
      tools: {
        ai: "Maksud Intelligent AI",
        cv: "CV Builder",
        photoEditor: "Photo Editor",
        bgRemover: "BG Remover",
        resizer: "Photo Resizer",
        pdfEditor: "PDF Editor",
        pdfToImg: "PDF to Image",
        pdfToWord: "PDF to Word",
        pdfCompress: "PDF Compress",
        pdfMerge: "PDF Merge",
        imgToPdf: "Image to PDF",
        ageCalc: "Age Calculator",
        converter: "Digital Converter",
        inheritance: "Inheritance Calculator",
        translator: "AI Translator",
        scanner: "Scanner & QR",
        pdfGroup: "PDF Power Tools"
      },
      toolDescriptions: {
        ai: "Advanced AI Chat powered by Gemini 1.5 Flash.",
        cv: "Create professional CVs with multiple templates.",
        photoEditor: "AI Background removal, upscaling & retouching.",
        bgRemover: "Remove background from any image instantly.",
        resizer: "Crop and resize by pixels or inches.",
        pdfEditor: "Import, edit text and images in PDF files.",
        pdfToImg: "Convert PDF pages to high-quality images.",
        pdfToWord: "Extract text from PDF to Word document.",
        pdfCompress: "Reduce PDF file size without losing quality.",
        pdfMerge: "Combine multiple PDF files into one.",
        imgToPdf: "Convert images into a professional PDF.",
        ageCalc: "Calculate exact age and next birthday.",
        converter: "Convert Currency, Length, Weight and Area.",
        inheritance: "Calculate Islamic inheritance shares for heirs.",
        translator: "Translate any language to any language instantly.",
        scanner: "Generate and scan QR/Barcodes (PDF417, etc).",
        pdfGroup: "Merge, compress, convert and edit PDF files."
      },
      pdf: {
        uploadTitle: "Click or drag to upload",
        selectedFiles: "Selected Files",
        processing: "Processing...",
        processingComplete: "Processing complete! Your files have been downloaded.",
        start: "Start Processing",
        pdfOnly: "PDF files only",
        imgOnly: "Images (JPG, PNG, etc.)",
        backToDashboard: "Dashboard",
        mergeError: "Please select at least 2 PDF files to merge.",
        failedToConvert: "Failed to convert PDF.",
        failedToCompress: "Failed to compress PDF.",
        failedToMerge: "Failed to merge PDF files.",
        failedToWord: "Failed to convert PDF to Word."
      }
    },
    pricing: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the coin pack that fits your needs. Coins never expire and can be used for any tool.",
      popular: "Most Popular",
      oneTime: "one-time",
      addCoins: "Add Coins",
      features: {
        coins: "Coins",
        access: "All Tools Access",
        expiry: "No Expiry"
      },
      payment: {
        title: "Payment Instructions",
        subtitle: "Follow the steps below to add coins",
        step1: "bKash Payment",
        steps: [
          "Go to bKash App",
          "Select 'Payment' option",
          "Enter Merchant No: 01868257470",
          "Complete the payment"
        ],
        form: {
          amount: "Amount (TK)",
          mobile: "Mobile No",
          trxId: "Transaction ID",
          name: "Full Name",
          comments: "Comments (Optional)",
          submit: "Submit Request",
          submitting: "Submitting..."
        }
      }
    },
    about: {
      title: "About Maksud Computer",
      welcome: "Welcome to Maksud Computer",
      description: "Maksud Computer is a leading digital service provider located in Jamalpur, Bangladesh. We specialize in digital documentation, AI-powered tools, and professional workspace solutions.",
      vision: "Our Vision",
      visionText: "To provide accessible, high-quality digital tools to everyone, making professional documentation and media editing simple and efficient.",
      services: "Our Services",
      location: "Location",
      address: "Nandina Road, Narundi Bazar, Jamalpur Sadar, Jamalpur",
      founder: "Founder & CEO",
      founderName: "Maksudul Hasan"
    }
  },
  bn: {
    dashboard: {
      welcomeMorning: "শুভ সকাল",
      welcomeAfternoon: "শুভ অপরাহ্ন",
      welcomeEvening: "শুভ সন্ধ্যা",
      workspaceTitle: "আপনার পেশাদার ডিজিটাল ওয়ার্কস্পেস। আপনার ডিজিটাল সম্পদ তৈরি, সম্পাদনা এবং পরিচালনা করার জন্য প্রয়োজনীয় সবকিছু এক জায়গায়।",
      activeTools: "সক্রিয় টুলস",
      trial: "ট্রায়াল",
      freeUseAvailable: "১টি ফ্রি ব্যবহার উপলব্ধ",
      freeAccountSmall: "১টি সিভি / ২টি টুলস ব্যবহার",
      freeAccountNotice: "আপনার ১টি ফ্রি কয়েন আছে। এটি ১টি সিভি বা অন্য ২টি টুলসের জন্য ব্যবহার করুন।",
      premiumBanner: "প্রিমিয়াম এক্সেস পান:",
      adminLogin: "এডমিন লগইন",
      logout: "লগআউট",
      newUserGift: "নতুন ইউজার? ফ্রি এক্সেস পান!",
      newUserInfo: "১টি সিভি এবং অন্য সকল টুলসের ২বার ব্যবহার",
      getFreeAccess: "ফ্রি এক্সেস নিন",
      freeAccessSuccess: "অভিনন্দন! আপনি ফ্রি এক্সেস পেয়েছেন।",
      home: "হোম",
      pricing: "মূল্য নির্ধারণ",
      contactUs: "যোগাযোগ করুন",
      tools: {
        ai: "মাকসুদ ইন্টেলিজেন্ট এআই",
        cv: "সিভি বিল্ডার",
        photoEditor: "ফটো এডিটর",
        bgRemover: "বিজি রিমুভার",
        resizer: "ফটো রিসাইজার",
        pdfEditor: "পিডিএফ এডিটর",
        pdfToImg: "পিডিএফ থেকে ইমেজ",
        pdfToWord: "পিডিএফ থেকে ওয়ার্ড",
        pdfCompress: "পিডিএফ কম্প্রেস",
        pdfMerge: "পিডিএফ মার্জ",
        imgToPdf: "ইমেজ থেকে পিডিএফ",
        ageCalc: "বয়স ক্যালকুলেটর",
        converter: "ডিজিটাল কনভার্টার",
        inheritance: "উত্তরাধিকার ক্যালকুলেটর",
        translator: "এআই অনুবাদক",
        scanner: "স্ক্যানার ও কিউআর",
        pdfGroup: "পিডিএফ পাওয়ার টুলস"
      },
      toolDescriptions: {
        ai: "জেমিনি ১.৫ ফ্ল্যাশ দ্বারা চালিত উন্নত এআই চ্যাট।",
        cv: "বিভিন্ন টেমপ্লেট দিয়ে পেশাদার সিভি তৈরি করুন।",
        photoEditor: "এআই ব্যাকগ্রাউন্ড রিমুভাল, আপস্কেলিং এবং রিটাচিং।",
        bgRemover: "যেকোনো ছবি থেকে তাৎক্ষণিকভাবে ব্যাকগ্রাউন্ড সরান।",
        resizer: "পিক্সেল বা ইঞ্চি দিয়ে ক্রপ এবং রিসাইজ করুন।",
        pdfEditor: "পিডিএফ ফাইলে টেক্সট এবং ইমেজ ইমপোর্ট ও এডিট করুন।",
        pdfToImg: "পিডিএফ পেজগুলোকে উচ্চ-মানের ইমেজে রূপান্তর করুন।",
        pdfToWord: "পিডিএফ থেকে ওয়ার্ড ডকুমেন্টে টেক্সট এক্সট্রাক্ট করুন।",
        pdfCompress: "গুণমান না হারিয়েই পিডিএফ ফাইলের সাইজ কমান।",
        pdfMerge: "একাধিক পিডিএফ ফাইলকে একটিিতে সংযুক্ত করুন।",
        imgToPdf: "ছবিগুলোকে একটি পেশাদার পিডিএফে রূপান্তর করুন।",
        ageCalc: "সঠিক বয়স এবং পরবর্তী জন্মদিন গণনা করুন।",
        converter: "কারেন্সি, দৈর্ঘ্য, ওজন এবং ক্ষেত্রফল রূপান্তর করুন।",
        inheritance: "ইসলামিক নিয়ম অনুযায়ী উত্তরাধিকারীদের শেয়ার গণনা করুন।",
        translator: "যেকোনো ভাষা থেকে অন্য ভাষায় তাৎক্ষণিকভাবে অনুবাদ করুন।",
        scanner: "কিউআর এবং বারকোড তৈরি ও স্ক্যান করুন (PDF417 সহ)।",
        pdfGroup: "পিডিএফ ফাইল মার্জ, কমপ্রেস, কনভার্ট এবং এডিট করুন।"
      },
    },
    pdf: {
      uploadTitle: "আপলোড করতে ক্লিক করুন বা ড্র্যাগ করুন",
      selectedFiles: "নির্বাচিত ফাইলসমূহ",
      processing: "প্রসেসিং হচ্ছে...",
      processingComplete: "প্রসেসিং সম্পন্ন হয়েছে! আপনার ফাইলগুলো ডাউনলোড করা হয়েছে।",
      start: "প্রসেসিং শুরু করুন",
      pdfOnly: "শুধুমাত্র পিডিএফ ফাইল",
      imgOnly: "ছবি (জেপিজি, পিএনজি ইত্যাদি)",
      backToDashboard: "ড্যাশবোর্ড",
      mergeError: "একত্রিত করার জন্য কমপক্ষে ২টি পিডিএফ ফাইল নির্বাচন করুন।",
      failedToConvert: "পিডিএফ রূপান্তর করতে ব্যর্থ হয়েছে।",
      failedToCompress: "পিডিএফ কমপ্রেস করতে ব্যর্থ হয়েছে।",
      failedToMerge: "পিডিএফ ফাইল একত্রিত করতে ব্যর্থ হয়েছে।",
      failedToWord: "পিডিএফ থেকে ওয়ার্ডে রূপান্তর করতে ব্যর্থ হয়েছে।"
    },
    pricing: {
      title: "সহজ ও স্বচ্ছ মূল্যতালিকা",
      subtitle: "আপনার প্রয়োজন অনুযায়ী কয়েন প্যাক বেছে নিন। কয়েন কখনো মেয়াদোত্তীর্ণ হয় না এবং যেকোনো টুলের জন্য ব্যবহার করা যায়।",
      popular: "সবচেয়ে জনপ্রিয়",
      oneTime: "এককালীন",
      addCoins: "কয়েন কিনুন",
      features: {
        coins: "কয়েন",
        access: "সকল টুলস এক্সেস",
        expiry: "মেয়াদ নেই"
      },
      payment: {
        title: "পেমেন্ট নির্দেশাবলী",
        subtitle: "কয়েন যোগ করতে নিচের ধাপগুলো অনুসরণ করুন",
        step1: "বিকাশ পেমেন্ট",
        steps: [
          "বিকাশ অ্যাপে যান",
          "পেমেন্ট অপশনটি বেছে নিন",
          "মার্চেন্ট নম্বর দিন: 01868257470",
          "পেমেন্ট সম্পন্ন করুন"
        ],
        form: {
          amount: "টাকার পরিমাণ (TK)",
          mobile: "মোবাইল নম্বর",
          trxId: "ট্রানজ্যাকশন আইডি",
          name: "পুরো নাম",
          comments: "মন্তব্য (ঐচ্ছিক)",
          submit: "অনুরোধ পাঠান",
          submitting: "পাঠানো হচ্ছে..."
        }
      }
    },
    about: {
      title: "মাকসুদ কম্পিউটার সম্পর্কে",
      welcome: "মাকসুদ কম্পিউটারে স্বাগতম",
      description: "মাকসুদ কম্পিউটার বাংলাদেশের জামালপুরে অবস্থিত একটি শীর্ষস্থানীয় ডিজিটাল সেবা প্রদানকারী প্রতিষ্ঠান। আমরা ডিজিটাল ডকুমেন্টেশন, এআই-চালিত টুলস এবং পেশাদার ওয়ার্কস্পেস সলিউশনে বিশেষজ্ঞ।",
      vision: "আমাদের লক্ষ্য",
      visionText: "সবার জন্য সহজলভ্য, উচ্চ-মানের ডিজিটাল টুলস প্রদান করা, যাতে পেশাদার ডকুমেন্টেশন এবং মিডিয়া এডিটিং সহজ ও দক্ষ হয়।",
      services: "আমাদের সেবাসমূহ",
      location: "অবস্থান",
      address: "নান্দিনা রোড, নরুন্দি বাজার, জামালপুর সদর, জামালপুর",
      founder: "প্রতিষ্ঠাতা ও সিইও",
      founderName: "মাকসুদুল হাসান"
    }
  }
};
