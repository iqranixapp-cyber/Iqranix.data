"use strict";

/* =========================================================
   IQRANIX ISLAMIC KNOWLEDGE CHALLENGE
   =========================================================

   THREE STAGES

   01 — FOUNDATION
   Difficult Islamic knowledge

   02 — ADVANCED
   Very difficult Islamic knowledge

   03 — EXPERT
   Complex Islamic knowledge

   REQUIREMENT TO ADVANCE:
   90%

   IMPORTANT:
   A user cannot skip an unlocked stage.

========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {

    requiredScore: 90,

    questionsPerStage: 20,

    storageKey: "iqranixQuizProgressV2",

    historyKey: "iqranixQuizHistoryV2"

};


/* =========================================================
   STAGE INFORMATION
========================================================= */

const STAGES = {

    foundation: {

        name: "Foundation",

        number: 1,

        difficulty: "Difficult",

        description:
            "A serious foundation in Islamic knowledge.",

        next: "advanced"

    },

    advanced: {

        name: "Advanced",

        number: 2,

        difficulty: "Very Hard",

        description:
            "Deeper knowledge requiring strong recall.",

        next: "expert"

    },

    expert: {

        name: "Expert",

        number: 3,

        difficulty: "Expert",

        description:
            "Complex questions where details matter.",

        next: null

    }

};


/* =========================================================
   QUESTION BANK
========================================================= */

const QUESTION_BANK = {


    /* =====================================================
       FOUNDATION
       DIFFICULT
    ===================================================== */

    foundation: [

        {
            q: "Which companion was specifically appointed by Abu Bakr رضي الله عنه to lead the compilation of the Qur'an into a single collection after the deaths of many reciters?",
            a: [
                "Zayd ibn Thabit",
                "Abdullah ibn Mas'ud",
                "Ubayy ibn Ka'b",
                "Mu'adh ibn Jabal"
            ],
            correct: 0,
            explanation:
                "Zayd ibn Thabit رضي الله عنه was appointed by Abu Bakr رضي الله عنه to undertake the compilation."
        },

        {
            q: "Which battle took place in 2 AH and was the first major military victory of the Muslims against Quraysh?",
            a: [
                "Uhud",
                "Badr",
                "Khandaq",
                "Hunayn"
            ],
            correct: 1,
            explanation:
                "The Battle of Badr took place in 2 AH and was a decisive early victory for the Muslims."
        },

        {
            q: "Which companion was known by the title Dhun-Nurayn?",
            a: [
                "Ali ibn Abi Talib",
                "Umar ibn al-Khattab",
                "Uthman ibn Affan",
                "Abdur-Rahman ibn Awf"
            ],
            correct: 2,
            explanation:
                "Uthman ibn Affan رضي الله عنه was known as Dhun-Nurayn."
        },

        {
            q: "Which surah contains the longest verse in the Qur'an, commonly known as Ayat ad-Dayn?",
            a: [
                "Al-Baqarah",
                "An-Nisa",
                "Al-Ma'idah",
                "Al-Imran"
            ],
            correct: 0,
            explanation:
                "Ayat ad-Dayn is Qur'an 2:282 in Surah Al-Baqarah."
        },

        {
            q: "Which companion was famous for his knowledge of the Qur'an and was among the early Muslims in Makkah?",
            a: [
                "Abdullah ibn Mas'ud",
                "Abu Hurayrah",
                "Khalid ibn al-Walid",
                "Sa'd ibn Mu'adh"
            ],
            correct: 0,
            explanation:
                "Abdullah ibn Mas'ud رضي الله عنه was renowned for his knowledge and recitation of the Qur'an."
        },

        {
            q: "Which event occurred first in the Prophet's ﷺ mission?",
            a: [
                "The Treaty of Hudaybiyyah",
                "The conquest of Makkah",
                "The first revelation",
                "The Farewell Hajj"
            ],
            correct: 2,
            explanation:
                "The first revelation preceded all of the listed later events."
        },

        {
            q: "Which companion was sent to Madinah before the Hijrah to teach Islam and prepare the community?",
            a: [
                "Mus'ab ibn Umayr",
                "Bilal ibn Rabah",
                "Salman al-Farisi",
                "Abu Dharr al-Ghifari"
            ],
            correct: 0,
            explanation:
                "Mus'ab ibn Umayr رضي الله عنه was sent to Yathrib to teach Islam before the Hijrah."
        },

        {
            q: "Which battle is also known as Al-Ahzab?",
            a: [
                "Badr",
                "Uhud",
                "The Battle of the Trench",
                "Mu'tah"
            ],
            correct: 2,
            explanation:
                "The Battle of the Trench is also known as the Battle of Al-Ahzab."
        },

        {
            q: "Which companion is especially associated with the narration of a very large number of hadith?",
            a: [
                "Abu Hurayrah",
                "Abu Talhah",
                "Sa'd ibn Abi Waqqas",
                "Al-Zubayr ibn al-Awwam"
            ],
            correct: 0,
            explanation:
                "Abu Hurayrah رضي الله عنه is widely recognized as one of the companions who narrated the largest number of hadith."
        },

        {
            q: "Which prayer begins after the sun has passed its zenith?",
            a: [
                "Fajr",
                "Dhuhr",
                "Asr",
                "Maghrib"
            ],
            correct: 1,
            explanation:
                "Dhuhr begins after the sun passes its zenith."
        },

        {
            q: "Which companion was known as Al-Faruq?",
            a: [
                "Abu Bakr",
                "Umar ibn al-Khattab",
                "Uthman ibn Affan",
                "Ali ibn Abi Talib"
            ],
            correct: 1,
            explanation:
                "Umar ibn al-Khattab رضي الله عنه is famously known by the title Al-Faruq."
        },

        {
            q: "Which mosque was established by the Prophet ﷺ during his arrival in the area of Madinah before entering the city?",
            a: [
                "Masjid Quba",
                "Masjid an-Nabawi",
                "Masjid al-Qiblatayn",
                "Masjid al-Haram"
            ],
            correct: 0,
            explanation:
                "Masjid Quba was established during the Prophet's ﷺ arrival in the area of Madinah."
        },

        {
            q: "Which event marked the change of the qiblah?",
            a: [
                "The direction changed from Jerusalem toward the Ka'bah",
                "The direction changed from Makkah toward Jerusalem",
                "The direction changed from Madinah toward Ta'if",
                "The direction changed from Ta'if toward Makkah"
            ],
            correct: 0,
            explanation:
                "The qiblah was changed from the direction of Jerusalem toward the Ka'bah in Makkah."
        },

        {
            q: "Which angel is associated with delivering revelation to the prophets?",
            a: [
                "Mikail",
                "Israfil",
                "Jibril",
                "Malik"
            ],
            correct: 2,
            explanation:
                "Jibril عليه السلام is the angel associated with delivering revelation."
        },

        {
            q: "Which companion was known as the Sword of Allah?",
            a: [
                "Khalid ibn al-Walid",
                "Abu Ubaydah ibn al-Jarrah",
                "Amr ibn al-As",
                "Sa'd ibn Abi Waqqas"
            ],
            correct: 0,
            explanation:
                "Khalid ibn al-Walid رضي الله عنه was famously known as Saifullah."
        },

        {
            q: "Which treaty was concluded between the Muslims and Quraysh in 6 AH?",
            a: [
                "Treaty of Hudaybiyyah",
                "Treaty of Tabuk",
                "Treaty of Badr",
                "Treaty of Aqabah"
            ],
            correct: 0,
            explanation:
                "The Treaty of Hudaybiyyah was concluded in 6 AH."
        },

        {
            q: "Which caliph oversaw the standardization and distribution of Qur'anic copies to major regions?",
            a: [
                "Abu Bakr",
                "Umar",
                "Uthman",
                "Ali"
            ],
            correct: 2,
            explanation:
                "Uthman ibn Affan رضي الله عنه oversaw the standardization and distribution of the copies."
        },

        {
            q: "Which companion was particularly renowned for knowledge of inheritance law?",
            a: [
                "Zayd ibn Thabit",
                "Bilal ibn Rabah",
                "Abu Hurayrah",
                "Khalid ibn al-Walid"
            ],
            correct: 0,
            explanation:
                "Zayd ibn Thabit رضي الله عنه was particularly renowned for his knowledge of inheritance."
        },

        {
            q: "What was the migration of the Prophet ﷺ from Makkah to Madinah called?",
            a: [
                "Hijrah",
                "Isra",
                "Mi'raj",
                "Bay'ah"
            ],
            correct: 0,
            explanation:
                "The migration from Makkah to Madinah is known as the Hijrah."
        },

        {
            q: "Which companion was the first mu'adhdhin of the Muslim community?",
            a: [
                "Bilal ibn Rabah",
                "Ammar ibn Yasir",
                "Salman al-Farisi",
                "Abdullah ibn Mas'ud"
            ],
            correct: 0,
            explanation:
                "Bilal ibn Rabah رضي الله عنه is renowned as the first mu'adhdhin of the Muslim community."
        },
      /* =========================================================
   FOUNDATION — BATCH 2
   Harder foundation-level questions
========================================================= */

{
    question:
        "Which of the following best describes the meaning of Tawhid al-Uluhiyyah?",
    options: [
        "Affirming Allah's names and attributes",
        "Singling out Allah alone for worship",
        "Believing that Allah created the universe",
        "Believing in the existence of angels"
    ],
    answer: 1,
    explanation:
        "Tawhid al-Uluhiyyah refers to singling out Allah alone for all acts of worship."
},

{
    question:
        "Which surah is known as Umm al-Kitab and is recited in every rak'ah of the obligatory prayer?",
    options: [
        "Al-Baqarah",
        "Al-Fatihah",
        "Al-Ikhlas",
        "Al-Kahf"
    ],
    answer: 1,
    explanation:
        "Surah Al-Fatihah is known as Umm al-Kitab and is recited in every rak'ah of salah."
},

{
    question:
        "Which of the following is one of the conditions commonly mentioned for the validity of salah?",
    options: [
        "Facing the qiblah",
        "Speaking Arabic outside the prayer",
        "Giving charity before every prayer",
        "Fasting before every prayer"
    ],
    answer: 0,
    explanation:
        "Facing the qiblah is among the established conditions associated with the validity of salah."
},

{
    question:
        "What is the relationship between Zakat and Sadaqah?",
    options: [
        "They are always exactly the same obligation",
        "Zakat is obligatory under its conditions, while sadaqah can refer to voluntary charity",
        "Sadaqah is obligatory while Zakat is always voluntary",
        "Neither involves giving wealth to others"
    ],
    answer: 1,
    explanation:
        "Zakat is an obligatory act of worship for those who meet its conditions, while sadaqah commonly refers to voluntary charity."
},

{
    question:
        "Which event marks the beginning of the Islamic calendar's year numbering?",
    options: [
        "The birth of Prophet Muhammad ﷺ",
        "The first revelation",
        "The Hijrah from Makkah to Madinah",
        "The conquest of Makkah"
    ],
    answer: 2,
    explanation:
        "The Hijrah from Makkah to Madinah was adopted as the reference point for the Islamic Hijri calendar."
},

{
    question:
        "Which prayer has four obligatory rak'ahs during its normal resident form?",
    options: [
        "Fajr",
        "Maghrib",
        "Dhuhr",
        "Witr"
    ],
    answer: 2,
    explanation:
        "Dhuhr normally consists of four obligatory rak'ahs for a resident."
},

{
    question:
        "What is meant by the term 'Sunnah' in the broad Islamic sense?",
    options: [
        "Only the Qur'anic revelations",
        "The established way, teachings, practices and guidance of the Prophet ﷺ",
        "Only voluntary prayers",
        "Only the rulings of later scholars"
    ],
    answer: 1,
    explanation:
        "Sunnah broadly refers to the established teachings, practices, guidance and way of the Prophet ﷺ."
},

{
    question:
        "Which of these is NOT one of the Five Pillars of Islam?",
    options: [
        "Salah",
        "Zakat",
        "Hajj",
        "Belief in the angels"
    ],
    answer: 3,
    explanation:
        "Belief in the angels is part of Islamic creed and the articles of faith, but it is not one of the Five Pillars of Islam."
},

{
    question:
        "Which night is described in the Qur'an as being better than a thousand months?",
    options: [
        "Laylat al-Qadr",
        "Laylat al-Isra",
        "The night of Eid al-Fitr",
        "The night of Arafah"
    ],
    answer: 0,
    explanation:
        "Laylat al-Qadr is described in Surah Al-Qadr as better than a thousand months."
},

{
    question:
        "Which prophet was commanded to build the Ark before the great flood?",
    options: [
        "Ibrahim عليه السلام",
        "Nuh عليه السلام",
        "Musa عليه السلام",
        "Yunus عليه السلام"
    ],
    answer: 1,
    explanation:
        "Allah commanded Prophet Nuh عليه السلام to construct the Ark before the flood."
},

{
    question:
        "Which prophet is described in the Qur'an as being swallowed by the great fish?",
    options: [
        "Yusuf عليه السلام",
        "Yunus عليه السلام",
        "Ayyub عليه السلام",
        "Hud عليه السلام"
    ],
    answer: 1,
    explanation:
        "Prophet Yunus عليه السلام is associated with the event of being swallowed by the great fish."
},

{
    question:
        "Which prophet was sent to Pharaoh and famously confronted him with signs from Allah?",
    options: [
        "Musa عليه السلام",
        "Sulayman عليه السلام",
        "Dawud عليه السلام",
        "Zakariyya عليه السلام"
    ],
    answer: 0,
    explanation:
        "Prophet Musa عليه السلام was sent to Pharaoh and confronted him with Allah's signs."
},

{
    question:
        "Which companion was the first adult male to accept Islam according to the commonly transmitted early Islamic accounts?",
    options: [
        "Umar ibn al-Khattab رضي الله عنه",
        "Abu Bakr رضي الله عنه",
        "Uthman ibn Affan رضي الله عنه",
        "Sa'd ibn Abi Waqqas رضي الله عنه"
    ],
    answer: 1,
    explanation:
        "Abu Bakr رضي الله عنه is commonly identified as the first adult free man to accept Islam."
},

{
    question:
        "Which companion was the cousin and son-in-law of Prophet Muhammad ﷺ?",
    options: [
        "Abu Bakr رضي الله عنه",
        "Ali ibn Abi Talib رضي الله عنه",
        "Umar ibn al-Khattab رضي الله عنه",
        "Talhah ibn Ubaydillah رضي الله عنه"
    ],
    answer: 1,
    explanation:
        "Ali ibn Abi Talib رضي الله عنه was the cousin of the Prophet ﷺ and married his daughter Fatimah رضي الله عنها."
},

{
    question:
        "Which wife of the Prophet ﷺ was the daughter of Abu Bakr رضي الله عنه?",
    options: [
        "Hafsa رضي الله عنها",
        "Aisha رضي الله عنها",
        "Zaynab رضي الله عنها",
        "Umm Salamah رضي الله عنها"
    ],
    answer: 1,
    explanation:
        "Aisha رضي الله عنها was the daughter of Abu Bakr رضي الله عنه and one of the wives of the Prophet ﷺ."
},

{
    question:
        "What is the significance of Masjid al-Haram in Islamic worship?",
    options: [
        "It contains the Ka'bah and is the central destination of Hajj and Umrah",
        "It was the first mosque built in Madinah",
        "It is where the Prophet ﷺ was buried",
        "It is located in Jerusalem"
    ],
    answer: 0,
    explanation:
        "Masjid al-Haram surrounds the Ka'bah in Makkah and is central to Hajj and Umrah."
},

{
    question:
        "Which mosque is associated with the Prophet's ﷺ migration journey and is traditionally regarded as the first mosque built upon piety?",
    options: [
        "Masjid Quba",
        "Masjid al-Aqsa",
        "Masjid an-Nabawi",
        "Masjid al-Qiblatayn"
    ],
    answer: 0,
    explanation:
        "Masjid Quba is associated with the Prophet's ﷺ arrival near Madinah and is described in Islamic tradition in connection with piety."
},

{
    question:
        "What is the difference between Makki and Madani revelation in the commonly used classification?",
    options: [
        "Makki refers only to verses revealed inside the Ka'bah",
        "Madani refers only to verses revealed during the Farewell Hajj",
        "Makki generally refers to revelation before the Hijrah, while Madani refers to revelation after it",
        "Makki means Arabic revelation and Madani means non-Arabic revelation"
    ],
    answer: 2,
    explanation:
        "The commonly used classification distinguishes Makki revelation as before the Hijrah and Madani revelation as after the Hijrah."
},

{
    question:
        "Which of the following best describes Iman in the classical formulation of Islamic belief?",
    options: [
        "Only knowing that Allah exists",
        "Belief in the heart, speech and actions according to the scholarly formulation",
        "Only performing the Five Pillars",
        "Only avoiding major sins"
    ],
    answer: 1,
    explanation:
        "In the classical Sunni formulation, iman encompasses belief, speech and actions, with details discussed by scholars."
},

{
    question:
        "Which of the following is one of the six articles of faith?",
    options: [
        "Belief in the Qur'an only",
        "Belief in divine decree",
        "Belief that every person becomes a scholar",
        "Belief that all sins are automatically forgiven"
    ],
    answer: 1,
    explanation:
        "Belief in divine decree, al-Qadar, is one of the six articles of faith."
}, 
 /* =====================================================
   FOUNDATION — BATCH 3
===================================================== */

{
    question:
        "Which surah is known as Umm al-Kitab?",
    options: [
        "Al-Baqarah",
        "Al-Fatihah",
        "Al-Ikhlas",
        "Yasin"
    ],
    answer: 1,
    explanation:
        "Al-Fatihah is known as Umm al-Kitab, meaning the Mother of the Book."
},

{
    question:
        "Which of the following is one of the Five Pillars of Islam?",
    options: [
        "Belief in the angels",
        "Belief in divine decree",
        "Zakat",
        "Belief in the revealed books"
    ],
    answer: 2,
    explanation:
        "Zakat is one of the five Pillars of Islam. Belief in angels, revealed books and divine decree are among the articles of faith."
},

{
    question:
        "Which prayer has four obligatory units (rak'ahs) in its normal obligatory form?",
    options: [
        "Fajr",
        "Maghrib",
        "Dhuhr",
        "Witr"
    ],
    answer: 2,
    explanation:
        "The obligatory Dhuhr prayer consists of four rak'ahs."
},

{
    question:
        "Which prayer has three obligatory rak'ahs?",
    options: [
        "Fajr",
        "Maghrib",
        "Asr",
        "Isha"
    ],
    answer: 1,
    explanation:
        "The obligatory Maghrib prayer consists of three rak'ahs."
},

{
    question:
        "Which prayer has two obligatory rak'ahs?",
    options: [
        "Fajr",
        "Dhuhr",
        "Asr",
        "Isha"
    ],
    answer: 0,
    explanation:
        "The obligatory Fajr prayer consists of two rak'ahs."
},

{
    question:
        "What is the name of the night in Ramadan described in the Qur'an as better than a thousand months?",
    options: [
        "Laylat al-Qadr",
        "Laylat al-Mi'raj",
        "Laylat al-Bara'ah",
        "Laylat al-Hijrah"
    ],
    answer: 0,
    explanation:
        "Laylat al-Qadr is described in Surah Al-Qadr as better than a thousand months."
},

{
    question:
        "Which surah is named after the cow?",
    options: [
        "Al-An'am",
        "Al-Baqarah",
        "An-Nahl",
        "Al-Fil"
    ],
    answer: 1,
    explanation:
        "Al-Baqarah means 'The Cow' and is the second surah of the Qur'an."
},

{
    question:
        "Which surah is named after the elephant?",
    options: [
        "Al-Fil",
        "Al-Qari'ah",
        "Al-Ankabut",
        "Al-Hadid"
    ],
    answer: 0,
    explanation:
        "Al-Fil means 'The Elephant' and refers to the account associated with the People of the Elephant."
},

{
    question:
        "Which prophet is described in the Qur'an as Khalilullah, meaning the close friend of Allah?",
    options: [
        "Musa",
        "Nuh",
        "Ibrahim",
        "Yusuf"
    ],
    answer: 2,
    explanation:
        "Ibrahim عليه السلام is traditionally known as Khalilullah, the close friend of Allah."
},

{
    question:
        "Which prophet was swallowed by a great fish?",
    options: [
        "Yunus",
        "Ayyub",
        "Zakariyya",
        "Shu'ayb"
    ],
    answer: 0,
    explanation:
        "Yunus عليه السلام was swallowed by the great fish and called upon Allah in repentance."
},

{
    question:
        "Which prophet is especially associated with interpreting dreams?",
    options: [
        "Yusuf",
        "Hud",
        "Salih",
        "Lut"
    ],
    answer: 0,
    explanation:
        "Yusuf عليه السلام was given knowledge of interpreting dreams, a major theme in his story."
},

{
    question:
        "Which prophet built the Ark by Allah's command?",
    options: [
        "Ibrahim",
        "Nuh",
        "Musa",
        "Dawud"
    ],
    answer: 1,
    explanation:
        "Nuh عليه السلام built the Ark by Allah's command before the great flood."
},

{
    question:
        "Which prophet received the Tawrah according to Islamic belief?",
    options: [
        "Isa",
        "Musa",
        "Dawud",
        "Ibrahim"
    ],
    answer: 1,
    explanation:
        "Musa عليه السلام was given the Tawrah."
},

{
    question:
        "Which prophet received the Injil according to Islamic belief?",
    options: [
        "Musa",
        "Sulayman",
        "Isa",
        "Yahya"
    ],
    answer: 2,
    explanation:
        "Isa عليه السلام was given the Injil."
},

{
    question:
        "Which prophet was given the Zabur according to Islamic belief?",
    options: [
        "Dawud",
        "Yusuf",
        "Nuh",
        "Ilyas"
    ],
    answer: 0,
    explanation:
        "Dawud عليه السلام was given the Zabur."
},

{
    question:
        "Which angel is associated with blowing the Trumpet?",
    options: [
        "Jibril",
        "Mikail",
        "Israfil",
        "Malik"
    ],
    answer: 2,
    explanation:
        "Israfil عليه السلام is traditionally associated with blowing the Trumpet."
},

{
    question:
        "Which angel is traditionally associated with delivering revelation to the prophets?",
    options: [
        "Jibril",
        "Mikail",
        "Israfil",
        "Ridwan"
    ],
    answer: 0,
    explanation:
        "Jibril عليه السلام is the angel associated with delivering revelation."
},

{
    question:
        "Which angel is traditionally associated with taking charge of Hell?",
    options: [
        "Jibril",
        "Malik",
        "Israfil",
        "Mikail"
    ],
    answer: 1,
    explanation:
        "Malik is named in the Qur'an as the keeper of Hell."
},

{
    question:
        "Which companion was the first adult male to accept Islam according to the commonly transmitted account?",
    options: [
        "Umar ibn al-Khattab",
        "Abu Bakr as-Siddiq",
        "Uthman ibn Affan",
        "Ali ibn Abi Talib"
    ],
    answer: 1,
    explanation:
        "Abu Bakr رضي الله عنه is commonly described as the first adult free man to accept Islam."
},

{
    question:
        "Which companion was the Prophet's ﷺ cousin and son-in-law?",
    options: [
        "Ali ibn Abi Talib",
        "Abu Hurayrah",
        "Bilal ibn Rabah",
        "Salman al-Farisi"
    ],
    answer: 0,
    explanation:
        "Ali ibn Abi Talib رضي الله عنه was the Prophet's ﷺ cousin and later married his daughter Fatimah رضي الله عنها."
},

{
    question:
        "Who was the father of Fatimah رضي الله عنها?",
    options: [
        "Abu Bakr",
        "Umar ibn al-Khattab",
        "Muhammad ﷺ",
        "Abbas ibn Abd al-Muttalib"
    ],
    answer: 2,
    explanation:
        "Fatimah رضي الله عنها was the daughter of Prophet Muhammad ﷺ."
},

{
    question:
        "Which companion was famous for being the first mu'adhdhin?",
    options: [
        "Bilal ibn Rabah",
        "Salman al-Farisi",
        "Abu Dharr",
        "Zayd ibn Thabit"
    ],
    answer: 0,
    explanation:
        "Bilal ibn Rabah رضي الله عنه is famously associated with being the first mu'adhdhin of the Muslim community."
},

{
    question:
        "What was the name of the Prophet Muhammad's ﷺ mother?",
    options: [
        "Aminah bint Wahb",
        "Halimah as-Sa'diyyah",
        "Khadijah bint Khuwaylid",
        "Fatimah bint Asad"
    ],
    answer: 0,
    explanation:
        "Aminah bint Wahb was the mother of Prophet Muhammad ﷺ."
},

{
    question:
        "Who was the foster mother who cared for the Prophet Muhammad ﷺ during part of his childhood?",
    options: [
        "Aminah bint Wahb",
        "Halimah as-Sa'diyyah",
        "A'ishah bint Abi Bakr",
        "Umm Salamah"
    ],
    answer: 1,
    explanation:
        "Halimah as-Sa'diyyah was the Prophet's ﷺ famous foster mother."
},

{
    question:
        "Which wife of the Prophet ﷺ was the daughter of Abu Bakr رضي الله عنه?",
    options: [
        "Hafsa",
        "A'ishah",
        "Zaynab",
        "Umm Salamah"
    ],
    answer: 1,
    explanation:
        "A'ishah رضي الله عنها was the daughter of Abu Bakr as-Siddiq رضي الله عنه."
},

{
    question:
        "Which wife of the Prophet ﷺ was the daughter of Umar ibn al-Khattab رضي الله عنه?",
    options: [
        "Hafsa",
        "A'ishah",
        "Safiyyah",
        "Maymunah"
    ],
    answer: 0,
    explanation:
        "Hafsa رضي الله عنها was the daughter of Umar ibn al-Khattab رضي الله عنه."
},

{
    question:
        "What was the name of the Prophet Muhammad's ﷺ first wife?",
    options: [
        "A'ishah",
        "Khadijah",
        "Hafsa",
        "Zaynab"
    ],
    answer: 1,
    explanation:
        "Khadijah bint Khuwaylid رضي الله عنها was the Prophet's ﷺ first wife."
},

{
    question:
        "Which city did the Prophet ﷺ migrate to during the Hijrah?",
    options: [
        "Ta'if",
        "Jerusalem",
        "Madinah",
        "Damascus"
    ],
    answer: 2,
    explanation:
        "The Prophet ﷺ migrated from Makkah to Madinah during the Hijrah."
},

{
    question:
        "Which battle was the first major military confrontation between the Muslims and Quraysh?",
    options: [
        "Uhud",
        "Badr",
        "Khandaq",
        "Hunayn"
    ],
    answer: 1,
    explanation:
        "The Battle of Badr was the first major battle between the Muslims and Quraysh."
},

{
    question:
        "In which battle did the Muslims initially gain an advantage but later face serious difficulty after some archers left their assigned position?",
    options: [
        "Badr",
        "Uhud",
        "Hunayn",
        "Tabuk"
    ],
    answer: 1,
    explanation:
        "At Uhud, some archers left their assigned position despite instructions, contributing to the change in the course of the battle."
},

{
    question:
        "Which mosque did the Prophet ﷺ establish after arriving near Madinah during the Hijrah?",
    options: [
        "Masjid Quba",
        "Masjid al-Haram",
        "Masjid al-Aqsa",
        "Masjid an-Nabawi"
    ],
    answer: 0,
    explanation:
        "Masjid Quba was established during the Prophet's ﷺ arrival in the area of Madinah."
},

{
    question:
        "Which mosque is located in Makkah and contains the Ka'bah?",
    options: [
        "Masjid an-Nabawi",
        "Masjid Quba",
        "Masjid al-Haram",
        "Masjid al-Qiblatayn"
    ],
    answer: 2,
    explanation:
        "Masjid al-Haram in Makkah surrounds the Ka'bah."
},

{
    question:
        "Which mosque is located in Madinah and contains the Prophet's ﷺ mosque?",
    options: [
        "Masjid al-Haram",
        "Masjid an-Nabawi",
        "Masjid Quba",
        "Masjid al-Aqsa"
    ],
    answer: 1,
    explanation:
        "Masjid an-Nabawi is the Prophet's ﷺ Mosque in Madinah."
},

{
    question:
        "Which of the following is NOT one of the Five Pillars of Islam?",
    options: [
        "Hajj",
        "Salah",
        "Sawm",
        "Belief in the angels"
    ],
    answer: 3,
    explanation:
        "Belief in the angels is an article of faith, not one of the Five Pillars."
},

{
    question:
        "Which pillar requires Muslims who are physically and financially able to travel to Makkah at least once in their lifetime?",
    options: [
        "Zakat",
        "Hajj",
        "Sawm",
        "Shahadah"
    ],
    answer: 1,
    explanation:
        "Hajj is obligatory once in a lifetime for Muslims who meet the required conditions of ability."
},

{
    question:
        "What does Sawm primarily refer to in the context of Ramadan?",
    options: [
        "Pilgrimage",
        "Fasting",
        "Charity",
        "Night prayer"
    ],
    answer: 1,
    explanation:
        "Sawm refers to fasting, and fasting Ramadan is one of the Five Pillars of Islam."
},

{
    question:
        "Which direction served as the qiblah before the direction was changed toward the Ka'bah?",
    options: [
        "Mount Sinai",
        "Jerusalem",
        "Madinah",
        "Ta'if"
    ],
    answer: 1,
    explanation:
        "Jerusalem was the earlier qiblah before the direction was changed toward the Ka'bah."
},

{
    question:
        "Which surah is the shortest surah in the Qur'an by number of verses?",
    options: [
        "Al-Ikhlas",
        "Al-Asr",
        "Al-Kawthar",
        "An-Nas"
    ],
    answer: 2,
    explanation:
        "Al-Kawthar consists of three verses and is the shortest surah by verse count."
},

{
    question:
        "Which surah begins with 'Alhamdu lillahi Rabbil-'alamin'?",
    options: [
        "Al-Fatihah",
        "Al-Baqarah",
        "Al-Kahf",
        "Al-Mulk"
    ],
    answer: 0,
    explanation:
        "Surah Al-Fatihah begins with praise of Allah as the Lord of the worlds."
},

{
    question:
        "Which surah is commonly known as the 'Heart of the Qur'an' in traditional usage?",
    options: [
        "Yasin",
        "Al-Baqarah",
        "Al-Mulk",
        "Ar-Rahman"
    ],
    answer: 0,
    explanation:
        "Yasin is traditionally referred to as the 'Heart of the Qur'an' in a commonly circulated expression."
}   
    ],

    /* =====================================================
       ADVANCED
    ===================================================== */

    advanced: [

        {
            q: "Which event is traditionally associated with the beginning of the public call to Islam after the initial private period?",
            a: [
                "The gathering of the Quraysh at As-Safa",
                "The Treaty of Hudaybiyyah",
                "The Farewell Hajj",
                "The conquest of Makkah"
            ],
            correct: 0,
            explanation:
                "The Prophet ﷺ publicly called his people after being commanded to warn his nearest relatives."
        },

        {
            q: "Which companion was sent as a judge and teacher to Yemen during the Prophet's ﷺ lifetime?",
            a: [
                "Mu'adh ibn Jabal",
                "Abu Hurayrah",
                "Bilal ibn Rabah",
                "Zayd ibn Thabit"
            ],
            correct: 0,
            explanation:
                "Mu'adh ibn Jabal رضي الله عنه was sent to Yemen and was known for his knowledge and understanding."
        },

        {
            q: "Which expedition is associated with the year 9 AH and the difficult journey northward?",
            a: [
                "Tabuk",
                "Badr",
                "Uhud",
                "Khandaq"
            ],
            correct: 0,
            explanation:
                "The expedition of Tabuk occurred in 9 AH."
        },

        {
            q: "Which companion was the father of Abdullah ibn Umar?",
            a: [
                "Umar ibn al-Khattab",
                "Abu Bakr",
                "Uthman ibn Affan",
                "Ali ibn Abi Talib"
            ],
            correct: 0,
            explanation:
                "Abdullah ibn Umar رضي الله عنهما was the son of Umar ibn al-Khattab رضي الله عنه."
        },

        {
            q: "Which wife of the Prophet ﷺ was the daughter of Abu Bakr رضي الله عنه?",
            a: [
                "Hafsa",
                "Aishah",
                "Umm Salamah",
                "Zaynab"
            ],
            correct: 1,
            explanation:
                "Aishah رضي الله عنها was the daughter of Abu Bakr رضي الله عنه."
        },

        {
            q: "Which wife of the Prophet ﷺ was the daughter of Umar ibn al-Khattab رضي الله عنه?",
            a: [
                "Aishah",
                "Hafsa",
                "Safiyyah",
                "Maymunah"
            ],
            correct: 1,
            explanation:
                "Hafsa رضي الله عنها was the daughter of Umar ibn al-Khattab رضي الله عنه."
        },

        {
            q: "Which battle occurred after the Treaty of Hudaybiyyah and before the conquest of Makkah?",
            a: [
                "Battle of Khaybar",
                "Battle of Badr",
                "Battle of Uhud",
                "Battle of Mu'tah"
            ],
            correct: 0,
            explanation:
                "The campaign of Khaybar occurred after Hudaybiyyah and before the conquest of Makkah."
        },

        {
            q: "Which companion was known as Amin al-Ummah, the trustworthy one of this nation?",
            a: [
                "Abu Ubaydah ibn al-Jarrah",
                "Abu Dharr al-Ghifari",
                "Talhah ibn Ubaydillah",
                "Sa'd ibn Abi Waqqas"
            ],
            correct: 0,
            explanation:
                "Abu Ubaydah ibn al-Jarrah رضي الله عنه was famously described as the trustworthy one of this nation."
        },

        {
            q: "Which companion was known for his ability to read and write and served as a scribe for the Prophet ﷺ?",
            a: [
                "Zayd ibn Thabit",
                "Khalid ibn al-Walid",
                "Bilal ibn Rabah",
                "Abu Hurayrah"
            ],
            correct: 0,
            explanation:
                "Zayd ibn Thabit رضي الله عنه served as one of the scribes and had important roles involving writing."
        },

        {
            q: "Which event directly followed the conquest of Makkah in the major sequence of events of the Prophet's ﷺ later life?",
            a: [
                "Battle of Hunayn",
                "Battle of Badr",
                "Hijrah",
                "Treaty of Hudaybiyyah"
            ],
            correct: 0,
            explanation:
                "The Battle of Hunayn followed the conquest of Makkah in 8 AH."
        },

        {
            q: "Which companion was one of the earliest Muslims and was tortured for his faith before becoming a prominent companion?",
            a: [
                "Bilal ibn Rabah",
                "Abu Sufyan",
                "Muawiyah ibn Abi Sufyan",
                "Amr ibn al-As"
            ],
            correct: 0,
            explanation:
                "Bilal رضي الله عنه was among the early Muslims and endured persecution for his faith."
        },

        {
            q: "Which surah begins with the words commonly translated as 'Praise belongs to Allah, Lord of the worlds'?",
            a: [
                "Al-Fatihah",
                "Al-Baqarah",
                "Al-Ikhlas",
                "Al-Falaq"
            ],
            correct: 0,
            explanation:
                "Surah Al-Fatihah begins with Al-hamdu lillahi Rabbil-'alamin."
        },

        {
            q: "Which companion was known for his famous role in the conquest of Egypt?",
            a: [
                "Amr ibn al-As",
                "Abu Hurayrah",
                "Zayd ibn Thabit",
                "Abdullah ibn Abbas"
            ],
            correct: 0,
            explanation:
                "Amr ibn al-As رضي الله عنه played the leading military role in the Muslim conquest of Egypt."
        },

        {
            q: "Which companion was the cousin of the Prophet ﷺ and was known for his knowledge of Qur'anic interpretation?",
            a: [
                "Abdullah ibn Abbas",
                "Abdullah ibn Umar",
                "Abdullah ibn Mas'ud",
                "Abdullah ibn Amr"
            ],
            correct: 0,
            explanation:
                "Abdullah ibn Abbas رضي الله عنهما was the Prophet's ﷺ cousin and became renowned for Qur'anic knowledge."
        },

        {
            q: "Which major event occurred in 8 AH?",
            a: [
                "The conquest of Makkah",
                "The Battle of Badr",
                "The Treaty of Hudaybiyyah",
                "The Battle of Uhud"
            ],
            correct: 0,
            explanation:
                "The conquest of Makkah occurred in Ramadan of 8 AH."
        },

        {
            q: "Which companion was known for his exceptional knowledge of halal and haram?",
            a: [
                "Mu'adh ibn Jabal",
                "Bilal ibn Rabah",
                "Khalid ibn al-Walid",
                "Abu Sufyan"
            ],
            correct: 0,
            explanation:
                "Mu'adh ibn Jabal رضي الله عنه was particularly respected for his knowledge."
        },

        {
            q: "Which battle took place in 5 AH?",
            a: [
                "Battle of the Trench",
                "Battle of Badr",
                "Battle of Uhud",
                "Battle of Hunayn"
            ],
            correct: 0,
            explanation:
                "The Battle of the Trench occurred in 5 AH."
        },

        {
            q: "Which companion was the son of Abu Talib and became the fourth Rightly Guided Caliph?",
            a: [
                "Ali ibn Abi Talib",
                "Ja'far ibn Abi Talib",
                "Aqil ibn Abi Talib",
                "Al-Abbas ibn Abd al-Muttalib"
            ],
            correct: 0,
            explanation:
                "Ali ibn Abi Talib رضي الله عنه was the son of Abu Talib and the fourth Rightly Guided Caliph."
        },

        {
            q: "Which year is commonly known as the Year of the Elephant?",
            a: [
                "The year associated with the attempted attack on the Ka'bah by Abraha",
                "The year of the Treaty of Hudaybiyyah",
                "The year of the conquest of Makkah",
                "The year of the Farewell Hajj"
            ],
            correct: 0,
            explanation:
                "The Year of the Elephant is associated with Abraha's attempted attack on the Ka'bah."
        },

        {
            q: "Which companion was the first adult male to accept Islam according to the commonly transmitted account?",
            a: [
                "Abu Bakr",
                "Umar",
                "Uthman",
                "Ali"
            ],
            correct: 0,
            explanation:
                "Abu Bakr رضي الله عنه is commonly described as the first adult male to accept Islam."
        },
     /* =====================================================
   ADVANCED — BATCH 2
   More complex questions
===================================================== */

{
    question:
        "Which companion was sent by the Prophet ﷺ to Yemen as a judge and teacher, and was instructed to begin with the Qur'an, then the Sunnah, when deciding matters?",
    options: [
        "Mu'adh ibn Jabal",
        "Abu Musa al-Ash'ari",
        "Zayd ibn Thabit",
        "Abdullah ibn Abbas"
    ],
    answer: 0,
    explanation:
        "Mu'adh ibn Jabal رضي الله عنه was sent to Yemen and is famously associated with the guidance concerning judging by the Book of Allah, then the Sunnah."
},

{
    question:
        "Which event directly led to the revelation of verses addressing the incident involving the slander against A'ishah رضي الله عنها?",
    options: [
        "The expedition of Tabuk",
        "The incident of Al-Ifk",
        "The Battle of Uhud",
        "The Treaty of Hudaybiyyah"
    ],
    answer: 1,
    explanation:
        "The incident known as Al-Ifk involved a false accusation against A'ishah رضي الله عنها, and Qur'anic verses in Surah An-Nur addressed the matter."
},

{
    question:
        "Which companion was particularly famous for his interpretation and understanding of the Qur'an and was called the 'Interpreter of the Qur'an' in later Islamic tradition?",
    options: [
        "Abdullah ibn Abbas",
        "Abdullah ibn Umar",
        "Abu Hurayrah",
        "Anas ibn Malik"
    ],
    answer: 0,
    explanation:
        "Abdullah ibn Abbas رضي الله عنهما became renowned for his knowledge and interpretation of the Qur'an."
},

{
    question:
        "Which expedition took place in 9 AH and was the final major military expedition led by the Prophet ﷺ?",
    options: [
        "Expedition of Khaybar",
        "Expedition of Mu'tah",
        "Expedition of Tabuk",
        "Expedition of Hunayn"
    ],
    answer: 2,
    explanation:
        "The expedition of Tabuk took place in 9 AH and is generally regarded as the last major expedition led by the Prophet ﷺ."
},

{
    question:
        "Which companion was responsible for carrying the banner of the Muslims at the Battle of Uhud after the first standard-bearer was martyred?",
    options: [
        "Mus'ab ibn Umayr",
        "Ali ibn Abi Talib",
        "Hamzah ibn Abd al-Muttalib",
        "Sa'd ibn Abi Waqqas"
    ],
    answer: 0,
    explanation:
        "Mus'ab ibn Umayr رضي الله عنه carried the Muslim banner at Uhud and was martyred during the battle."
},

{
    question:
        "Which surah contains the account of the change in the qiblah from the direction of Jerusalem toward the Sacred Mosque?",
    options: [
        "Al-Baqarah",
        "Al-Anfal",
        "Al-Ma'idah",
        "Al-Fath"
    ],
    answer: 0,
    explanation:
        "Surah Al-Baqarah contains the verses discussing the change of the qiblah toward Al-Masjid Al-Haram."
},

{
    question:
        "Which companion was appointed by Abu Bakr رضي الله عنه to lead the initial collection of the Qur'anic material into a compiled collection?",
    options: [
        "Ubayy ibn Ka'b",
        "Zayd ibn Thabit",
        "Abdullah ibn Mas'ud",
        "Ali ibn Abi Talib"
    ],
    answer: 1,
    explanation:
        "Abu Bakr رضي الله عنه appointed Zayd ibn Thabit رضي الله عنه to undertake the collection of the Qur'anic material."
},

{
    question:
        "Which battle is associated with the strategic use of a trench around Madinah?",
    options: [
        "Badr",
        "Uhud",
        "Al-Ahzab",
        "Khaybar"
    ],
    answer: 2,
    explanation:
        "During Al-Ahzab, also known as the Battle of the Trench, a trench was dug around exposed areas of Madinah as a defensive strategy."
},

{
    question:
        "Who suggested digging the defensive trench during the Battle of Al-Ahzab?",
    options: [
        "Salman al-Farisi",
        "Bilal ibn Rabah",
        "Abu Dharr al-Ghifari",
        "Hudhayfah ibn al-Yaman"
    ],
    answer: 0,
    explanation:
        "Salman al-Farisi رضي الله عنه suggested the trench strategy, drawing on a defensive practice known in Persia."
},

{
    question:
        "Which companion was known as the keeper of the secrets of the Prophet ﷺ because the Prophet ﷺ entrusted him with information concerning hypocrites?",
    options: [
        "Hudhayfah ibn al-Yaman",
        "Abu Darda",
        "Abu Musa al-Ash'ari",
        "Al-Bara ibn Malik"
    ],
    answer: 0,
    explanation:
        "Hudhayfah ibn al-Yaman رضي الله عنه was entrusted with knowledge concerning certain hypocrites and became known as the keeper of the Prophet's ﷺ secrets."
},

{
    question:
        "Which event occurred first in the commonly taught chronology of the Prophet's ﷺ Madinan period?",
    options: [
        "The Battle of Badr",
        "The Treaty of Hudaybiyyah",
        "The Battle of Uhud",
        "The Conquest of Makkah"
    ],
    answer: 0,
    explanation:
        "The Battle of Badr occurred in 2 AH, before Uhud in 3 AH, Hudaybiyyah in 6 AH, and the Conquest of Makkah in 8 AH."
},

{
    question:
        "Which companion was among the earliest Muslims and was known for his extraordinary patience under persecution in Makkah?",
    options: [
        "Bilal ibn Rabah",
        "Abu Sufyan ibn Harb",
        "Ikrimah ibn Abi Jahl",
        "Mu'awiyah ibn Abi Sufyan"
    ],
    answer: 0,
    explanation:
        "Bilal ibn Rabah رضي الله عنه accepted Islam early and endured severe persecution in Makkah."
},

{
    question:
        "Which surah is named after a woman and contains an extended account concerning the family of Imran and Maryam عليها السلام?",
    options: [
        "An-Nisa",
        "Maryam",
        "Al-Imran",
        "Al-Mumtahanah"
    ],
    answer: 2,
    explanation:
        "Surah Al-Imran discusses the family of Imran and contains substantial passages concerning Maryam عليها السلام and Isa عليه السلام."
},

{
    question:
        "Which companion was known for his ability to read and write and served as one of the scribes involved in recording revelation?",
    options: [
        "Zayd ibn Thabit",
        "Khalid ibn al-Walid",
        "Abu Hurayrah",
        "Bilal ibn Rabah"
    ],
    answer: 0,
    explanation:
        "Zayd ibn Thabit رضي الله عنه was one of the scribes associated with recording revelation and later played an important role in Qur'an compilation."
},

{
    question:
        "What was the primary strategic purpose of the Treaty of Hudaybiyyah from the Muslim perspective?",
    options: [
        "To immediately conquer Makkah",
        "To establish a period of peace and secure conditions for the Muslim community",
        "To abolish all tribal alliances in Arabia",
        "To transfer the capital from Madinah to Makkah"
    ],
    answer: 1,
    explanation:
        "The treaty established a period of peace between the Muslims and Quraysh and created conditions that significantly benefited the spread and stability of Islam."
},

{
    question:
        "Which companion was sent by the Prophet ﷺ to Madinah before the Hijrah to teach people and spread the message of Islam?",
    options: [
        "Mus'ab ibn Umayr",
        "Khalid ibn al-Walid",
        "Abu Ubaydah ibn al-Jarrah",
        "Sa'd ibn Abi Waqqas"
    ],
    answer: 0,
    explanation:
        "Mus'ab ibn Umayr رضي الله عنه was sent to Yathrib before the Hijrah to teach those who had accepted Islam."
},

{
    question:
        "Which battle resulted in the Muslims capturing a significant number of prisoners and marked the first major military victory of the Muslim community?",
    options: [
        "Badr",
        "Uhud",
        "Hunayn",
        "Tabuk"
    ],
    answer: 0,
    explanation:
        "The Battle of Badr in 2 AH was the first major military victory of the Muslim community and resulted in prisoners being taken."
},

{
    question:
        "Which companion was famous for saying that he had learned many surahs directly from the Prophet ﷺ and was particularly associated with Qur'anic recitation?",
    options: [
        "Ubayy ibn Ka'b",
        "Abu Talhah al-Ansari",
        "Sa'd ibn Mu'adh",
        "Amr ibn al-As"
    ],
    answer: 0,
    explanation:
        "Ubayy ibn Ka'b رضي الله عنه was one of the prominent companions known for Qur'anic recitation and knowledge."
},

{
    question:
        "Which event was one of the major reasons the Prophet ﷺ and the Muslims eventually returned to Makkah peacefully in 8 AH?",
    options: [
        "The breaking of the Treaty of Hudaybiyyah by Quraysh's allied forces",
        "The death of Abu Talib",
        "The Battle of Uhud",
        "The migration to Abyssinia"
    ],
    answer: 0,
    explanation:
        "The violation of the Hudaybiyyah agreement involving Quraysh's allies contributed directly to the circumstances leading to the Conquest of Makkah."
},

{
    question:
        "Which companion was appointed by the Prophet ﷺ as a governor and judge in Yemen and belonged to the Ansar?",
    options: [
        "Mu'adh ibn Jabal",
        "Abu Sufyan",
        "Khalid ibn al-Walid",
        "Amr ibn al-As"
    ],
    answer: 0,
    explanation:
        "Mu'adh ibn Jabal رضي الله عنه was an Ansari companion who was sent to Yemen in a teaching and judicial capacity."
},

{
    question:
        "Which surah contains the detailed account of the Prophet Yusuf عليه السلام in a continuous narrative?",
    options: [
        "Surah Hud",
        "Surah Yusuf",
        "Surah Ibrahim",
        "Surah Al-Qasas"
    ],
    answer: 1,
    explanation:
        "Surah Yusuf is distinctive for presenting the story of Yusuf عليه السلام as an extended continuous narrative."
},

{
    question:
        "Which companion was one of the commanders during the Battle of Mu'tah and was later famously known for his military leadership?",
    options: [
        "Khalid ibn al-Walid",
        "Abu Hurayrah",
        "Zayd ibn Thabit",
        "Abdullah ibn Abbas"
    ],
    answer: 0,
    explanation:
        "Khalid ibn al-Walid رضي الله عنه took command at Mu'tah after the appointed commanders were killed and became renowned for his military leadership."
},

{
    question:
        "Which of the following best describes the significance of the Pledges of Al-Aqabah?",
    options: [
        "They established the first Muslim naval fleet",
        "They involved people from Yathrib pledging support and allegiance to the Prophet ﷺ",
        "They marked the conquest of Makkah",
        "They established the first written Qur'anic manuscript"
    ],
    answer: 1,
    explanation:
        "The Pledges of Al-Aqabah involved people from Yathrib pledging allegiance and support to the Prophet ﷺ and played a crucial role in the preparations for the Hijrah."
},

{
    question:
        "Which companion was known for his close companionship with the Prophet ﷺ during the migration and was mentioned as the companion in the cave?",
    options: [
        "Umar ibn al-Khattab",
        "Abu Bakr as-Siddiq",
        "Uthman ibn Affan",
        "Ali ibn Abi Talib"
    ],
    answer: 1,
    explanation:
        "Abu Bakr رضي الله عنه accompanied the Prophet ﷺ during the Hijrah and was with him in the cave."
},

{
    question:
        "Which event occurred after the Battle of Uhud but before the Treaty of Hudaybiyyah?",
    options: [
        "The Battle of Al-Ahzab",
        "The Conquest of Makkah",
        "The Farewell Hajj",
        "The expedition of Tabuk"
    ],
    answer: 0,
    explanation:
        "The Battle of Al-Ahzab occurred in 5 AH, after Uhud in 3 AH and before Hudaybiyyah in 6 AH."
},

{
    question:
        "Which companion was famous for his knowledge of the lawful and unlawful and was among the scholars of the companions?",
    options: [
        "Mu'adh ibn Jabal",
        "Abu Lahab",
        "Abu Jahl",
        "Utbah ibn Rabi'ah"
    ],
    answer: 0,
    explanation:
        "Mu'adh ibn Jabal رضي الله عنه was renowned among the companions for his knowledge of matters of halal and haram."
},

{
    question:
        "Which city became the political center of the Muslim community after the Hijrah?",
    options: [
        "Makkah",
        "Ta'if",
        "Madinah",
        "Jerusalem"
    ],
    answer: 2,
    explanation:
        "Madinah became the center of the Muslim community after the Prophet's ﷺ migration there."
},

{
    question:
        "Which companion was the father of Abdullah ibn Umar and became the second caliph?",
    options: [
        "Abu Bakr as-Siddiq",
        "Umar ibn al-Khattab",
        "Uthman ibn Affan",
        "Ali ibn Abi Talib"
    ],
    answer: 1,
    explanation:
        "Umar ibn al-Khattab رضي الله عنه was the second Rightly Guided Caliph and the father of Abdullah ibn Umar رضي الله عنهما."
},

{
    question:
        "Which event is associated with the revelation of Surah Al-Fath?",
    options: [
        "The Battle of Badr",
        "The Treaty of Hudaybiyyah",
        "The Battle of Uhud",
        "The Conquest of Ta'if"
    ],
    answer: 1,
    explanation:
        "Surah Al-Fath was revealed in connection with the events surrounding the Treaty of Hudaybiyyah and its consequences."
}
    ],


    /* =====================================================
       EXPERT
    ===================================================== */

    expert: [

        {
            q: "Which sequence correctly places these events from earliest to latest?",
            a: [
                "First revelation → Hijrah → Hudaybiyyah → Conquest of Makkah",
                "Hijrah → First revelation → Conquest of Makkah → Hudaybiyyah",
                "Hudaybiyyah → First revelation → Hijrah → Conquest of Makkah",
                "Conquest of Makkah → Hudaybiyyah → Hijrah → First revelation"
            ],
            correct: 0,
            explanation:
                "The first revelation preceded the Hijrah; Hudaybiyyah occurred in 6 AH and the conquest of Makkah in 8 AH."
        },

        {
            q: "Which statement most accurately distinguishes the two major stages of Qur'anic compilation associated with Abu Bakr and Uthman رضي الله عنهما?",
            a: [
                "Abu Bakr's compilation gathered the material into a collection, while Uthman's effort standardized copies for distribution",
                "Abu Bakr standardized regional copies, while Uthman first collected the Qur'an",
                "Both efforts were identical and had exactly the same purpose",
                "Neither caliph had any role in the preservation of written Qur'anic material"
            ],
            correct: 0,
            explanation:
                "The two efforts had different historical purposes: the first collection was undertaken during Abu Bakr's caliphate, while Uthman's effort standardized copies and distributed them."
        },

        {
            q: "Which companion is associated with both the compilation project under Abu Bakr and the later standardization project under Uthman?",
            a: [
                "Zayd ibn Thabit",
                "Khalid ibn al-Walid",
                "Amr ibn al-As",
                "Sa'd ibn Abi Waqqas"
            ],
            correct: 0,
            explanation:
                "Zayd ibn Thabit رضي الله عنه was involved in the compilation under Abu Bakr and later in Uthman's standardization effort."
        },

        {
            q: "Which event provided the political circumstances that led to the first pledge at Al-Aqabah being followed by further preparation for the Hijrah?",
            a: [
                "The growing acceptance of Islam among people from Yathrib",
                "The conquest of Makkah",
                "The Battle of Khaybar",
                "The Farewell Hajj"
            ],
            correct: 0,
            explanation:
                "The acceptance of Islam among people from Yathrib created the circumstances that led to the pledges and eventual migration."
        },

        {
            q: "Which pair is correctly matched?",
            a: [
                "Abu Ubaydah — Amin al-Ummah",
                "Khalid ibn al-Walid — Dhun-Nurayn",
                "Uthman — Al-Faruq",
                "Umar — Saifullah"
            ],
            correct: 0,
            explanation:
                "Abu Ubaydah ibn al-Jarrah رضي الله عنه was known as Amin al-Ummah."
        },

        {
            q: "Which event occurred in 6 AH and eventually contributed to a period of relative peace that allowed Islam to spread more widely?",
            a: [
                "Treaty of Hudaybiyyah",
                "Battle of Uhud",
                "Battle of Badr",
                "Conquest of Makkah"
            ],
            correct: 0,
            explanation:
                "The Treaty of Hudaybiyyah created a period of truce that had important consequences for the spread of Islam."
        },

        {
            q: "Which companion is correctly paired with his area of distinction?",
            a: [
                "Zayd ibn Thabit — inheritance law",
                "Bilal ibn Rabah — Qur'anic compilation",
                "Khalid ibn al-Walid — revelation writing",
                "Abu Hurayrah — standardization of Qur'anic copies"
            ],
            correct: 0,
            explanation:
                "Zayd ibn Thabit رضي الله عنه was especially renowned for knowledge of inheritance."
        },

        {
            q: "Which chronological relationship is correct?",
            a: [
                "Badr occurred before Uhud, and Uhud occurred before the Battle of the Trench",
                "Uhud occurred before Badr, and the Trench occurred before Uhud",
                "The Trench occurred before Badr",
                "Badr and the Trench occurred in the same year"
            ],
            correct: 0,
            explanation:
                "Badr occurred in 2 AH, Uhud in 3 AH, and the Battle of the Trench in 5 AH."
        },

        {
            q: "Which description best identifies Abdullah ibn Abbas رضي الله عنهما?",
            a: [
                "A cousin of the Prophet ﷺ renowned for Qur'anic knowledge and interpretation",
                "The companion known as the first mu'adhdhin",
                "The commander known as Saifullah",
                "The caliph known as Dhun-Nurayn"
            ],
            correct: 0,
            explanation:
                "Abdullah ibn Abbas رضي الله عنهما was the Prophet's ﷺ cousin and became renowned for Qur'anic knowledge."
        },

        {
            q: "Which event belongs to 8 AH rather than 6 AH?",
            a: [
                "The conquest of Makkah",
                "The Treaty of Hudaybiyyah",
                "The first pledge at Al-Aqabah",
                "The second pledge at Al-Aqabah"
            ],
            correct: 0,
            explanation:
                "The conquest of Makkah occurred in 8 AH, while Hudaybiyyah occurred in 6 AH."
        },

        {
            q: "Which pairing correctly connects a title with the companion who held it?",
            a: [
                "Saifullah — Khalid ibn al-Walid",
                "Dhun-Nurayn — Umar ibn al-Khattab",
                "Al-Faruq — Uthman ibn Affan",
                "Amin al-Ummah — Abu Hurayrah"
            ],
            correct: 0,
            explanation:
                "Khalid ibn al-Walid رضي الله عنه was known as Saifullah, the Sword of Allah."
        },

        {
            q: "Which statement about the Hijrah is chronologically correct?",
            a: [
                "It occurred after the pledges at Al-Aqabah and before the Treaty of Hudaybiyyah",
                "It occurred after the conquest of Makkah",
                "It occurred after the Farewell Hajj",
                "It occurred after the Battle of Khaybar"
            ],
            correct: 0,
            explanation:
                "The Hijrah followed the pledges at Al-Aqabah and occurred years before Hudaybiyyah."
        },

        {
            q: "Which combination correctly identifies the three events in their approximate order?",
            a: [
                "Badr → Uhud → Khandaq",
                "Uhud → Badr → Khandaq",
                "Khandaq → Badr → Uhud",
                "Badr → Khandaq → Uhud"
            ],
            correct: 0,
            explanation:
                "Badr occurred in 2 AH, Uhud in 3 AH, and Khandaq in 5 AH."
        },

        {
            q: "Which companion's role is most directly connected to the writing and preservation of Qur'anic material during the Prophet's ﷺ lifetime and later compilation efforts?",
            a: [
                "Zayd ibn Thabit",
                "Khalid ibn al-Walid",
                "Abu Ubaydah ibn al-Jarrah",
                "Sa'd ibn Abi Waqqas"
            ],
            correct: 0,
            explanation:
                "Zayd ibn Thabit رضي الله عنه was among the scribes and later played a major role in Qur'anic compilation."
        },

        {
            q: "Which statement best describes why the Battle of the Trench is also called Al-Ahzab?",
            a: [
                "The opposing forces consisted of a confederation of groups",
                "The battle took place in the city of Ahzab",
                "The Muslims were divided into several separate armies",
                "It was fought exclusively between two tribes"
            ],
            correct: 0,
            explanation:
                "Al-Ahzab refers to the confederated groups that gathered against the Muslims."
        },

        {
            q: "Which event came after the Treaty of Hudaybiyyah but before the conquest of Makkah?",
            a: [
                "The campaign of Khaybar",
                "The first revelation",
                "The Battle of Badr",
                "The Hijrah"
            ],
            correct: 0,
            explanation:
                "Khaybar occurred after Hudaybiyyah and before the conquest of Makkah."
        },

        {
            q: "Which companion is correctly connected to the early Muslim community in Yathrib before the Hijrah?",
            a: [
                "Mus'ab ibn Umayr",
                "Khalid ibn al-Walid",
                "Abu Sufyan",
                "Amr ibn al-As"
            ],
            correct: 0,
            explanation:
                "Mus'ab ibn Umayr رضي الله عنه was sent to Yathrib before the Hijrah to teach Islam."
        },

        {
            q: "Which statement correctly distinguishes the Prophet's ﷺ first revelation from the beginning of the public mission?",
            a: [
                "The first revelation occurred before the public proclamation of the message",
                "The public proclamation happened years before any revelation",
                "The first revelation occurred after the conquest of Makkah",
                "The public mission began after the Farewell Hajj"
            ],
            correct: 0,
            explanation:
                "The first revelation preceded the later public proclamation of the message."
        },

        {
            q: "Which sequence correctly orders these events?",
            a: [
                "Hijrah → Badr → Uhud → Khandaq",
                "Badr → Hijrah → Uhud → Khandaq",
                "Uhud → Hijrah → Badr → Khandaq",
                "Khandaq → Uhud → Badr → Hijrah"
            ],
            correct: 0,
            explanation:
                "The Hijrah occurred first, followed by Badr in 2 AH, Uhud in 3 AH, and Khandaq in 5 AH."
        },

        {
            q: "Which description best fits the purpose of the 90% progression rule in Iqranix?",
            a: [
                "A learner must demonstrate strong mastery before moving to a harder stage",
                "A learner can skip any stage after completing one question",
                "A learner automatically unlocks all stages after opening the quiz",
                "A learner only needs to complete the stage without answering questions"
            ],
            correct: 0,
            explanation:
                "The progression rule is designed so that advancement requires demonstrated mastery of the preceding stage."
        },
      /* =====================================================
   EXPERT — BATCH 2
   High-complexity Islamic knowledge
===================================================== */

{
    question:
        "During the compilation of the Qur'an under Abu Bakr رضي الله عنه, what was the principal reason given for undertaking the collection into a single written compilation?",
    options: [
        "The Qur'an had not previously been memorized by the companions",
        "The deaths of reciters at the Battle of Yamamah raised concern about preserving the written and memorized material",
        "The Prophet ﷺ had instructed Abu Bakr to produce a standardized mushaf",
        "Different Arabic dialects had caused the Qur'an to become incomplete"
    ],
    answer: 1,
    explanation:
        "The deaths of a number of Qur'an reciters at Yamamah prompted concern about preservation, leading Abu Bakr رضي الله عنه to commission Zayd ibn Thabit رضي الله عنه to collect the Qur'anic material."
},

{
    question:
        "What was the principal distinction between the collection of the Qur'an during Abu Bakr's caliphate and the standardization under Uthman رضي الله عنه?",
    options: [
        "Abu Bakr's collection preserved the material in a compiled collection, while Uthman's effort standardized written copies for wider distribution",
        "Abu Bakr introduced new verses, while Uthman removed verses",
        "Abu Bakr translated the Qur'an, while Uthman returned it to Arabic",
        "Abu Bakr collected only Makki revelation, while Uthman collected only Madani revelation"
    ],
    answer: 0,
    explanation:
        "The collection under Abu Bakr رضي الله عنه brought the existing Qur'anic material together, while Uthman رضي الله عنه later oversaw standardization of written copies and their distribution."
},

{
    question:
        "Which companion was specifically selected by Uthman رضي الله عنه to head the committee involved in producing standardized Qur'anic copies?",
    options: [
        "Zayd ibn Thabit",
        "Abdullah ibn Abbas",
        "Abdullah ibn Mas'ud",
        "Ubayy ibn Ka'b"
    ],
    answer: 0,
    explanation:
        "Zayd ibn Thabit رضي الله عنه played a central role in the committee appointed during Uthman's standardization of the Qur'anic manuscripts."
},

{
    question:
        "Which event most directly preceded the Treaty of Hudaybiyyah in the Prophet's ﷺ biography?",
    options: [
        "The Muslims set out intending to perform Umrah",
        "The conquest of Khaybar",
        "The Battle of Hunayn",
        "The expedition of Tabuk"
    ],
    answer: 0,
    explanation:
        "The Muslims set out from Madinah intending to perform Umrah, which led to the events culminating in the Treaty of Hudaybiyyah."
},

{
    question:
        "Which development most directly followed the Treaty of Hudaybiyyah and contributed to the rapid expansion of Islam?",
    options: [
        "A prolonged period of relative peace allowed increased interaction and propagation of Islam",
        "The Muslims immediately conquered Byzantine territory",
        "Madinah was abandoned as the Muslim political center",
        "The Quraysh immediately converted in their entirety"
    ],
    answer: 0,
    explanation:
        "The period of relative peace created by Hudaybiyyah allowed increased contact between Muslims and other tribes and contributed to the spread of Islam."
},

{
    question:
        "Which companion was sent to lead the Muslim army at Mu'tah before Khalid ibn al-Walid رضي الله عنه assumed command?",
    options: [
        "Zayd ibn Harithah",
        "Abu Ubaydah ibn al-Jarrah",
        "Sa'd ibn Abi Waqqas",
        "Amr ibn al-As"
    ],
    answer: 0,
    explanation:
        "Zayd ibn Harithah رضي الله عنه was the first appointed commander at Mu'tah, followed by Ja'far ibn Abi Talib and Abdullah ibn Rawahah."
},

{
    question:
        "Who assumed command of the Muslim army at Mu'tah after the three appointed commanders were killed?",
    options: [
        "Khalid ibn al-Walid",
        "Abu Ubaydah ibn al-Jarrah",
        "Amr ibn al-As",
        "Sa'd ibn Abi Waqqas"
    ],
    answer: 0,
    explanation:
        "Khalid ibn al-Walid رضي الله عنه took command after Zayd ibn Harithah, Ja'far ibn Abi Talib and Abdullah ibn Rawahah were killed."
},

{
    question:
        "Which companion was known by the title 'Amin al-Ummah', meaning the trustworthy one of this community?",
    options: [
        "Abu Ubaydah ibn al-Jarrah",
        "Abu Hurayrah",
        "Sa'd ibn Abi Waqqas",
        "Talhah ibn Ubaydillah"
    ],
    answer: 0,
    explanation:
        "Abu Ubaydah ibn al-Jarrah رضي الله عنه was famously described by the Prophet ﷺ as the trustworthy one of this community."
},

{
    question:
        "Which companion is especially associated with the science of Qur'anic recitation and was among those from whom the companions learned the Qur'an?",
    options: [
        "Ubayy ibn Ka'b",
        "Abu Sufyan ibn Harb",
        "Khalid ibn Sa'id",
        "Abu Lubabah"
    ],
    answer: 0,
    explanation:
        "Ubayy ibn Ka'b رضي الله عنه was one of the prominent companions known for Qur'anic recitation and teaching."
},

{
    question:
        "Which companion was famous for his detailed knowledge of the Prophet's ﷺ household and narrated many reports concerning his private life?",
    options: [
        "A'ishah رضي الله عنها",
        "Abu Dharr رضي الله عنه",
        "Khalid ibn al-Walid رضي الله عنه",
        "Sa'd ibn Mu'adh رضي الله عنه"
    ],
    answer: 0,
    explanation:
        "A'ishah رضي الله عنها was one of the most important transmitters of knowledge concerning the Prophet's ﷺ household, worship and personal conduct."
},

{
    question:
        "Which battle took place in 8 AH and occurred shortly before the Conquest of Makkah?",
    options: [
        "Hunayn",
        "Badr",
        "Uhud",
        "Khandaq"
    ],
    answer: 0,
    explanation:
        "The Battle of Hunayn occurred in 8 AH after the Conquest of Makkah."
},

{
    question:
        "Which event occurred in 8 AH after the Conquest of Makkah and involved the Muslim army facing Hawazin and Thaqif?",
    options: [
        "Battle of Hunayn",
        "Battle of Badr",
        "Battle of Uhud",
        "Battle of Mu'tah"
    ],
    answer: 0,
    explanation:
        "Hunayn occurred after the Conquest of Makkah and involved the Muslims against the forces of Hawazin and Thaqif."
},

{
    question:
        "Which companion was responsible for the killing of Musaylimah during the Battle of Yamamah according to the well-known historical account?",
    options: [
        "Wahshi ibn Harb",
        "Khalid ibn al-Walid",
        "Ikrimah ibn Abi Jahl",
        "Abu Dujanah"
    ],
    answer: 0,
    explanation:
        "Wahshi ibn Harb رضي الله عنه is traditionally credited with killing Musaylimah during the Battle of Yamamah."
},

{
    question:
        "Why was the Battle of Yamamah particularly significant in the history of Qur'anic preservation?",
    options: [
        "A large number of Qur'an reciters were killed, contributing to the decision to compile the Qur'an",
        "The Qur'an was first revealed there",
        "The first written mushaf was destroyed there",
        "The qiblah was changed there"
    ],
    answer: 0,
    explanation:
        "The deaths of many Qur'an reciters at Yamamah contributed to concerns about preserving the Qur'anic material and helped lead to the first major compilation."
},

{
    question:
        "Which of the following best distinguishes Isra from Mi'raj in the traditional Islamic account?",
    options: [
        "Isra refers to the night journey, while Mi'raj refers to the ascension",
        "Isra refers to the Hijrah, while Mi'raj refers to the conquest of Makkah",
        "Isra refers to revelation, while Mi'raj refers to fasting",
        "Isra refers to the Farewell Hajj, while Mi'raj refers to Umrah"
    ],
    answer: 0,
    explanation:
        "Isra refers to the Prophet's ﷺ night journey, while Mi'raj refers to the ascension associated with that event."
},

{
    question:
        "Which surah contains the verse commonly identified as Ayat al-Kursi?",
    options: [
        "Al-Baqarah",
        "Al-Imran",
        "An-Nisa",
        "Al-Ma'idah"
    ],
    answer: 0,
    explanation:
        "Ayat al-Kursi is Qur'an 2:255 in Surah Al-Baqarah."
},

{
    question:
        "Which Qur'anic surah contains the greatest concentration of detailed inheritance rulings?",
    options: [
        "An-Nisa",
        "Al-Anfal",
        "Al-Fath",
        "Al-Hashr"
    ],
    answer: 0,
    explanation:
        "Surah An-Nisa contains important and detailed Qur'anic legislation concerning inheritance and family law."
},

{
    question:
        "Which companion was particularly renowned for his knowledge of inheritance calculations?",
    options: [
        "Zayd ibn Thabit",
        "Bilal ibn Rabah",
        "Khalid ibn al-Walid",
        "Abu Dharr al-Ghifari"
    ],
    answer: 0,
    explanation:
        "Zayd ibn Thabit رضي الله عنه was particularly renowned among the companions for his knowledge of inheritance."
},

{
    question:
        "Which companion became known for his extensive knowledge of tafsir and was the son of Abbas ibn Abd al-Muttalib?",
    options: [
        "Abdullah ibn Abbas",
        "Abdullah ibn Umar",
        "Abdullah ibn Mas'ud",
        "Abdullah ibn Amr"
    ],
    answer: 0,
    explanation:
        "Abdullah ibn Abbas رضي الله عنهما was the son of Abbas ibn Abd al-Muttalib and became one of the foremost early authorities in Qur'anic interpretation."
},

{
    question:
        "Which companion was particularly associated with preserving written material from the Prophet's ﷺ correspondence and revelations during the early Muslim community?",
    options: [
        "Zayd ibn Thabit",
        "Abu Hurayrah",
        "Khalid ibn al-Walid",
        "Abu Dharr al-Ghifari"
    ],
    answer: 0,
    explanation:
        "Zayd ibn Thabit رضي الله عنه served as a scribe and was involved in recording material during the Prophet's ﷺ lifetime."
},

{
    question:
        "Which event resulted in the Muslim community gaining control over Makkah without the prolonged battle that many earlier conflicts had involved?",
    options: [
        "The Conquest of Makkah",
        "The Battle of Badr",
        "The Battle of Uhud",
        "The Battle of Khandaq"
    ],
    answer: 0,
    explanation:
        "The Conquest of Makkah in 8 AH was achieved with relatively limited fighting compared with earlier major battles."
},

{
    question:
        "Which companion was one of the six members of the consultation group appointed by Umar رضي الله عنه concerning succession after him?",
    options: [
        "Uthman ibn Affan",
        "Bilal ibn Rabah",
        "Abu Hurayrah",
        "Mu'adh ibn Jabal"
    ],
    answer: 0,
    explanation:
        "Uthman ibn Affan رضي الله عنه was one of the six members of the shura appointed by Umar رضي الله عنه."
},

{
    question:
        "Who became the third Rightly Guided Caliph after the consultation process following Umar's death?",
    options: [
        "Uthman ibn Affan",
        "Ali ibn Abi Talib",
        "Mu'awiyah ibn Abi Sufyan",
        "Abdullah ibn Umar"
    ],
    answer: 0,
    explanation:
        "Uthman ibn Affan رضي الله عنه was selected as the third Rightly Guided Caliph following the consultation."
},

{
    question:
        "Which development occurred during Uthman ibn Affan's caliphate and was intended to reduce disputes over Qur'anic recitation among expanding Muslim populations?",
    options: [
        "Standardization and distribution of written Qur'anic copies",
        "Translation of the Qur'an into Persian as the official text",
        "Replacement of Arabic with another language",
        "Compilation of a new Qur'an from memory alone"
    ],
    answer: 0,
    explanation:
        "Uthman رضي الله عنه commissioned standardized written copies and distributed them to major centers to address recitation disputes."
},

{
    question:
        "Which companion was known as 'Dhu al-Nurayn' because he married two daughters of the Prophet ﷺ at different times?",
    options: [
        "Uthman ibn Affan",
        "Ali ibn Abi Talib",
        "Abu Bakr as-Siddiq",
        "Abdur-Rahman ibn Awf"
    ],
    answer: 0,
    explanation:
        "Uthman ibn Affan رضي الله عنه married Ruqayyah رضي الله عنها and, after her death, Umm Kulthum رضي الله عنها, both daughters of the Prophet ﷺ."
},

{
    question:
        "Which major event occurred in 9 AH and is connected with the delegation year when numerous Arabian tribes came to the Prophet ﷺ?",
    options: [
        "The Year of Delegations",
        "The Year of the Elephant",
        "The Year of Sorrow",
        "The Year of Badr"
    ],
    answer: 0,
    explanation:
        "9 AH became known as the Year of Delegations because numerous delegations came to Madinah to meet the Prophet ﷺ."
},

{
    question:
        "Which event occurred in 10 AH and represented the Prophet's ﷺ final major pilgrimage?",
    options: [
        "The Farewell Hajj",
        "The First Pledge of Aqabah",
        "The Conquest of Makkah",
        "The Battle of Tabuk"
    ],
    answer: 0,
    explanation:
        "The Farewell Hajj took place in 10 AH and was the Prophet's ﷺ final pilgrimage."
},

{
    question:
        "Which companion was one of the prominent commanders at the Battle of Qadisiyyah during the early Islamic conquests?",
    options: [
        "Sa'd ibn Abi Waqqas",
        "Abu Hurayrah",
        "Ubayy ibn Ka'b",
        "Zayd ibn Thabit"
    ],
    answer: 0,
    explanation:
        "Sa'd ibn Abi Waqqas رضي الله عنه commanded the Muslim forces at the Battle of Qadisiyyah."
},

{
    question:
        "Which battle is traditionally associated with the decisive defeat of the Sasanian forces that opened the way for further Muslim expansion into Persia?",
    options: [
        "Qadisiyyah",
        "Yarmouk",
        "Mu'tah",
        "Hunayn"
    ],
    answer: 0,
    explanation:
        "The Battle of Qadisiyyah was a major victory against the Sasanian Empire and was followed by further Muslim expansion into Persian territories."
},

{
    question:
        "Which battle was a major confrontation between Muslim forces and the Byzantine Empire during the caliphate of Umar رضي الله عنه?",
    options: [
        "Yarmouk",
        "Badr",
        "Uhud",
        "Khaybar"
    ],
    answer: 0,
    explanation:
        "The Battle of Yarmouk was a major Muslim victory against Byzantine forces during Umar's caliphate."
},

{
    question:
        "Which companion was famous for his role as a military commander during the conquest of Syria and was known as the 'Sword of Allah'?",
    options: [
        "Khalid ibn al-Walid",
        "Abu Ubaydah ibn al-Jarrah",
        "Amr ibn al-As",
        "Sa'd ibn Abi Waqqas"
    ],
    answer: 0,
    explanation:
        "Khalid ibn al-Walid رضي الله عنه was a renowned military commander and was famously called Saifullah, the Sword of Allah."
},

{
    question:
        "Which companion was appointed as commander of the Muslim forces in Syria after Khalid ibn al-Walid رضي الله عنه was removed from overall command?",
    options: [
        "Abu Ubaydah ibn al-Jarrah",
        "Amr ibn al-As",
        "Sa'd ibn Abi Waqqas",
        "Zubayr ibn al-Awwam"
    ],
    answer: 0,
    explanation:
        "Abu Ubaydah ibn al-Jarrah رضي الله عنه became the overall commander of the Muslim forces in Syria."
},

{
    question:
        "Which early caliph established the formal Hijri calendar system during his rule?",
    options: [
        "Umar ibn al-Khattab",
        "Abu Bakr as-Siddiq",
        "Uthman ibn Affan",
        "Ali ibn Abi Talib"
    ],
    answer: 0,
    explanation:
        "Umar ibn al-Khattab رضي الله عنه established the formal Islamic calendar system, using the Hijrah as its starting reference."
},

{
    question:
        "Which companion was known for his knowledge of the Qur'an and was one of the principal teachers of Qur'anic recitation in Kufa?",
    options: [
        "Abdullah ibn Mas'ud",
        "Abu Sufyan",
        "Abu Ubaydah ibn al-Jarrah",
        "Sa'd ibn Mu'adh"
    ],
    answer: 0,
    explanation:
        "Abdullah ibn Mas'ud رضي الله عنه was a prominent companion in Qur'anic knowledge and teaching and had a major scholarly influence in Kufa."
},

{
    question:
        "Which of the following best describes the term 'isnad' in Hadith studies?",
    options: [
        "The chain of transmitters through whom a hadith was transmitted",
        "The wording of the hadith itself",
        "The legal ruling derived from a hadith",
        "The biography of the Prophet ﷺ"
    ],
    answer: 0,
    explanation:
        "Isnad refers to the chain of transmitters through whom a hadith has been transmitted."
},

{
    question:
        "In Hadith terminology, what does 'matn' primarily refer to?",
    options: [
        "The actual text or wording of the report",
        "The chain of narrators",
        "The narrator's birthplace",
        "The classification of Islamic law"
    ],
    answer: 0,
    explanation:
        "Matn refers to the actual wording or textual content of a hadith report."
},

{
    question:
        "Which classification generally describes a hadith whose chain is continuous and whose narrators meet the required standards of reliability and precision, while being free from serious defects?",
    options: [
        "Sahih",
        "Mawdu'",
        "Munkar",
        "Da'if"
    ],
    answer: 0,
    explanation:
        "Sahih describes an authentic hadith meeting the established conditions of soundness, including continuity, narrator reliability and precision, and freedom from serious defects."
},

{
    question:
        "Which field of Islamic scholarship specifically examines the circumstances, causes and historical contexts associated with Qur'anic revelation?",
    options: [
        "Asbab al-Nuzul",
        "Ilm al-Fara'id",
        "Ilm al-Kalam",
        "Ilm al-Mawarith"
    ],
    answer: 0,
    explanation:
        "Asbab al-Nuzul is the study of the circumstances and occasions associated with particular Qur'anic revelations."
},

{
    question:
        "Which term refers to the abrogation or replacement of an earlier legal ruling by a later revelation according to classical Qur'anic sciences?",
    options: [
        "Naskh",
        "Tajwid",
        "Isnad",
        "Ijazah"
    ],
    answer: 0,
    explanation:
        "Naskh refers to abrogation in the classical framework of Islamic legal and Qur'anic studies."
},

{
    question:
        "Which companion is especially associated with the famous narration describing the three levels of religion: Islam, Iman and Ihsan?",
    options: [
        "Umar ibn al-Khattab",
        "Abu Hurayrah",
        "Abdullah ibn Abbas",
        "Anas ibn Malik"
    ],
    answer: 0,
    explanation:
        "Umar ibn al-Khattab رضي الله عنه narrated the famous Hadith of Jibril, which describes Islam, Iman and Ihsan."
} 
    ]

};


/* =========================================================
   APPLICATION STATE
========================================================= */

const state = {

    stage: "foundation",

    questions: [],

    current: 0,

    score: 0,

    selectedAnswer: null,

    checked: false,

    answerOrder: [],

    sessionComplete: false

};


/* =========================================================
   STORAGE
========================================================= */

function defaultProgress() {

    return {

        foundation: {
            unlocked: true,
            completed: false,
            best: 0
        },

        advanced: {
            unlocked: false,
            completed: false,
            best: 0
        },

        expert: {
            unlocked: false,
            completed: false,
            best: 0
        }

    };

}


function loadProgress() {

    try {

        const saved =
            localStorage.getItem(CONFIG.storageKey);

        if (!saved) {
            return defaultProgress();
        }

        const parsed =
            JSON.parse(saved);

        const defaults =
            defaultProgress();

        return {

            foundation: {
                ...defaults.foundation,
                ...(parsed.foundation || {})
            },

            advanced: {
                ...defaults.advanced,
                ...(parsed.advanced || {})
            },

            expert: {
                ...defaults.expert,
                ...(parsed.expert || {})
            }

        };

    } catch (error) {

        console.warn(
            "Could not load quiz progress:",
            error
        );

        return defaultProgress();

    }

}


function saveProgress(progress) {

    localStorage.setItem(
        CONFIG.storageKey,
        JSON.stringify(progress)
    );

}


/* =========================================================
   HISTORY
========================================================= */

function loadHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CONFIG.historyKey
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveHistory(history) {

    localStorage.setItem(
        CONFIG.historyKey,
        JSON.stringify(history)
    );

}


/* =========================================================
   DOM
========================================================= */

const homeScreen =
    document.getElementById("homeScreen");

const questionScreen =
    document.getElementById("questionScreen");

const resultsScreen =
    document.getElementById("resultsScreen");

const foundationCard =
    document.getElementById("foundationCard");

const advancedCard =
    document.getElementById("advancedCard");

const expertCard =
    document.getElementById("expertCard");

const currentQuestion =
    document.getElementById("currentQuestion");

const totalQuestions =
    document.getElementById("totalQuestions");

const progressBar =
    document.getElementById("progressBar");

const progressPercent =
    document.getElementById("progressPercent");

const questionText =
    document.getElementById("questionText");

const answersContainer =
    document.getElementById("answersContainer");

const answerFeedback =
    document.getElementById("answerFeedback");

const feedbackIcon =
    document.getElementById("feedbackIcon");

const feedbackTitle =
    document.getElementById("feedbackTitle");

const feedbackText =
    document.getElementById("feedbackText");

const nextButton =
    document.getElementById("nextButton");

const liveScore =
    document.getElementById("liveScore");

const quizStageLabel =
    document.getElementById("quizStageLabel");

const quizStageTitle =
    document.getElementById("quizStageTitle");

const finalPercentage =
    document.getElementById("finalPercentage");

const correctAnswers =
    document.getElementById("correctAnswers");

const wrongAnswers =
    document.getElementById("wrongAnswers");

const resultStage =
    document.getElementById("resultStage");

const resultHeading =
    document.getElementById("resultHeading");

const resultMessage =
    document.getElementById("resultMessage");

const unlockResult =
    document.getElementById("unlockResult");

const lockedResult =
    document.getElementById("lockedResult");

const unlockTitle =
    document.getElementById("unlockTitle");

const unlockDescription =
    document.getElementById("unlockDescription");

const nextStageButton =
    document.getElementById("nextStageButton");

const retryButton =
    document.getElementById("retryButton");

const homeButton =
    document.getElementById("homeButton");

const backButton =
    document.getElementById("backButton");

const quitButton =
    document.getElementById("quitButton");

const historyButton =
    document.getElementById("historyButton");

const historyModal =
    document.getElementById("historyModal");

const closeHistory =
    document.getElementById("closeHistory");

const historyBackdrop =
    document.getElementById("historyBackdrop");

const historyList =
    document.getElementById("historyList");

const historyCompleted =
    document.getElementById("historyCompleted");

const historyBest =
    document.getElementById("historyBest");

const completedCount =
    document.getElementById("completedCount");

const bestScore =
    document.getElementById("bestScore");

const unlockedCount =
    document.getElementById("unlockedCount");

const toast =
    document.getElementById("toast");

const toastText =
    document.getElementById("toastText");


/* =========================================================
   PROGRESS
========================================================= */

let progress =
    loadProgress();


/* =========================================================
   SCREEN SWITCH
========================================================= */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(item => {

            item.classList.remove("active");

        });

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

}


/* =========================================================
   STAGE ACCESS
========================================================= */

function isStageUnlocked(stage) {

    return !!progress[stage]?.unlocked;

}


/* =========================================================
   STAGE CARDS
========================================================= */

function updateStageCards() {

    const cards = {
        foundation: foundationCard,
        advanced: advancedCard,
        expert: expertCard
    };

    Object.keys(cards).forEach(stage => {

        const card = cards[stage];

        if (!card) return;

        const unlocked =
            isStageUnlocked(stage);

        card.classList.toggle(
            "unlocked",
            unlocked
        );

        card.classList.toggle(
            "locked",
            !unlocked
        );


        const lock =
            card.querySelector(".stage-lock");

        const arrow =
            card.querySelector(".stage-arrow");


        if (lock) {

            lock.className =
                unlocked
                    ? "stage-lock fa-solid fa-lock-open"
                    : "stage-lock fa-solid fa-lock";

        }


        if (arrow) {

            arrow.className =
                unlocked
                    ? "fa-solid fa-chevron-right stage-arrow"
                    : "fa-solid fa-lock stage-arrow";

        }

    });


    completedCount.textContent =
        Object.values(progress)
            .filter(item => item.completed)
            .length;


    const scores =
        Object.values(progress)
            .map(item => item.best || 0);


    bestScore.textContent =
        `${Math.max(...scores)}%`;


    unlockedCount.textContent =
        Object.values(progress)
            .filter(item => item.unlocked)
            .length;

}


/* =========================================================
   STAGE CARD CLICK
========================================================= */

document
    .querySelectorAll(".stage-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const stage =
                    card.dataset.stage;

                if (!isStageUnlocked(stage)) {

                    showToast(
                        `Score ${CONFIG.requiredScore}% in the previous stage to unlock this stage.`
                    );

                    return;

                }

                openStage(stage);

            }
        );

    });


/* =========================================================
   OPEN STAGE
========================================================= */

function openStage(stage) {

    if (!isStageUnlocked(stage)) {

        showToast(
            "This stage is still locked."
        );

        return;

    }

    state.stage = stage;

    const bank =
        QUESTION_BANK[stage] || [];


    if (!bank.length) {

        showToast(
            "Questions for this stage are not available yet."
        );

        return;

    }


    state.questions =
        shuffle(bank)
            .slice(
                0,
                Math.min(
                    CONFIG.questionsPerStage,
                    bank.length
                )
            );


    state.current = 0;

    state.score = 0;

    state.selectedAnswer = null;

    state.checked = false;

    state.answerOrder = [];

    state.sessionComplete = false;


    quizStageLabel.textContent =
        stage.toUpperCase();


    quizStageTitle.textContent =
        STAGES[stage].name;


    liveScore.textContent = "0";


    totalQuestions.textContent =
        state.questions.length;


    showScreen(questionScreen);

    renderQuestion();

}


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

    const copy = [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            copy[i],
            copy[j]
        ] = [
            copy[j],
            copy[i]
        ];

    }

    return copy;

}


/* =========================================================
   RENDER QUESTION
========================================================= */

function renderQuestion() {

    const question =
        state.questions[state.current];


    if (!question) {

        finishQuiz();

        return;

    }


    state.selectedAnswer = null;

    state.checked = false;


    currentQuestion.textContent =
        state.current + 1;


    totalQuestions.textContent =
        state.questions.length;


    questionText.textContent =
        question.q;


    const percent =
        Math.round(
            (
                state.current /
                state.questions.length
            ) * 100
        );


    progressBar.style.width =
        `${percent}%`;


    progressPercent.textContent =
        `${percent}%`;


    answerFeedback.hidden = true;


    nextButton.disabled = true;


    nextButton.querySelector("span")
        .textContent =
        "Check Answer";


    answersContainer.innerHTML = "";


    /*
       Randomize answer order while
       keeping track of the original
       correct answer.
    */

    state.answerOrder =
        shuffle(
            question.a.map(
                (_, index) => index
            )
        );


    state.answerOrder.forEach(
        (originalIndex, displayIndex) => {

            const button =
                document.createElement("button");


            button.type = "button";

            button.className = "answer";

            button.dataset.index =
                originalIndex;


            const letter =
                String.fromCharCode(
                    65 + displayIndex
                );


            button.innerHTML = `

                <span class="answer-letter">
                    ${letter}
                </span>

                <span class="answer-text">
                    ${escapeHTML(
                        question.a[originalIndex]
                    )}
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    selectAnswer(
                        originalIndex
                    );

                }
            );


            answersContainer.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   SELECT ANSWER
========================================================= */

function selectAnswer(index) {

    if (state.checked) return;


    state.selectedAnswer =
        index;


    document
        .querySelectorAll(".answer")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    const selected =
        document.querySelector(
            `.answer[data-index="${index}"]`
        );


    if (selected) {

        selected.classList.add(
            "selected"
        );

    }


    nextButton.disabled = false;

}


/* =========================================================
   CHECK ANSWER
========================================================= */

function checkAnswer() {

    if (
        state.selectedAnswer === null
    ) return;


    if (state.checked) {

        nextQuestion();

        return;

    }


    const question =
        state.questions[state.current];


    state.checked = true;


    const isCorrect =
        state.selectedAnswer ===
        question.correct;


    const buttons =
        document.querySelectorAll(
            ".answer"
        );


    buttons.forEach(button => {

        const index =
            Number(
                button.dataset.index
            );


        if (
            index === question.correct
        ) {

            button.classList.add(
                "correct"
            );

        }


        if (
            index === state.selectedAnswer &&
            !isCorrect
        ) {

            button.classList.add(
                "wrong"
            );

        }


        button.disabled = true;

    });


    if (isCorrect) {

        state.score++;

        liveScore.textContent =
            state.score;

        feedbackIcon.innerHTML =
            `<i class="fa-solid fa-check"></i>`;

        feedbackTitle.textContent =
            "Correct";

        feedbackText.textContent =
            question.explanation;

        answerFeedback.style.background =
            "#edf7f2";

    } else {

        feedbackIcon.innerHTML =
            `<i class="fa-solid fa-xmark"></i>`;

        feedbackTitle.textContent =
            "Not quite";

        feedbackText.textContent =
            `The correct answer is: ${question.a[question.correct]}. ${question.explanation}`;

        answerFeedback.style.background =
            "#fff3f3";

    }


    answerFeedback.hidden = false;


    if (
        state.current >=
        state.questions.length - 1
    ) {

        nextButton.querySelector("span")
            .textContent =
            "See Results";

    } else {

        nextButton.querySelector("span")
            .textContent =
            "Next Question";

    }

}


/* =========================================================
   NEXT QUESTION
========================================================= */

function nextQuestion() {

    if (!state.checked) {

        checkAnswer();

        return;

    }


    state.current++;


    if (
        state.current >=
        state.questions.length
    ) {

        finishQuiz();

        return;

    }


    renderQuestion();

}


/* =========================================================
   FINISH QUIZ
========================================================= */

function finishQuiz() {

    state.sessionComplete = true;


    const total =
        state.questions.length;


    const percentage =
        total
            ? Math.round(
                (
                    state.score /
                    total
                ) * 100
            )
            : 0;


    const wrong =
        total - state.score;


    finalPercentage.textContent =
        `${percentage}%`;


    correctAnswers.textContent =
        state.score;


    wrongAnswers.textContent =
        wrong;


    resultStage.textContent =
        `${STAGES[state.stage].name.toUpperCase()} COMPLETE`;


    const passed =
        percentage >= CONFIG.requiredScore;


    processStageResult(
        state.stage,
        percentage,
        passed
    );


    showScreen(resultsScreen);

}


/* =========================================================
   PROCESS RESULT
========================================================= */

function processStageResult(
    stage,
    percentage,
    passed
) {

    const current =
        progress[stage];


    current.completed = true;


    if (
        percentage >
        current.best
    ) {

        current.best =
            percentage;

    }


    let unlockedNext = null;


    if (
        passed &&
        STAGES[stage].next
    ) {

        unlockedNext =
            STAGES[stage].next;


        progress[unlockedNext]
            .unlocked = true;

    }


    saveProgress(progress);


    addHistory(
        stage,
        percentage,
        passed
    );


    if (passed) {

        resultHeading.textContent =
            "Alhamdulillah!";


        if (unlockedNext) {

            unlockResult.hidden =
                false;

            lockedResult.hidden =
                true;


            unlockTitle.textContent =
                STAGES[unlockedNext].name;


            unlockDescription.textContent =
                `You scored ${percentage}%. The ${STAGES[unlockedNext].name} stage is now unlocked.`;


            nextStageButton.hidden =
                false;


            nextStageButton
                .querySelector("span")
                .textContent =
                `Enter ${STAGES[unlockedNext].name}`;

        } else {

            unlockResult.hidden =
                false;

            lockedResult.hidden =
                true;


            unlockTitle.textContent =
                "Expert Mastery";


            unlockDescription.textContent =
                "You have completed the highest stage of the Iqranix Islamic Knowledge Challenge.";


            nextStageButton.hidden =
                true;

        }


        resultMessage.textContent =
            `You achieved ${percentage}%, meeting the ${CONFIG.requiredScore}% requirement.`;

    } else {

        resultHeading.textContent =
            "Keep learning.";


        unlockResult.hidden =
            true;

        lockedResult.hidden =
            false;


        nextStageButton.hidden =
            true;


        resultMessage.textContent =
            `You scored ${percentage}%. You need ${CONFIG.requiredScore}% to unlock the next stage.`;

    }


    updateStageCards();

}


/* =========================================================
   HISTORY
========================================================= */

function addHistory(
    stage,
    percentage,
    passed
) {

    const history =
        loadHistory();


    history.unshift({

        stage,

        percentage,

        passed,

        date:
            new Date().toISOString()

    });


    /*
       Keep the most recent 50
       attempts.
    */

    saveHistory(
        history.slice(0, 50)
    );

}


/* =========================================================
   RENDER HISTORY
========================================================= */

function renderHistory() {

    const history =
        loadHistory();


    historyCompleted.textContent =
        history.length;


    const best =
        history.length
            ? Math.max(
                ...history.map(
                    item =>
                        item.percentage
                )
            )
            : 0;


    historyBest.textContent =
        `${best}%`;


    if (!history.length) {

        historyList.innerHTML = `

            <div style="
                text-align:center;
                padding:25px 5px;
                color:#7b8881;
                font-size:10px;
            ">

                No quiz attempts yet.

            </div>

        `;

        return;

    }


    historyList.innerHTML =
        history.map(item => {

            const date =
                new Date(
                    item.date
                ).toLocaleDateString();


            return `

                <div class="history-item">

                    <div>

                        <strong>
                            ${STAGES[item.stage].name}
                        </strong>

                        <span>
                            ${date}
                        </span>

                    </div>

                    <div class="history-score">

                        ${item.percentage}%

                    </div>

                </div>

            `;

        }).join("");

}


/* =========================================================
   HISTORY MODAL
========================================================= */

historyButton.addEventListener(
    "click",
    () => {

        renderHistory();

        historyModal.hidden = false;

    }
);


closeHistory.addEventListener(
    "click",
    () => {

        historyModal.hidden = true;

    }
);


historyBackdrop.addEventListener(
    "click",
    () => {

        historyModal.hidden = true;

    }
);


/* =========================================================
   NEXT STAGE
========================================================= */

nextStageButton.addEventListener(
    "click",
    () => {

        const next =
            STAGES[state.stage].next;


        if (
            next &&
            isStageUnlocked(next)
        ) {

            openStage(next);

        }

    }
);


/* =========================================================
   RETRY
========================================================= */

retryButton.addEventListener(
    "click",
    () => {

        openStage(
            state.stage
        );

    }
);


/* =========================================================
   HOME
========================================================= */

homeButton.addEventListener(
    "click",
    () => {

        updateStageCards();

        showScreen(homeScreen);

    }
);


backButton.addEventListener(
    "click",
    () => {

        showScreen(homeScreen);

    }
);


quitButton.addEventListener(
    "click",
    () => {

        const leave =
            confirm(
                "Leave this quiz? Your current attempt will not be saved."
            );


        if (leave) {

            showScreen(homeScreen);

        }

    }
);


/* =========================================================
   NEXT BUTTON
========================================================= */

nextButton.addEventListener(
    "click",
    () => {

        if (!state.checked) {

            checkAnswer();

        } else {

            nextQuestion();

        }

    }
);


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    toastText.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !questionScreen.classList.contains(
                "active"
            )
        ) return;


        if (
            ["1", "2", "3", "4"]
                .includes(event.key)
        ) {

            const position =
                Number(event.key) - 1;


            const button =
                document.querySelectorAll(
                    ".answer"
                )[position];


            if (button) {

                button.click();

            }

        }


        if (
            event.key === "Enter" &&
            !nextButton.disabled
        ) {

            nextButton.click();

        }

    }
);


/* =========================================================
   PREVENT ACCIDENTAL DOUBLE START
========================================================= */

window.addEventListener(
    "beforeunload",
    event => {

        if (
            state.sessionComplete ||
            !questionScreen.classList.contains(
                "active"
            )
        ) {

            return;

        }

        event.preventDefault();

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeQuiz() {

    updateStageCards();

}


/* =========================================================
   START
========================================================= */

initializeQuiz();