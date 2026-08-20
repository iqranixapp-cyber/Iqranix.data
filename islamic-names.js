"use strict";

/*
==================================================
 IQRANIX — ISLAMIC NAMES
 islamic-names.js
==================================================

 300 curated boys' names
 300 curated girls' names

 Data format:
 ["Name", "Meaning"]

 NOTE:
 "Islamic name" does not necessarily mean the name
 appears directly in the Qur'an. Names below are
 established Muslim/Arabic names with positive or
 traditionally accepted meanings.
==================================================
*/


/* =================================================
   BOYS — 300
================================================= */

const boysNames = [

    ["Bilal", "Moistening; fresh; name of a famous companion"],
    ["Mansur", "Victorious"],
    ["Abbas", "Lion; stern"],
    ["Abdullah", "Servant of Allah"],
    ["Abdurrahman", "Servant of the Most Merciful"],
    ["Abdulaziz", "Servant of the Almighty"],
    ["Abdulkarim", "Servant of the Generous"],
    ["Abdulmalik", "Servant of the King"],
    ["Abdulqadir", "Servant of the Powerful"],
    ["Abdulhadi", "Servant of the Guide"],
    ["Abdulwahid", "Servant of the One"],
    ["Abdulhakim", "Servant of the Wise"],
    ["Abdulmajid", "Servant of the Glorious"],
    ["Abdulbasit", "Servant of the One who expands"],
    ["Abdulghafur", "Servant of the Forgiving"],
    ["Abdulhamid", "Servant of the Praiseworthy"],
    ["Abduljalil", "Servant of the Majestic"],
    ["Abduljabbar", "Servant of the Compeller"],
    ["Abdulsalam", "Servant of the Peace"],
    ["Abdulazim", "Servant of the Magnificent"],

    ["Adam", "Name of the first human and a prophet"],
    ["Adil", "Just; fair"],
    ["Adnan", "Traditional Arabic name"],
    ["Ahmad", "Most praised"],
    ["Ahsan", "Best; excellent"],
    ["Alaa", "Excellence; nobility"],
    ["Ali", "Noble; exalted"],
    ["Amin", "Trustworthy"],
    ["Amir", "Prince; commander"],
    ["Anas", "Affection; companionship"],
    ["Anwar", "More radiant; luminous"],
    ["Aqil", "Intelligent; wise"],
    ["Arif", "Knowledgeable"],
    ["Arham", "Merciful; compassionate"],
    ["Asad", "Lion"],
    ["Ashraf", "Most honorable"],
    ["Asim", "Protector"],
    ["Atif", "Kind; compassionate"],
    ["Ayman", "Blessed; fortunate"],
    ["Azhar", "Bright; shining"],
    ["Aziz", "Powerful; beloved"],
    ["Badr", "Full moon"],
    ["Bashir", "Bearer of good news"],
    ["Basim", "Smiling"],
    ["Burhan", "Proof; evidence"],
    ["Dawud", "A prophet of Allah"],
    ["Daniyal", "Traditional prophetic name"],
    ["Eesa", "A prophet of Allah"],
    ["Fadil", "Virtuous"],
    ["Fahim", "Intelligent; understanding"],
    ["Faisal", "Decisive"],
    ["Farid", "Unique; precious"],
    ["Farhan", "Joyful; happy"],
    ["Faris", "Knight; horseman"],
    ["Fawaz", "Successful; victorious"],
    ["Furqan", "Criterion between truth and falsehood"],
    ["Habib", "Beloved"],
    ["Hadi", "Guide"],
    ["Hafiz", "Guardian; preserver"],
    ["Hakim", "Wise"],
    ["Hamdan", "One who praises"],
    ["Hamid", "Praiseworthy"],
    ["Hamza", "Strong; steadfast"],
    ["Haris", "Guardian; protector"],
    ["Hasan", "Good; handsome"],
    ["Hassan", "Very good; handsome"],
    ["Haydar", "Lion"],
    ["Hilal", "Crescent moon"],
    ["Hisham", "Generous"],
    ["Hud", "A prophet of Allah"],
    ["Ibrahim", "A prophet of Allah"],
    ["Idris", "A prophet of Allah"],
    ["Ihsan", "Excellence; kindness"],
    ["Ilyas", "A prophet of Allah"],
    ["Imad", "Support; pillar"],
    ["Imran", "Prosperity"],
    ["Iqbal", "Prosperity; good fortune"],
    ["Ismail", "A prophet of Allah"],
    ["Jabir", "One who comforts or mends"],
    ["Jafar", "Small river"],
    ["Jalal", "Majesty; glory"],
    ["Jamal", "Beauty"],
    ["Jameel", "Beautiful"],
    ["Jasim", "Strong"],
    ["Jawad", "Generous"],
    ["Jibril", "Angel Gabriel"],
    ["Kamal", "Perfection"],
    ["Kareem", "Generous; noble"],
    ["Khalid", "Everlasting"],
    ["Khalil", "Close friend"],
    ["Luqman", "Wise man mentioned in the Qur'an"],
    ["Mahdi", "Rightly guided"],
    ["Mahmoud", "Praiseworthy"],
    ["Majid", "Glorious; noble"],
    ["Malik", "King; owner"],
    ["Marwan", "Traditional Arabic name"],
    ["Masood", "Fortunate"],
    ["Mazin", "Traditional Arabic name"],
    ["Mikael", "Angel Michael"],
    ["Mishal", "Torch; light"],
    ["Muhammad", "Highly praised"],
    ["Musa", "A prophet of Allah"],
    ["Mustafa", "Chosen one"],
    ["Nabil", "Noble"],
    ["Nadeem", "Companion; friend"],
    ["Nadir", "Rare; precious"],
    ["Naeem", "Comfort; blessing"],
    ["Nasir", "Helper; supporter"],
    ["Nawfal", "Generous"],
    ["Nuh", "A prophet of Allah"],
    ["Omar", "Flourishing; long-lived"],
    ["Qasim", "One who distributes"],
    ["Rafi", "Exalted; noble"],
    ["Rafiq", "Companion; friend"],
    ["Rayyan", "Well-watered; associated with a gate of Paradise"],
    ["Ridwan", "Contentment"],
    ["Saad", "Happiness; good fortune"],
    ["Sabir", "Patient"],
    ["Sadiq", "Truthful"],
    ["Saeed", "Happy; fortunate"],
    ["Salih", "Righteous"],
    ["Salman", "Safe; peaceful"],
    ["Samir", "Companion"],
    ["Shakir", "Thankful"],
    ["Sharif", "Noble; honorable"],
    ["Siddiq", "Truthful"],
    ["Sulayman", "A prophet of Allah"],
    ["Taha", "Qur'anic name"],
    ["Talha", "Name of a companion"],
    ["Tariq", "Morning star; night visitor"],
    ["Umar", "Flourishing; long-lived"],
    ["Usama", "Lion"],
    ["Uthman", "Traditional Islamic name"],
    ["Waleed", "Newborn child"],
    ["Yahya", "A prophet of Allah"],
    ["Yasin", "Qur'anic name"],
    ["Yusuf", "A prophet of Allah"],
    ["Yunus", "A prophet of Allah"],
    ["Zakariya", "A prophet of Allah"],
    ["Zayd", "Growth; abundance"],
    ["Zain", "Beauty; grace"],
    ["Zakir", "One who remembers"],
    ["Zubair", "Name of a companion"],

    ["Aariz", "Respectable; intelligent"],
    ["Adeel", "Just; fair"],
    ["Aftab", "Sun"],
    ["Areeb", "Wise; intelligent"],
    ["Arsalan", "Lion"],
    ["Azaan", "Call to prayer"],
    ["Baraa", "Innocence; freedom from blame"],
    ["Danish", "Knowledge; wisdom"],
    ["Faizan", "Grace; generosity"],
    ["Hammad", "One who praises"],
    ["Haroon", "A prophet of Allah"],
    ["Irfan", "Knowledge; awareness"],
    ["Junaid", "Traditional Arabic name"],
    ["Kashif", "Discoverer"],
    ["Laith", "Lion"],
    ["Mahir", "Skilled; expert"],
    ["Mubashir", "Bearer of good news"],
    ["Mujtaba", "Chosen"],
    ["Munir", "Luminous; bright"],
    ["Noman", "Traditional Arabic name"],
    ["Rashid", "Rightly guided"],
    ["Rayan", "Well-watered"],
    ["Sultan", "Authority; ruler"],
    ["Tahir", "Pure"],
    ["Wasim", "Graceful; handsome"],
    ["Yasir", "Easy; prosperous"],
    ["Zahir", "Bright; apparent"],
    ["Zaki", "Pure; intelligent"],
    ["Zaman", "Time; age"],
    ["Zarar", "Brave; courageous"],
    ["Zeeshan", "Dignified; honorable"],

    ["Abid", "Worshipper"],
    ["Abrar", "Righteous"],
    ["Afzal", "Best; superior"],
    ["Akram", "Most generous"],
    ["Ammar", "Builder; long-lived"],
    ["Aqib", "Successor"],
    ["Arafat", "Place near Makkah"],
    ["Ayaz", "Traditional name"],
    ["Baha", "Splendor; beauty"],
    ["Dawood", "A prophet of Allah"],
    ["Ehsan", "Kindness; excellence"],
    ["Fateh", "Victory"],
    ["Fayyaz", "Very generous"],
    ["Ghalib", "Victorious"],
    ["Haseeb", "Respected; noble"],
    ["Ibad", "Worshippers"],
    ["Jalil", "Great; majestic"],
    ["Khalilullah", "Friend of Allah"],
    ["Mujahid", "One who strives"],
    ["Murtaza", "Chosen; approved"],
    ["Naseer", "Helper"],
    ["Rauf", "Kind; compassionate"],
    ["Rashad", "Guidance"],
    ["Sajid", "One who prostrates"],
    ["Shahzaib", "Honorable; dignified"],
    ["Taimur", "Strong; courageous"],
    ["Waqas", "Traditional Islamic name"],
    ["Yaqoob", "A prophet of Allah"],
    ["Zainul", "Beauty of"],
    ["Zulfiqar", "Traditional Islamic name"],

    ["Aabid", "Worshipper"],
    ["Aarif", "Knowledgeable"],
    ["Aasim", "Protector"],
    ["Aatif", "Kind; compassionate"],
    ["Aayan", "Time; era"],
    ["Aazim", "Determined; resolute"],
    ["Aban", "Clear; distinct"],
    ["Abdulbasit", "Servant of the One who expands"],
    ["Abdulhakeem", "Servant of the Wise"],
    ["Abduljaleel", "Servant of the Majestic"],
    ["Abdulmueez", "Servant of the Honorer"],
    ["Abdulnaseer", "Servant of the Helper"],
    ["Abdulrauf", "Servant of the Compassionate"],
    ["Abdussamad", "Servant of the Eternal"],
    ["Adib", "Cultured; refined"],
    ["Afaq", "Horizons"],
    ["Ahsaf", "Intelligent; wise"],
    ["Akif", "Devoted to worship"],
    ["Alim", "Knowledgeable"],
    ["Aman", "Safety; peace"],
    ["Anis", "Friendly companion"],
    ["Arifullah", "One knowledgeable about Allah"],
    ["Asif", "Strong; capable"],
    ["Azam", "Greatest; determined"],
    ["Badruddin", "Full moon of the faith"],
    ["Bahauddin", "Splendor of the faith"],
    ["Burhanuddin", "Proof of the faith"],
    ["Fakhruddin", "Pride of the faith"],
    ["Fakhr", "Honor; pride"],
    ["Farrukh", "Fortunate; auspicious"],
    ["Fazal", "Grace; favor"],
    ["Fazli", "Gracious"],
    ["Ghazi", "Warrior; victor"],
    ["Habibullah", "Beloved of Allah"],
    ["Hamidullah", "One who praises Allah"],
    ["Hanzala", "Traditional companion's name"],
    ["Hassanain", "Two Hasan-like ones"],
    ["Hujjat", "Proof; evidence"],
    ["Ibrahimullah", "Related to Ibrahim"],
    ["Ikram", "Honor; generosity"],
    ["Ilyas", "Prophet's name"],
    ["Imtiaz", "Distinction"],
    ["Intisar", "Victory"],
    ["Jalaluddin", "Majesty of the faith"],
    ["Jamaluddin", "Beauty of the faith"],
    ["Kamran", "Successful; fortunate"],
    ["Kausar", "Abundance"],
    ["Khair", "Goodness"],
    ["Khairuddin", "Goodness of the faith"],
    ["Majeed", "Glorious"],
    ["Mansoor", "Victorious"],
    ["Maqsood", "Desired; intended"],
    ["Mubarak", "Blessed"],
    ["Muhsin", "Beneficent; one who does good"],
    ["Muneer", "Luminous"],
    ["Najeeb", "Noble"],
    ["Najib", "Noble; distinguished"],
    ["Najm", "Star"],
    ["Naseem", "Gentle breeze"],
    ["Nizam", "Order; system"],
    ["Qudrat", "Power; ability"],
    ["Rashiduddin", "Right guidance of the faith"],
    ["Rizwan", "Contentment"],
    ["Salah", "Righteousness"],
    ["Salahuddin", "Righteousness of the faith"],
    ["Sami", "Elevated; sublime"],
    ["Sarmad", "Eternal"],
    ["Shahab", "Meteor; shooting star"],
    ["Shamsuddin", "Sun of the faith"],
    ["Shihab", "Flame; meteor"],
    ["Siraj", "Lamp; light"],
    ["Sirajuddin", "Lamp of the faith"],
    ["Tajuddin", "Crown of the faith"],
    ["Taqi", "God-conscious; pious"],
    ["Taqiyuddin", "Piety of the faith"],
    ["Ubayd", "Little servant"],
    ["Wali", "Friend; protector"],
    ["Waliullah", "Friend of Allah"],
    ["Zia", "Light; splendor"],
    ["Ziauddin", "Light of the faith"],

    ["Aftabuddin", "Sun of the faith"],
    ["Aminuddin", "Trustworthiness of the faith"],
    ["Azizullah", "Beloved servant of Allah"],
    ["Fadl", "Grace; bounty"],
    ["Fahd", "Leopard"],
    ["Farrukh", "Fortunate"],
    ["Furayj", "Relief; ease"],
    ["Hafeez", "Protector; preserver"],
    ["Hakeem", "Wise"],
    ["Hameed", "Praiseworthy"],
    ["Hisham", "Generous"],
    ["Israr", "Secret; mystery"],
    ["Jabran", "One who repairs"],
    ["Jalal", "Majesty"],
    ["Karam", "Generosity"],
    ["Khalaf", "Successor"],
    ["Mazin", "Cloud carrying rain"],
    ["Munawwar", "Illuminated"],
    ["Naseem", "Breeze"],
    ["Qadir", "Powerful; capable"],
    ["Qudamah", "Courage; bravery"],
    ["Rabi", "Spring"],
    ["Raghib", "Desirous; willing"],
    ["Rami", "Archer"],
    ["Rashad", "Right guidance"],
    ["Sabih", "Beautiful; radiant"],
    ["Sahib", "Companion; owner"],
    ["Safi", "Pure; sincere"],
    ["Safwan", "Pure; clear"],
    ["Sarmad", "Everlasting"],
    ["Shahryar", "King; ruler"],
    ["Shuja", "Brave"],
    ["Tahiruddin", "Purity of the faith"],
    ["Tariq", "Morning star"],
    ["Wajid", "Finder; one who achieves"],
    ["Waseem", "Handsome; graceful"],
    ["Yamin", "Blessed; right side"],
    ["Zahid", "Devout; ascetic"],
    ["Zakiruddin", "One who remembers the faith"],
    ["Zaynuddin", "Beauty of the faith"],
    ["Ziyad", "Growth; increase"]

];


/* =================================================
   GIRLS — 300
================================================= */

const girlsNames = [

    ["Fathia", "Victory; opening"],
    ["Shadia", "Singer; melodious"],
    ["Suad", "Happiness; good fortune"],
    ["Aaliyah", "Exalted; noble"],
    ["Aamina", "Trustworthy; safe"],
    ["Abeer", "Fragrance; perfume"],
    ["Aisha", "Living; prosperous"],
    ["Alia", "Noble; exalted"],
    ["Amal", "Hope"],
    ["Amani", "Wishes; aspirations"],
    ["Amira", "Princess; commander"],
    ["Anisa", "Friendly; affectionate companion"],
    ["Aqsa", "Farthest"],
    ["Arwa", "Graceful"],
    ["Asma", "Lofty; excellent"],
    ["Asiya", "Traditional Islamic name"],
    ["Atiya", "Gift"],
    ["Aya", "Sign; verse"],
    ["Ayah", "Sign; verse"],
    ["Aziza", "Beloved; precious"],
    ["Basma", "Smile"],
    ["Bushra", "Good news"],
    ["Dania", "Near; close"],
    ["Dua", "Supplication"],
    ["Eman", "Faith"],
    ["Fadila", "Virtuous"],
    ["Faiza", "Successful; victorious"],
    ["Fatima", "Traditional Islamic name"],
    ["Fiza", "Breeze; atmosphere"],
    ["Ghada", "Graceful young woman"],
    ["Hafsa", "Traditional Islamic name"],
    ["Hala", "Halo around the moon"],
    ["Halima", "Gentle; patient"],
    ["Hana", "Happiness; bliss"],
    ["Hanan", "Compassion; tenderness"],
    ["Haniya", "Happy; delighted"],
    ["Haya", "Modesty"],
    ["Hiba", "Gift"],
    ["Huda", "Guidance"],
    ["Ibtisam", "Smile"],
    ["Ilham", "Inspiration"],
    ["Iman", "Faith"],
    ["Inaya", "Care; protection"],
    ["Iqra", "Read; recite"],
    ["Isra", "Night journey"],
    ["Jannah", "Paradise; garden"],
    ["Jasmine", "Jasmine flower"],
    ["Javeria", "Traditional Islamic name"],
    ["Khadija", "Traditional Islamic name"],
    ["Khawla", "Gazelle"],
    ["Laila", "Night"],
    ["Lamia", "Radiant; beautiful"],
    ["Latifa", "Gentle; kind"],
    ["Lubna", "Fragrant tree"],
    ["Maha", "Beautiful eyes"],
    ["Mahira", "Skilled; talented"],
    ["Mariam", "Mary; pious woman"],
    ["Marwa", "Sacred hill in Makkah"],
    ["Maryam", "Mary; pious"],
    ["Maysa", "Graceful"],
    ["Munira", "Luminous; shining"],
    ["Nadia", "Tender"],
    ["Naila", "One who attains"],
    ["Najma", "Star"],
    ["Najwa", "Secret conversation"],
    ["Nawal", "Gift; blessing"],
    ["Noor", "Light"],
    ["Noura", "Light"],
    ["Qamar", "Moon"],
    ["Rabia", "Spring"],
    ["Rahma", "Mercy"],
    ["Rania", "Queenly"],
    ["Rasha", "Young gazelle"],
    ["Razia", "Content; satisfied"],
    ["Reem", "White gazelle"],
    ["Ruqayya", "Rise; ascent"],
    ["Saba", "Morning breeze"],
    ["Safa", "Purity; clarity"],
    ["Safiya", "Pure; chosen friend"],
    ["Sakina", "Peace; tranquility"],
    ["Salma", "Safe; peaceful"],
    ["Samia", "Elevated"],
    ["Sara", "Princess; noble woman"],
    ["Sarah", "Princess; noblewoman"],
    ["Sawsan", "Lily flower"],
    ["Shifa", "Healing"],
    ["Sidra", "Lote tree"],
    ["Sumaya", "Traditional Islamic name"],
    ["Sumayyah", "Traditional companion's name"],
    ["Tahira", "Pure"],
    ["Tasneem", "Spring in Paradise"],
    ["Wafa", "Loyalty; faithfulness"],
    ["Wardah", "Rose"],
    ["Yasmin", "Jasmine flower"],
    ["Yumna", "Blessed; fortunate"],
    ["Zahra", "Radiant; flower"],
    ["Zainab", "Traditional Islamic name"],
    ["Zakia", "Pure; intelligent"],
    ["Zara", "Princess; flower"],
    ["Zubaida", "Best part; excellent"],

    ["Aafiya", "Health; well-being"],
    ["Aarifa", "Knowledgeable"],
    ["Adila", "Just; fair"],
    ["Afifa", "Chaste; pure"],
    ["Afra", "White; fair"],
    ["Ahlam", "Dreams"],
    ["Almas", "Diamond"],
    ["Anam", "Blessing; gift"],
    ["Anaya", "Care; protection"],
    ["Anjum", "Stars"],
    ["Arisha", "High; noble"],
    ["Arshi", "Heavenly"],
    ["Ayesha", "Living; prosperous"],
    ["Azra", "Pure"],
    ["Baraa", "Innocence; purity"],
    ["Basmah", "Smile"],
    ["Dalia", "Vine; branch"],
    ["Daniah", "Near; close"],
    ["Elaf", "Familiarity; harmony"],
    ["Fariha", "Joyful; happy"],
    ["Farah", "Joy; happiness"],
    ["Fareeha", "Cheerful; joyful"],
    ["Gul", "Flower"],
    ["Hafiza", "Guardian"],
    ["Hoor", "Maiden of Paradise"],
    ["Hoorain", "Maidens of Paradise"],
    ["Iffat", "Chastity; purity"],
    ["Ilma", "Knowledge"],
    ["Iram", "Garden"],
    ["Jannat", "Paradise"],
    ["Kainat", "Universe"],
    ["Kanza", "Treasure"],
    ["Kashaf", "Revelation"],
    ["Kausar", "Abundance"],
    ["Kiran", "Ray of light"],
    ["Laiba", "Popular Muslim name"],
    ["Maham", "Greatness"],
    ["Mahnoor", "Moonlight"],
    ["Malaika", "Angels"],
    ["Maliha", "Beautiful; graceful"],
    ["Mehar", "Kindness; grace"],
    ["Minal", "Achievement"],
    ["Misbah", "Lamp; light"],
    ["Muneeba", "One who turns to Allah"],
    ["Nabeela", "Noble"],
    ["Nafeesa", "Precious; valuable"],
    ["Nashita", "Energetic; lively"],
    ["Nazia", "Pride; glory"],
    ["Nida", "Call; voice"],
    ["Nimra", "Pure; gentle"],
    ["Nisa", "Women"],
    ["Parisa", "Graceful"],
    ["Qudsia", "Holy; sacred"],
    ["Rafia", "Exalted; noble"],
    ["Raihana", "Sweet basil; fragrant flower"],
    ["Ramsha", "Beautiful bouquet"],
    ["Rida", "Contentment"],
    ["Rimsha", "Bouquet of flowers"],
    ["Roshni", "Light"],
    ["Sadia", "Fortunate; happy"],
    ["Saira", "Traveler"],
    ["Saliha", "Righteous; virtuous"],
    ["Samina", "Valuable; precious"],
    ["Sana", "Radiance; praise"],
    ["Sania", "Brilliant; radiant"],
    ["Seher", "Dawn"],
    ["Shahida", "Witness"],
    ["Shahira", "Famous; distinguished"],
    ["Shamsa", "Like the sun"],
    ["Shazia", "Fragrant; rare"],
    ["Sheza", "Virtuous; graceful"],
    ["Sobia", "Good; virtuous"],
    ["Suhana", "Pleasant; beautiful"],
    ["Tabassum", "Smile"],
    ["Tayyiba", "Good; pure"],
    ["Tehmina", "Strong; brave"],
    ["Uzma", "Greatest"],
    ["Warda", "Rose"],
    ["Yusra", "Ease; prosperity"],
    ["Zaira", "Visitor; pilgrim"],
    ["Zareen", "Golden"],
    ["Zoya", "Life; loving"],

    ["Bayan", "Clarity; eloquence"],
    ["Dima", "Gentle rain"],
    ["Haneen", "Longing; yearning"],
    ["Jumana", "Silver pearl"],
    ["Lujain", "Silver"],
    ["Misk", "Musk; fragrance"],
    ["Rahaf", "Delicate; gentle"],
    ["Rima", "White gazelle"],
    ["Sama", "Sky"],
    ["Samara", "Evening companion"],
    ["Shams", "Sun"],
    ["Tala", "Young palm tree"],
    ["Thuraya", "Star cluster"],
    ["Widad", "Love; affection"],
    ["Yara", "Beloved"],
    ["Zaina", "Beautiful; graceful"],
    ["Areej", "Fragrance"],
    ["Jouri", "Damask rose"],
    ["Lamis", "Soft to touch"],
    ["Layan", "Softness; gentleness"],
    ["Narmeen", "Gentle; soft"],
    ["Salsabil", "Spring in Paradise"],
    ["Shahd", "Honey"],
    ["Sundus", "Fine silk"],
    ["Taqwa", "God-consciousness; piety"],
    ["Urooj", "Rise; ascent"],
    ["Wajiha", "Distinguished; beautiful"],
    ["Zohra", "Bright; radiant"],
    ["Zulekha", "Traditional Islamic name"],
    ["Afnan", "Branches; growth"],
    ["Ayla", "Moonlight"],
    ["Durria", "Brilliant; pearl-like"],
    ["Fajr", "Dawn"],
    ["Husna", "Beautiful; excellent"],
    ["Jameela", "Beautiful"],
    ["Khadra", "Green"],
    ["Kubra", "Great; greatest"],
    ["Lina", "Tender; delicate"],
    ["Madiha", "Praiseworthy"],
    ["Maimuna", "Blessed; fortunate"],
    ["Muneera", "Luminous"],
    ["Nadira", "Rare; precious"],
    ["Naima", "Comfortable; tranquil"],
    ["Naseema", "Gentle breeze"],
    ["Nasreen", "Wild rose"],
    ["Rameen", "Peaceful"],
    ["Sabiha", "Beautiful; graceful"],
    ["Sahar", "Dawn"],
    ["Tasnim", "Spring in Paradise"],
    ["Zahira", "Bright; shining"],
    ["Zunaira", "Traditional Islamic name"],

    ["Aabida", "Worshipper"],
    ["Aadila", "Just; fair"],
    ["Aafira", "One who gives life or refreshes"],
    ["Aaliya", "Exalted; high"],
    ["Aarifah", "Knowledgeable"],
    ["Aasma", "Lofty; excellent"],
    ["Aatifa", "Kind; compassionate"],
    ["Abida", "Worshipper"],
    ["Adab", "Good manners; courtesy"],
    ["Afreen", "Praise; encouragement"],
    ["Afsana", "Story; tale"],
    ["Aiza", "Noble; respected"],
    ["Alina", "Noble; bright"],
    ["Alya", "High; exalted"],
    ["Amatullah", "Female servant of Allah"],
    ["Ameena", "Trustworthy; faithful"],
    ["Amna", "Safe; secure"],
    ["Anabia", "Traditional Muslim name"],
    ["Anila", "Gentle breeze"],
    ["Anisa", "Friendly; companionable"],
    ["Areeba", "Wise; intelligent"],
    ["Arfa", "Exalted; high"],
    ["Arifa", "Knowledgeable"],
    ["Asifa", "Strong; capable"],
    ["Asma", "Lofty; excellent"],
    ["Atifa", "Kind; compassionate"],
    ["Arooba", "Loving; affectionate"],
    ["Azra", "Pure"],
    ["Badia", "Unique; wonderful"],
    ["Badiya", "Unique; wonderful"],
    ["Bahar", "Spring"],
    ["Balqis", "Traditional name associated with the Queen of Sheba"],
    ["Barakah", "Blessing"],
    ["Batool", "Devout; chaste"],
    ["Benazir", "Incomparable"],
    ["Bushra", "Good news"],
    ["Dania", "Near; close"],
    ["Dareen", "Traditional Arabic name"],
    ["Dua", "Supplication"],
    ["Durrah", "Pearl"],
    ["Eiliyah", "Traditional Muslim name"],
    ["Eimaan", "Faith"],
    ["Eshal", "Traditional Muslim name"],
    ["Fadwa", "Self-sacrifice"],
    ["Faiha", "Fragrant"],
    ["Falak", "Sky; heaven"],
    ["Fariha", "Happy; joyful"],
    ["Fathima", "Traditional variant of Fatima"],
    ["Firdaws", "Paradise"],
    ["Firdaus", "Paradise"],
    ["Ghazala", "Gazelle"],
    ["Ghazal", "Poetry; love poem"],
    ["Habiba", "Beloved"],
    ["Hafiza", "Guardian; preserver"],
    ["Haleema", "Gentle; patient"],
    ["Hamida", "Praiseworthy"],
    ["Haseena", "Beautiful"],
    ["Hasina", "Beautiful"],
    ["Hawa", "Eve"],
    ["Hifza", "Protection"],
    ["Hooriya", "Heavenly maiden"],
    ["Humaira", "Reddish; rosy"],
    ["Iffah", "Chastity; purity"],
    ["Ihsana", "Kindness; excellence"],
    ["Ikram", "Honor; generosity"],
    ["Ilma", "Knowledge"],
    ["Inshirah", "Relief; joy"],
    ["Isra", "Night journey"],
    ["Jannatul", "Of Paradise"],
    ["Jumana", "Silver pearl"],
    ["Kalsoom", "Traditional Islamic name"],
    ["Kareema", "Generous; noble"],
    ["Khadra", "Green"],
    ["Khawla", "Gazelle"],
    ["Kubra", "Great; greatest"],
    ["Laila", "Night"],
    ["Lamia", "Radiant; beautiful"],
    ["Laraib", "Without doubt"],
    ["Mahira", "Skilled; talented"],
    ["Mahjabeen", "Moon-faced"],
    ["Mahmooda", "Praiseworthy"],
    ["Mahveen", "Moon-like"],
    ["Maimoona", "Blessed; fortunate"],
    ["Majida", "Glorious; noble"],
    ["Mariam", "Mary; pious woman"],
    ["Masooma", "Innocent; pure"],
    ["Mehwish", "Moon-like"],
    ["Mishal", "Torch; light"],
    ["Mubeena", "Clear; evident"],
    ["Mufida", "Useful; beneficial"],
    ["Mumtaz", "Distinguished"],
    ["Muneeba", "One who turns to Allah"],
    ["Munira", "Luminous"],
    ["Musarrat", "Happiness; joy"],
    ["Nabila", "Noble"],
    ["Nafeesa", "Precious"],
    ["Najat", "Salvation"],
    ["Najiba", "Noble; distinguished"],
    ["Najla", "Large-eyed; beautiful"],
    ["Nargis", "Narcissus flower"],
    ["Nasima", "Gentle breeze"],
    ["Nashita", "Energetic"],
    ["Nawal", "Gift"],
    ["Nazia", "Pride; glory"],
    ["Nour", "Light"],
    ["Nusaybah", "Traditional companion's name"],
    ["Qamar", "Moon"],
    ["Rabia", "Spring"],
    ["Rafiya", "Exalted"],
    ["Rahima", "Merciful; compassionate"],
    ["Raihana", "Fragrant flower"],
    ["Rania", "Queenly"],
    ["Rashida", "Rightly guided"],
    ["Razia", "Content; satisfied"],
    ["Ruqaiya", "Rise; ascent"],
    ["Sabah", "Morning"],
    ["Sabeena", "Morning"],
    ["Sabira", "Patient"],
    ["Sadaf", "Seashell"],
    ["Sadia", "Fortunate"],
    ["Safa", "Purity"],
    ["Safaa", "Purity; clarity"],
    ["Safiya", "Pure; chosen friend"],
    ["Sajida", "One who prostrates"],
    ["Salihah", "Righteous; virtuous"],
    ["Salma", "Peaceful; safe"],
    ["Sameera", "Companion"],
    ["Samira", "Companion"],
    ["Sana", "Radiance; praise"],
    ["Saniya", "Brilliant; radiant"],
    ["Sarah", "Princess; noblewoman"],
    ["Shakira", "Thankful"],
    ["Shamim", "Fragrance"],
    ["Sharmeen", "Modest; shy"],
    ["Shazia", "Fragrant; rare"],
    ["Shukria", "Thankfulness"],
    ["Siddiqah", "Truthful"],
    ["Suhaila", "Gentle; easy"],
    ["Sultana", "Queen; female ruler"],
    ["Tabassum", "Smile"],
    ["Tahira", "Pure"],
    ["Tazeen", "Adornment; beauty"],
    ["Tuba", "Blessedness; goodness"],
    ["Uzma", "Greatest"],
    ["Wahida", "Unique; one"],
    ["Warda", "Rose"],
    ["Yamina", "Blessed; right side"],
    ["Yasira", "Easy; prosperous"],
    ["Yumna", "Blessed; fortunate"],
    ["Zahida", "Devout; ascetic"],
    ["Zakiya", "Pure; intelligent"],
    ["Zarifa", "Witty; graceful"],
    ["Zeba", "Beautiful; adorned"],
    ["Zeenat", "Beauty; adornment"],
    ["Zohra", "Radiant; bright"],
    ["Zunaira", "Traditional Muslim name"]

];


/* =================================================
   ELEMENTS
================================================= */

const homePage = document.getElementById("homePage");
const namesPage = document.getElementById("namesPage");

const boysButton = document.getElementById("boysButton");
const girlsButton = document.getElementById("girlsButton");
const backButton = document.getElementById("backButton");

const collectionIcon = document.getElementById("collectionIcon");
const collectionType = document.getElementById("collectionType");
const collectionTitle = document.getElementById("collectionTitle");
const collectionCount = document.getElementById("collectionCount");

const searchInput = document.getElementById("searchInput");
const clearButton = document.getElementById("clearButton");

const namesList = document.getElementById("namesList");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");


/* =================================================
   CURRENT COLLECTION
================================================= */

let currentNames = [];


/* =================================================
   OPEN BOYS
================================================= */

function showBoys() {
    openCollection(
        boysNames,
        "♂",
        "BOYS",
        "Islamic Boys' Names"
    );
}


/* =================================================
   OPEN GIRLS
================================================= */

function showGirls() {
    openCollection(
        girlsNames,
        "♀",
        "GIRLS",
        "Islamic Girls' Names"
    );
}


/* =================================================
   OPEN COLLECTION
================================================= */

function openCollection(names, icon, type, title) {

    currentNames = names;

    collectionIcon.textContent = icon;
    collectionType.textContent = type;
    collectionTitle.textContent = title;
    collectionCount.textContent = names.length + " names";

    searchInput.value = "";
    clearButton.classList.add("hidden");

    homePage.classList.add("hidden");
    namesPage.classList.remove("hidden");

    renderNames(currentNames);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =================================================
   RENDER
================================================= */

function renderNames(names) {

    namesList.innerHTML = "";

    resultCount.textContent = names.length;

    if (names.length === 0) {

        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    names.forEach(function(item) {

        const row = document.createElement("div");

        row.className = "name-row";

        const name = document.createElement("div");

        name.className = "name-value";

        name.textContent = item[0];

        const meaning = document.createElement("div");

        meaning.className = "meaning-value";

        meaning.textContent = item[1];

        row.appendChild(name);
        row.appendChild(meaning);

        fragment.appendChild(row);
    });

    namesList.appendChild(fragment);
}


/* =================================================
   SEARCH
================================================= */

function performSearch() {

    const query = searchInput.value
        .trim()
        .toLowerCase();

    if (query === "") {

        clearButton.classList.add("hidden");

        renderNames(currentNames);

        return;
    }

    clearButton.classList.remove("hidden");

    const filtered = currentNames.filter(function(item) {

        return (
            item[0].toLowerCase().includes(query) ||
            item[1].toLowerCase().includes(query)
        );

    });

    renderNames(filtered);
}


/* =================================================
   CLEAR SEARCH
================================================= */

function clearSearch() {

    searchInput.value = "";

    clearButton.classList.add("hidden");

    renderNames(currentNames);

    searchInput.focus();
}


/* =================================================
   BACK
================================================= */

function goBack() {

    if (!namesPage.classList.contains("hidden")) {

        namesPage.classList.add("hidden");

        homePage.classList.remove("hidden");

        searchInput.value = "";

        clearButton.classList.add("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;
    }

    window.history.back();
}


/* =================================================
   EVENTS — SAFE
================================================= */

if (boysButton) {
    boysButton.addEventListener("click", showBoys);
}

if (girlsButton) {
    girlsButton.addEventListener("click", showGirls);
}

if (backButton) {
    backButton.addEventListener("click", goBack);
}

if (searchInput) {
    searchInput.addEventListener("input", performSearch);
}

if (clearButton) {
    clearButton.addEventListener("click", clearSearch);
}


/* =================================================
   INITIAL STATE
================================================= */

if (homePage) {
    homePage.classList.remove("hidden");
}

if (namesPage) {
    namesPage.classList.add("hidden");
}


/* =================================================
   DEBUG
================================================= */

console.log("IQRANIX Islamic Names loaded.");
console.log("Boys:", boysNames.length);
console.log("Girls:", girlsNames.length);