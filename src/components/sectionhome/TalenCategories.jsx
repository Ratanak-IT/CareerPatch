
import React from "react";
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router";
import { useGetCategoriesQuery } from "../../services/categoriesApi";

const CATEGORY_IMAGES = {
  // ── Programming ───────────────────────────────────────────────────────────
  "python programming":   "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
  "python":               "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
  "javascript":           "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80",
  "typescript":           "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80",
  "java":                 "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80",
  "php":                  "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&w=600&q=80",
  "golang":               "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
  "rust":                 "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
  "c++":                  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "c#":                   "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  ".net":                 "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  "kotlin":               "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=600&q=80",
  "swift":                "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&w=600&q=80",
  "ruby":                 "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?auto=format&fit=crop&w=600&q=80",

  // ── Web & App Development ─────────────────────────────────────────────────
  "spring microservice":  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "software development": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
  "mobile app development":"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
  "web development":      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80",
  "game development":     "https://images.unsplash.com/photo-1556438064-2d7646166914?auto=format&fit=crop&w=600&q=80",
  "fullstack":            "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=600&q=80",
  "full stack":           "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=600&q=80",
  "frontend":             "https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&w=600&q=80",
  "backend":              "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "react native":         "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
  "flutter":              "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
  "android":              "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=600&q=80",
  "ios":                  "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&w=600&q=80",
  "development":          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
  "web":                  "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80",
  "mobile":               "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
  "app":                  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",

  // ── Cloud & DevOps ────────────────────────────────────────────────────────
  "kubernetes":           "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=600&q=80",
  "docker":               "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=600&q=80",
  "devops":               "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80",
  "cloud":                "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "aws":                  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "azure":                "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "server":               "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "database":             "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80",
  "sql":                  "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80",
  "linux":                "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80",
  "embedded":             "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "iot":                  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "blockchain":           "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
  "web3":                 "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
  "api":                  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",

  // ── Networking & Security ─────────────────────────────────────────────────
  "penetration testing":  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80",
  "ethical hacking":      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80",
  "cybersecurity":        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
  "networking":           "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=600&q=80",
  "infrastructure":       "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "sysadmin":             "https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?auto=format&fit=crop&w=600&q=80",
  "security":             "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
  "network":              "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=600&q=80",
  "cyber":                "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",

  // ── Data & AI ─────────────────────────────────────────────────────────────
  "artificial intelligence": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=600&q=80",
  "machine learning":     "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=600&q=80",
  "deep learning":        "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=600&q=80",
  "data science":         "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&w=600&q=80",
  "data analysis":        "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&w=600&q=80",
  "data engineering":     "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&w=600&q=80",
  "data":                 "https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&w=600&q=80",
  "science":              "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
  "nlp":                  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=600&q=80",
  "ai":                   "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=600&q=80",

  // ── Design & Creative ─────────────────────────────────────────────────────
  "graphic design":       "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&w=600&q=80",
  "ui/ux":                "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
  "illustration":         "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=600&q=80",
  "photography":          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
  "animation":            "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
  "branding":             "https://images.unsplash.com/photo-1493421419110-74f4e85ba126?auto=format&fit=crop&w=600&q=80",
  "interior":             "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
  "architecture":         "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=600&q=80",
  "fashion":              "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80",
  "design":               "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
  "creative":             "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
  "3d":                   "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=600&q=80",
  "motion":               "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
  "logo":                 "https://images.unsplash.com/photo-1493421419110-74f4e85ba126?auto=format&fit=crop&w=600&q=80",
  "print":                "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&w=600&q=80",
  "photo":                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
  "graphic":              "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&w=600&q=80",
  "ui":                   "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
  "ux":                   "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",

  // ── Video & Audio ─────────────────────────────────────────────────────────
  "video editing":        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
  "voice over":           "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
  "podcast":              "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
  "streaming":            "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=600&q=80",
  "youtube":              "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=600&q=80",
  "film":                 "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
  "video":                "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
  "music":                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
  "audio":                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
  "sound":                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",

  // ── Marketing & Business ──────────────────────────────────────────────────
  "digital marketing":    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  "email marketing":      "https://images.unsplash.com/photo-1563986768494-4fea5f50e8f8?auto=format&fit=crop&w=600&q=80",
  "social media":         "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80",
  "content creation":     "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
  "project management":   "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
  "product management":   "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
  "human resources":      "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80",
  "ecommerce":            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
  "accounting":           "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
  "consulting":           "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80",
  "advertising":          "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=600&q=80",
  "marketing":            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  "finance":              "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
  "business":             "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
  "startup":              "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
  "legal":                "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
  "sales":                "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
  "content":              "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
  "seo":                  "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80",
  "hr":                   "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80",

  // ── Writing & Translation ─────────────────────────────────────────────────
  "technical writing":    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
  "copywriting":          "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
  "translation":          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80",
  "proofreading":         "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
  "writing":              "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
  "blog":                 "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
  "resume":               "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",

  // ── Education ─────────────────────────────────────────────────────────────
  "online course":        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80",
  "education":            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  "teaching":             "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  "tutoring":             "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  "coaching":             "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80",
  "training":             "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80",

  // ── Engineering & Other ───────────────────────────────────────────────────
  "engineering":          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
  "mechanical":           "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
  "electrical":           "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "construction":         "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  "civil":                "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=600&q=80",
  "customer support":     "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
  "customer service":     "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
  "virtual assistant":    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
  "data entry":           "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80",
  "research":             "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
  "health":               "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
  "fitness":              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",

  // ── Default ───────────────────────────────────────────────────────────────
  "default":              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
};

const CATEGORY_ENTRIES = Object.entries(CATEGORY_IMAGES)
  .filter(([k]) => k !== "default")
  .sort((a, b) => b[0].length - a[0].length);

function getImageForCategory(name = "") {
  const lower = name.toLowerCase().trim();

  if (CATEGORY_IMAGES[lower]) return CATEGORY_IMAGES[lower];

  const match = CATEGORY_ENTRIES.find(([keyword]) => lower.includes(keyword));

  return match ? match[1] : CATEGORY_IMAGES.default;
}

function useDarkMode() {
  const [dark, setDark] = React.useState(
    () => document.documentElement.classList.contains("dark")
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

function CategoryCard({ name, count, image, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative group overflow-hidden cursor-pointer shadow-xl mx-2.5 flex-shrink-0
                 hover:-translate-y-1 transition-transform duration-300 rounded-[20px]"
      style={{ width: 280, height: 200 }}
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-start text-white"
           style={{ fontFamily: "'Poppins', sans-serif" }}>
        {count != null && (
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] opacity-90">
            {count} Services
          </span>
        )}
        <h3 className="text-lg font-bold mt-1 leading-tight">{name}</h3>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-[2.5rem] mx-2.5 flex-shrink-0 bg-gray-200 dark:bg-slate-700 animate-pulse"
      style={{ width: 280, height: 200 }}
    />
  );
}

export default function TalenCategories() {
  const navigate = useNavigate();
  const isDark   = useDarkMode();

  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  const gradientColor = isDark ? [13, 27, 46] : [255, 255, 255];

  const handleClick = (categoryName) => {

    navigate(`/findfreelan?category=${encodeURIComponent(categoryName)}`);
  };

  const displayItems = isLoading
    ? Array.from({ length: 8 }).map((_, i) => ({ id: `sk-${i}`, skeleton: true }))
    : categories.map((cat) => ({
        id:    cat.id,
        name:  cat.name,
        count: cat.serviceCount ?? cat.count ?? null,
        image: getImageForCategory(cat.name),
      }));

  return (
    <section
      className="w-full py-16 overflow-hidden
                 bg-white
                 dark:bg-[linear-gradient(160deg,#0d1b2e_0%,#0f2240_50%,#0d1520_100%)]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Heading */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[120px] mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E88E5]">
          Browse talent by categories
        </h2>
        <p className="mt-2 text-sm text-gray-400 dark:text-slate-400">
          Browse top categories and find the right talent for your project.
        </p>
      </div>

      {/* Marquee */}
      <Marquee
        speed={50}
        pauseOnHover
        gradient
        gradientColor={gradientColor}
        gradientWidth={96}
      >
        {displayItems.map((item, i) =>
          item.skeleton ? (
            <SkeletonCard key={item.id} />
          ) : (
            <CategoryCard
              key={item.id}
              name={item.name}
              count={item.count}
              image={item.image}
              onClick={() => handleClick(item.name)}
            />
          )
        )}
      </Marquee>
    </section>
  );
}