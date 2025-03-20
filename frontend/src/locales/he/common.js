// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    survey: {
      email: null,
      useCase: null,
      useCaseWork: null,
      useCasePersonal: null,
      useCaseOther: null,
      comment: null,
      commentPlaceholder: null,
      skip: null,
      thankYou: null,
      title: null,
      description: null,
    },
    home: {
      title: null,
      getStarted: null,
    },
    llm: {
      title: null,
      description: null,
    },
    userSetup: {
      title: null,
      description: null,
      howManyUsers: null,
      justMe: null,
      myTeam: null,
      instancePassword: null,
      setPassword: null,
      passwordReq: null,
      passwordWarn: null,
      adminUsername: null,
      adminUsernameReq: null,
      adminPassword: null,
      adminPasswordReq: null,
      teamHint: null,
    },
    data: {
      title: null,
      description: null,
      settingsHint: null,
    },
    workspace: {
      title: null,
      description: null,
    },
  },
  common: {
    "workspaces-name": "שם סביבת העבודה",
    error: "שגיאה",
    success: "הצלחה",
    user: "משתמש",
    selection: "בחירת מודל",
    saving: "שמירה...",
    save: "שמור שינויים",
    previous: "עמוד קודם",
    next: "עמוד הבא",
    optional: null,
    yes: null,
    no: null,
  },
  settings: {
    title: "הגדרות מופע",
    system: "הגדרות כלליות",
    invites: "הזמנות",
    users: "משתמשים",
    workspaces: "סביבות עבודה",
    "workspace-chats": "שיחות סביבת עבודה",
    customization: "התאמה אישית",
    "api-keys": "מפתח API למפתחים",
    llm: "LLM",
    transcription: "העתקה",
    embedder: "הטמעה",
    "text-splitting": "מפריד טקסט וחלוקה",
    "voice-speech": "קול ודיבור",
    "vector-database": "בסיס נתונים וקטור",
    embeds: "הטמעת צ'אט",
    "embed-chats": "היסטוריית הטמעת צ'אט",
    security: "אבטחה",
    "event-logs": "יומני אירועים",
    privacy: "פרטיות ונתונים",
    "ai-providers": "ספקי AI",
    "agent-skills": "כישורי סוכן",
    admin: "מנהל",
    tools: "כלים",
    "experimental-features": "תכונות ניסיוניות",
    contact: "צור קשר עם התמיכה",
    "browser-extension": "תוסף דפדפן",
  },
  login: {
    "multi-user": {
      welcome: "ברוכים הבאים ל-",
      "placeholder-username": "שם משתמש",
      "placeholder-password": "סיסמה",
      login: "התחבר",
      validating: "מאמת...",
      "forgot-pass": "שכחת סיסמה?",
      reset: "איפוס",
    },
    "sign-in": {
      start: "התחבר לחשבון שלך ב-",
      end: ".",
    },
    "password-reset": {
      title: "איפוס סיסמה",
      description: "ספק את המידע הדרוש להלן כדי לאפס את הסיסמה שלך.",
      "recovery-codes": "קודי שחזור",
      "recovery-code": "קוד שחזור {{index}}",
      "back-to-login": "חזרה להתחברות",
    },
  },
  welcomeMessage: {
    part1:
      "ברוכים הבאים ל-ModelRun, ModelRun היא כלי AI קוד פתוח מאת Mintplex Labs שהופך כל דבר לצ'אטבוט מאומן שאפשר לשאול אותו ולקיים איתו שיחה. ModelRun הוא תוכנה מסוג BYOK (הביא את המפתחות שלך) כך שאין מנוי, עמלה או חיובים עבור התוכנה הזו מלבד השירותים שאתה רוצה להשתמש בהם.",
    part2:
      "ModelRun היא הדרך הקלה ביותר לשלב מוצרים חזקים של AI כמו OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB ושירותים אחרים בחבילה אחת ללא מאמץ כדי להגדיל את הפרודוקטיביות שלך פי 100.",
    part3:
      "ModelRun יכול לפעול באופן מקומי לחלוטין על המחשב שלך עם מעט עלויות ביצוע שאתה אפילו לא תבחין בהן! לא נדרש GPU. התקנה בענן ובמקום היא זמינה גם כן.\nמערכת הכלים של AI הופכת חזקה יותר מדי יום. ModelRun הופכת את השימוש בה פשוט.",
    githubIssue: "צור בעיה ב-GitHub",
    user1: "איך אני מתחיל?!",
    part4:
      "זה פשוט. כל אוסף מאורגן לדליים שאנחנו קוראים להם 'סביבות עבודה'. סביבות עבודה הן דליים של קבצים, מסמכים, תמונות, PDF וקבצים אחרים שיהפכו למשהו ש-LLM יכולות להבין ולעשות איתו שימוש בשיחה.\n\nתוכל להוסיף ולהסיר קבצים בכל עת.",
    createWorkspace: "צור את סביבת העבודה הראשונה שלך",
    user2: "האם זה כמו Dropbox AI או משהו כזה? מה לגבי צ'אט? זה צ'אטבוט לא?",
    part5:
      "ModelRun היא יותר מ-Dropbox חכם יותר.\n\nModelRun מציעה שתי דרכים לשוחח עם הנתונים שלך:\n\n<i>שאילתה:</i> השיחות שלך יחזירו נתונים או מסקנות שנמצאות במסמכים בסביבת העבודה שלך אליה יש לה גישה. הוספת עוד מסמכים לסביבת העבודה הופכת אותה לחכמה יותר! \n\n<i>שיחה:</i> המסמכים שלך + היסטוריית השיחה הנוכחית שלך תורמות יחד לידע של LLM בו זמנית. נהדר להוספת מידע טקסטואלי בזמן אמת או תיקונים וחוסר הבנות שאולי יהיו ל-LLM.\n\nאתה יכול לעבור בין שני המצבים \n<i>אפילו באמצע שיחה!</i>",
    user3: "וואו, זה נשמע מדהים, תן לי לנסות את זה כבר!",
    part6: "תהנה!",
    starOnGitHub: "שים כוכב ב-GitHub",
    contact: "צור קשר עם Mintplex Labs",
  },
  "new-workspace": {
    title: "סביבת עבודה חדשה",
    placeholder: "סביבת העבודה שלי",
  },
  "workspaces—settings": {
    general: "הגדרות כלליות",
    chat: "הגדרות צ'אט",
    vector: "בסיס נתונים וקטור",
    members: "חברים",
    agent: "קונפיגורציה של סוכן",
  },
  general: {
    vector: {
      title: "ספירת וקטורים",
      description: "מספר הווקטורים הכולל בבסיס הנתונים הווקטורי שלך.",
    },
    names: {
      description: "זה ישנה רק את שם התצוגה של סביבת העבודה שלך.",
    },
    message: {
      title: "הודעות הצ'אט המוצעות",
      description: "התאם אישית את ההודעות שיוצעו למשתמשי סביבת העבודה שלך.",
      add: "הוסף הודעה חדשה",
      save: "שמור הודעות",
      heading: "הסבר לי",
      body: "את היתרונות של ModelRun",
    },
    pfp: {
      title: "תמונת פרופיל של עוזר",
      description:
        "התאם אישית את תמונת הפרופיל של העוזר עבור סביבת העבודה הזו.",
      image: "תמונת סביבת עבודה",
      remove: "הסר תמונת סביבת עבודה",
    },
    delete: {
      title: "מחק סביבת עבודה",
      description:
        "מחק סביבת עבודה זו וכל הנתונים שלה. זה ימחק את סביבת העבודה עבור כל המשתמשים.",
      delete: "מחק סביבת עבודה",
      deleting: "מוחק סביבת עבודה...",
      "confirm-start": "אתה עומד למחוק את כל",
      "confirm-end":
        "סביבת העבודה שלך. זה ימחק את כל הטבעות הווקטוריות בבסיס הנתונים הווקטורי שלך.\n\nקבצי המקור המקוריים יישארו ללא שינוי. פעולה זו היא בלתי הפיכה.",
    },
  },
  chat: {
    llm: {
      title: "ספק LLM של סביבת עבודה",
      description:
        "ספק LLM ספציפי ודגם שייעשה בו שימוש עבור סביבת העבודה הזו. כברירת מחדל, הוא משתמש בספק LLM ובהגדרות של המערכת.",
      search: "חפש בכל ספקי LLM",
    },
    model: {
      title: "דגם צ'אט של סביבת עבודה",
      description:
        "דגם הצ'אט הספציפי שייעשה בו שימוש עבור סביבת העבודה הזו. אם הוא ריק, ייעשה שימוש בהעדפת LLM של המערכת.",
      wait: "-- מחכה לדגמים --",
    },
    mode: {
      title: "מצב צ'אט",
      chat: {
        title: "צ'אט",
        "desc-start": "יספק תשובות עם הידע הכללי של LLM",
        and: "ו-",
        "desc-end": "הקשר של המסמך שנמצא.",
      },
      query: {
        title: "שאילתה",
        "desc-start": "יספק תשובות",
        only: "רק",
        "desc-end": "אם נמצא הקשר של מסמך.",
      },
    },
    history: {
      title: "היסטוריית צ'אט",
      "desc-start": "מספר הצ'אטים הקודמים שייכללו בזכרון קצר הטווח של התגובה.",
      recommend: "מומלץ: 20. ",
      "desc-end":
        "כל דבר מעל 45 עשוי להוביל לכשלים רציפים בצ'אט תלוי בגודל ההודעה.",
    },
    prompt: {
      title: "בקשה",
      description:
        "הבקשה שתיעשה שימוש בה בסביבת העבודה הזו. הגדר את ההקשר וההוראות עבור ה-AI כדי ליצור תגובה. עליך לספק בקשה מעוצבת בקפידה כדי שה-AI יוכל ליצור תגובה רלוונטית ומדויקת.",
    },
    refusal: {
      title: "תגובת סירוב במצב שאילתה",
      "desc-start": "כשאתה במצב",
      query: "שאילתה",
      "desc-end":
        "אתה עשוי לרצות להחזיר תגובת סירוב מותאמת אישית כאשר לא נמצא הקשר.",
    },
    temperature: {
      title: "טמפרטורה של LLM",
      "desc-start":
        'הגדרה זו שולטת באיזה מידה תגובות ה-LLM שלך יהיו "יצירתיות".',
      "desc-end":
        "ככל שהמספר גבוה יותר כך ה-LLM יצירתי יותר. עבור חלק מהדגמים זה יכול להוביל לתגובות לא קוהרנטיות כאשר הוא מוגדר גבוה מדי.",
      hint: "לרוב ה-LLM יש טווחים שונים של ערכים תקפים. התייעץ עם ספק ה-LLM שלך לקבלת מידע.",
    },
  },
  "vector-workspace": {
    identifier: "מזהה בסיס נתונים וקטור",
    snippets: {
      title: "קטעי קשר מרביים",
      description:
        "הגדרה זו שולטת בכמות המרבית של קטעי קשר שיישלחו ל-LLM עבור כל צ'אט או שאילתה.",
      recommend: "מומלץ: 4",
    },
    doc: {
      title: "סף דמיון מסמכים",
      description:
        "ציון הדמיון המינימלי הנדרש כדי שמקור ייחשב כקשור לצ'אט. ככל שהמספר גבוה יותר, כך המקור חייב להיות דומה יותר לצ'אט.",
      zero: "ללא הגבלה",
      low: "נמוך (ציון דמיון ≥ .25)",
      medium: "בינוני (ציון דמיון ≥ .50)",
      high: "גבוה (ציון דמיון ≥ .75)",
    },
    reset: {
      reset: "אפס בסיס נתונים וקטור",
      resetting: "מנקה וקטורים...",
      confirm:
        "אתה עומד לאפס את בסיס הנתונים הווקטורי של סביבת העבודה הזו. זה ימחק את כל הטבעות הווקטוריות שקיימות כעת.\n\nקבצי המקור המקוריים יישארו ללא שינוי. פעולה זו היא בלתי הפיכה.",
      error: "לא ניתן היה לאפס את בסיס הנתונים הווקטורי של סביבת העבודה!",
      success: "בסיס הנתונים הווקטורי של סביבת העבודה איפס!",
    },
  },
  agent: {
    "performance-warning":
      "ביצועי LLM שאינם תומכים באופן מפורש בקריאות כלים תלויים מאוד ביכולות ובדיוק של הדגם. חלק מהיכולות עשויות להיות מוגבלות או לא פונקציונליות.",
    provider: {
      title: "ספק LLM של סוכן סביבת עבודה",
      description:
        "ספק LLM ספציפי ודגם שייעשה בו שימוש עבור סוכן @agent של סביבת העבודה הזו.",
    },
    mode: {
      chat: {
        title: "דגם צ'אט של סוכן סביבת עבודה",
        description:
          "דגם הצ'אט הספציפי שייעשה בו שימוש עבור סוכן @agent של סביבת העבודה הזו.",
      },
      title: "דגם של סוכן סביבת עבודה",
      description:
        "דגם LLM ספציפי שייעשה בו שימוש עבור סוכן @agent של סביבת העבודה הזו.",
      wait: "-- מחכה לדגמים --",
    },
    skill: {
      title: "כישורי סוכן ברירת מחדל",
      description:
        "שפר את היכולות הטבעיות של הסוכן ברירת המחדל עם כישורים מובנים אלה. הגדרה זו חלה על כל סביבות העבודה.",
      rag: {
        title: "RAG וזכרון ארוך טווח",
        description:
          'אפשר לסוכן לנצל את המסמכים המקומיים שלך כדי לענות על שאילתה או לבקש מהסוכן "לזכור" חלקים מתוכן עבור אחזור זכרון ארוך טווח.',
      },
      view: {
        title: "הצג ותמצת מסמכים",
        description:
          "אפשר לסוכן לרשום ולמצת את תוכן קבצי סביבת העבודה שהוטמעו כעת.",
      },
      scrape: {
        title: "גרד אתרי אינטרנט",
        description: "אפשר לסוכן לבקר ולגרד את תוכן אתרי האינטרנט.",
      },
      generate: {
        title: "צור תרשימים",
        description:
          "אפשר לסוכן ברירת המחדל ליצור סוגים שונים של תרשימים מנתונים שסופקו או ניתנו בצ'אט.",
      },
      save: {
        title: "צור ושמור קבצים בדפדפן",
        description:
          "אפשר לסוכן ברירת המחדל ליצור ולכתוב לקבצים שניתן לשמור ולהוריד בדפדפן שלך.",
      },
      web: {
        title: "חיפוש אינטרנט חי וניווט",
        "desc-start":
          "אפשר לסוכן שלך לחפש באינטרנט כדי לענות על השאלות שלך על ידי חיבור לספק חיפוש באינטרנט (SERP).",
        "desc-end": "חיפוש באינטרנט במהלך מפגשי סוכן לא יעבוד עד שתגדיר זאת.",
      },
    },
  },
  recorded: {
    title: "שיחות סביבת עבודה",
    description:
      "אלה כל השיחות וההודעות שנרשמו שנשלחו על ידי משתמשים לפי תאריך יצירתן.",
    export: "ייצוא",
    table: {
      id: "Id",
      by: "נשלח על ידי",
      workspace: "סביבת עבודה",
      prompt: "בקשה",
      response: "תגובה",
      at: "נשלח ב-",
    },
  },
  appearance: {
    title: "מראה",
    description: "התאם אישית את הגדרות המראה של הפלטפורמה שלך.",
    logo: {
      title: "התאם אישית את הלוגו",
      description:
        "העלה את הלוגו המותאם אישית שלך כדי להפוך את הצ'אטבוט שלך לשלך.",
      add: "הוסף לוגו מותאם אישית",
      recommended: "גודל מומלץ: 800 x 200",
      remove: "הסר",
      replace: "החלף",
    },
    message: {
      title: "התאם אישית הודעות",
      description: "התאם אישית את ההודעות האוטומטיות המוצגות למשתמשים שלך.",
      new: "חדש",
      system: "מערכת",
      user: "משתמש",
      message: "הודעה",
      assistant: "ModelRun Chat Assistant",
      "double-click": "לחץ פעמיים כדי לערוך...",
      save: "שמור הודעות",
    },
    icons: {
      title: "סמלי כותרת תחתונה מותאמים אישית",
      description: "התאם אישית את סמלי כותרת התחתונה המוצגים בתחתית סרגל הצד.",
      icon: "סמל",
      link: "קישור",
    },
  },
  api: {
    title: "מפתחות API",
    description:
      "מפתחות API מאפשרים לבעלים לגשת ולתפעל מופע ModelRun זה באופן תכנותי.",
    link: "קרא את תיעוד ה-API",
    generate: "צור מפתח API חדש",
    table: {
      key: "מפתח API",
      by: "נוצר על ידי",
      created: "נוצר",
    },
  },
  llm: {
    title: "העדפת LLM",
    description:
      "אלה אישורי ההרשאה וההגדרות עבור ספק צ'אט והטבעה LLM המועדף עליך. חשוב שאישורי ההרשאה יהיו עדכניים ונכונים אחרת ModelRun לא תוכל לפעול כראוי.",
    provider: "ספק LLM",
  },
  transcription: {
    title: "העדפת דגם תמלול",
    description:
      "אלה אישורי ההרשאה וההגדרות עבור ספק דגם התמלול המועדף עליך. חשוב שאישורי ההרשאה יהיו עדכניים ונכונים אחרת קבצי מדיה ואודיו לא יעברו תמלול.",
    provider: "ספק התמלול",
    "warn-start":
      "שימוש בדגם Whisper מקומי במחשבים עם זיכרון RAM או מעבד מוגבלים יכול לעצור את ModelRun בעת עיבוד קבצי מדיה.",
    "warn-recommend":
      "אנו ממליצים על לפחות 2GB של זיכרון RAM והעלאת קבצים <10Mb.",
    "warn-end": "הדגם המובנה יתורגם אוטומטית בפעם הראשונה שבה תשתמש בו.",
  },
  embedding: {
    title: "העדפת הטבעה",
    "desc-start":
      "בעת שימוש ב-LLM שאינו תומך באופן מקורי במנוע הטבעה - ייתכן שתצטרך לציין אישורי הרשאה נוספים להטבעת טקסט.",
    "desc-end":
      "הטבעה היא תהליך הפיכת טקסט לווקטורים. אישורי הרשאה אלה נדרשים כדי להפוך את הקבצים והבקשות שלך לפורמט ש-ModelRun יכול להשתמש בו לעיבוד.",
    provider: {
      title: "ספק הטבעה",
      description: "אין צורך בהגדרה בעת שימוש במנוע ההטבעה המקורי של ModelRun.",
    },
  },
  text: {
    title: "הגדרות חלוקת טקסט וחלוקה",
    "desc-start":
      "לפעמים, ייתכן שתרצה לשנות את הדרך ברירת המחדל שבה מסמכים חדשים מחולקים ומופרדים לפני שהם מוכנסים לבסיס הנתונים הווקטורי שלך.",
    "desc-end":
      "עליך לשנות הגדרה זו רק אם אתה מבין כיצד חלוקת טקסט פועלת והשפעותיה.",
    "warn-start": "שינויים כאן יחולו רק על",
    "warn-center": "מסמכים שהוטמעו לאחרונה",
    "warn-end": ", לא על מסמכים קיימים.",
    size: {
      title: "גודל קטע טקסט",
      description: "זהו אורך הדמויות המרבי שיכול להיות נוכח בקטור יחיד.",
      recommend: "אורך מרבי של דגם ההטבעה הוא",
    },
    overlap: {
      title: "חפיפה של קטע טקסט",
      description:
        "זו החפיפה המרבית של הדמויות המתרחשת במהלך החלוקה בין שני קטעי טקסט סמוכים.",
    },
  },
  vector: {
    title: "בסיס נתונים וקטור",
    description:
      "אלה אישורי ההרשאה וההגדרות עבור אופן פעולתו של מופע ModelRun שלך. חשוב שאישורי ההרשאה יהיו עדכניים ונכונים.",
    provider: {
      title: "ספק בסיס נתונים וקטור",
      description: "אין צורך בקונפיגורציה עבור LanceDB.",
    },
  },
  embeddable: {
    title: "כלי צ'אט ניתנים להטמעה",
    description:
      "כלי צ'אט ניתנים להטמעה הם ממשקי צ'אט פומביים הקשורים לסביבת עבודה אחת. אלה מאפשרים לך לבנות סביבות עבודה שתוכל לפרסם לעולם.",
    create: "צור הטמעה",
    table: {
      workspace: "סביבת עבודה",
      chats: "שיחות שנשלחו",
      Active: "תחומים פעילים",
    },
  },
  "embed-chats": {
    title: "הטמעת שיחות",
    export: "ייצוא",
    description: "אלה כל השיחות וההודעות שנרשמו מכל הטמעה שפרסמת.",
    table: {
      embed: "הטמעה",
      sender: "שולח",
      message: "הודעה",
      response: "תגובה",
      at: "נשלח ב-",
    },
  },
  multi: {
    title: "מצב משתמשים מרובים",
    description:
      "הגדר את המופע שלך כדי לתמוך בצוות שלך על ידי הפעלת מצב משתמשים מרובים.",
    enable: {
      "is-enable": "מצב משתמשים מרובים מופעל",
      enable: "הפעלת מצב משתמשים מרובים",
      description:
        "כברירת מחדל, אתה תהיה המנהל היחיד. כמנהל תצטרך ליצור חשבונות לכל משתמש או מנהל חדש. אל תאבד את הסיסמה שלך מכיוון שרק משתמש מנהל יכול לאפס סיסמאות.",
      username: "שם משתמש של חשבון מנהל",
      password: "סיסמת חשבון מנהל",
    },
    password: {
      title: "הגנה באמצעות סיסמה",
      description:
        "הגן על מופע ModelRun שלך באמצעות סיסמה. אם תשכח את הסיסמה הזו אין שום דרך להחזיר אותה אז וודא שאתה שומר את הסיסמה הזו.",
    },
    instance: {
      title: "הגן על המופע באמצעות סיסמה",
      description:
        "כברירת מחדל, אתה תהיה המנהל היחיד. כמנהל תצטרך ליצור חשבונות לכל משתמש או מנהל חדש. אל תאבד את הסיסמה שלך מכיוון שרק משתמש מנהל יכול לאפס סיסמאות.",
      password: "סיסמת מופע",
    },
  },
  event: {
    title: "יומני אירועים",
    description: "הצג את כל הפעולות והאירועים שקורים במופע זה לצורך ניטור.",
    clear: "נקה יומני אירועים",
    table: {
      type: "סוג אירוע",
      user: "משתמש",
      occurred: "התרחש ב-",
    },
  },
  privacy: {
    title: "פרטיות וטיפול בנתונים",
    description:
      "זו הקונפיגורציה שלך עבור אופן הטיפול בנתונים שלך על ידי ספקי צד שלישי מחוברים ו-ModelRun.",
    llm: "בחירת LLM",
    embedding: "העדפת הטבעה",
    vector: "בסיס נתונים וקטור",
    anonymous: "טלמטריה אנונימית מופעלת",
  },
  connectors: {
    "search-placeholder": null,
    "no-connectors": null,
    github: {
      name: null,
      description: null,
      URL: null,
      URL_explained: null,
      token: null,
      optional: null,
      token_explained: null,
      token_explained_start: null,
      token_explained_link1: null,
      token_explained_middle: null,
      token_explained_link2: null,
      token_explained_end: null,
      ignores: null,
      git_ignore: null,
      task_explained: null,
      branch: null,
      branch_loading: null,
      branch_explained: null,
      token_information: null,
      token_personal: null,
    },
    gitlab: {
      name: null,
      description: null,
      URL: null,
      URL_explained: null,
      token: null,
      optional: null,
      token_explained: null,
      token_description: null,
      token_explained_start: null,
      token_explained_link1: null,
      token_explained_middle: null,
      token_explained_link2: null,
      token_explained_end: null,
      fetch_issues: null,
      ignores: null,
      git_ignore: null,
      task_explained: null,
      branch: null,
      branch_loading: null,
      branch_explained: null,
      token_information: null,
      token_personal: null,
    },
    youtube: {
      name: null,
      description: null,
      URL: null,
      URL_explained_start: null,
      URL_explained_link: null,
      URL_explained_end: null,
      task_explained: null,
      language: null,
      language_explained: null,
      loading_languages: null,
    },
    "website-depth": {
      name: null,
      description: null,
      URL: null,
      URL_explained: null,
      depth: null,
      depth_explained: null,
      max_pages: null,
      max_pages_explained: null,
      task_explained: null,
    },
    confluence: {
      name: null,
      description: null,
      deployment_type: null,
      deployment_type_explained: null,
      base_url: null,
      base_url_explained: null,
      space_key: null,
      space_key_explained: null,
      username: null,
      username_explained: null,
      auth_type: null,
      auth_type_explained: null,
      auth_type_username: null,
      auth_type_personal: null,
      token: null,
      token_explained_start: null,
      token_explained_link: null,
      token_desc: null,
      pat_token: null,
      pat_token_explained: null,
      task_explained: null,
    },
    manage: {
      documents: null,
      "data-connectors": null,
      "desktop-only": null,
      dismiss: null,
      editing: null,
    },
    directory: {
      "my-documents": null,
      "new-folder": null,
      "search-document": null,
      "no-documents": null,
      "move-workspace": null,
      name: null,
      "delete-confirmation": null,
      "removing-message": null,
      "move-success": null,
      date: null,
      type: null,
      no_docs: null,
      select_all: null,
      deselect_all: null,
      remove_selected: null,
      costs: null,
      save_embed: null,
    },
    upload: {
      "processor-offline": null,
      "processor-offline-desc": null,
      "click-upload": null,
      "file-types": null,
      "or-submit-link": null,
      "placeholder-link": null,
      fetching: null,
      "fetch-website": null,
      "privacy-notice": null,
    },
    pinning: {
      what_pinning: null,
      pin_explained_block1: null,
      pin_explained_block2: null,
      pin_explained_block3: null,
      accept: null,
    },
    watching: {
      what_watching: null,
      watch_explained_block1: null,
      watch_explained_block2: null,
      watch_explained_block3_start: null,
      watch_explained_block3_link: null,
      watch_explained_block3_end: null,
      accept: null,
    },
  },
  chat_window: {
    welcome: null,
    get_started: null,
    get_started_default: null,
    upload: null,
    or: null,
    send_chat: null,
    send_message: null,
    attach_file: null,
    slash: null,
    agents: null,
    text_size: null,
    microphone: null,
    send: null,
  },
  profile_settings: {
    edit_account: null,
    profile_picture: null,
    remove_profile_picture: null,
    username: null,
    username_description: null,
    new_password: null,
    passwort_description: null,
    cancel: null,
    update_account: null,
    theme: null,
    language: null,
  },
};

export default TRANSLATIONS;
