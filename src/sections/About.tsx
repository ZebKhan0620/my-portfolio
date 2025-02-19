import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import { CardHeader } from "@/components/CardHeader";
import StarIcon from "@/assets/icons/star.svg";
import BookImage from "@/assets/images/book-cover.png";
import Image from "next/image";
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaBook,
  FaPlane,
  FaGamepad,
  FaDumbbell,
  FaCar,
  FaMusic,
  FaHiking,
} from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiGithub,
} from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import { TechIcon } from "@/components/TechIcon";
import MapImage from "@/assets/images/map.png";
import SmileMemoji from "@/assets/images/memoji-smile.png";
import { ToolboxItems } from "@/components/ToolboxItem";

const Toolbox = [
  {
    name: "HTML5",
    iconType: <FaHtml5 />,
  },
  {
    name: "CSS3",
    iconType: <FaCss3 />,
  },
  {
    name: "JavaScript",
    iconType: <SiJavascript />,
  },
  {
    name: "Tailwind CSS",
    iconType: <SiTailwindcss />,
  },
  {
    name: "React",
    iconType: <FaReact />,
  },
  {
    name: "Next.js",
    iconType: <RiNextjsFill />,
  },
  {
    name: "TypeScript",
    iconType: <SiTypescript />,
  },
  {
    name: "Node.js",
    iconType: <FaNodeJs />,
  },
  {
    name: "Github",
    iconType: <SiGithub />,
  },
];

const Hobbies = [
  {
    name: "Reading",
    iconType: "📖",
    left: "0",
    top: "5%",
  },
  {
    name: "Traveling",
    iconType: "🗺️",
    left: "50%",
    top: "5%",
  },
  {
    name: "Gaming",
    iconType: "🎮",
    left: "5%",
    top: "32%",
  },
  {
    name: "Exercising",
    iconType: "🏋️",
    left: "25%",
    top: "50%",
  },
  {
    name: "Driving",
    iconType: "🚗",
    left: "65%",
    top: "35%",
  },
  {
    name: "Music",
    iconType: "🕺",
    left: "5% ",
    top: "65% ",
  },
  {
    name: "Hiking",
    iconType: "🥾",
    left: "45% ",
    top: "70% ",
  },
];

export const AboutSection = () => {
  return (
    <div className="py-20">
      <div className="container">
        <SectionHeader
          title="About Me"
          eyebrow="About Me"
          description="I'm a software engineer with a passion for building scalable and user-friendly web applications. I'm currently student as a Web Developer at HAL Tokyo and I'm looking for new opportunities to work on exciting projects."
        />
        <div className="mt-20 flex flex-col gap-8">
            {/* My Reads */}
            <div className="flex flex-col gap-8 md:grid md:grid-cols-5 md:gap-8">
              
              <Card className="h-[320px] overflow-hidden md:col-span-2">
                <CardHeader
                  title="My Reads"
                  description="Explore my favorite books and articles that inspire me and help me grow as a person."
                />
                <div className="w-40 mt-2 mx-auto sm:w-32 sm:mb-2">
                  <Image
                    src={BookImage}
                    alt="Book Cover"
                    priority
                  />
                </div>
              </Card>
              {/* My Toolbox */}
              <Card className="h-[320px] p-0 overflow-hidden md:col-span-3 gap-8">
                <CardHeader
                  title="My Toolbox"
                  description="Explore the tools and technologies I use to create my digital experiences."
                />
                <ToolboxItems items={Toolbox}/>
                <ToolboxItems items={Toolbox} className="mt-6" ItemsWrapperClassName="-translate-x-1/2" />
              </Card>
            </div>

          {/* Beyond the Code */}
          <Card className="h-[320px] p-0 flex flex-col overflow-hidden">
            <CardHeader
              title="My Hobbies"
              description="Explore my interests and hobbies beyond the code."
              className="px-6"
            />
            <div className="relative flex-1">
              {Hobbies.map((item) => (
                <div key={item.name} className="inline-flex items-center px-6 gap-2 bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full py-1.5 absolute" 
                style={{
                  left: item.left,
                  top: item.top,
                }}>
                  <span className="text-gray-950 font-medium">{item.name}</span>
                  <span>{item.iconType}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="h-[320px] p-[0px]">
            <Image src={MapImage} alt="Map" className="w-full h-full object-cover object-left-top rounded-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-20 bg-gradient-to-r from-emerald-300 to-sky-400 after:content-[''] after:absolute after:inset-0 after:outline after:outline-2 after:-outline-offset-2 after:rounded-full after:outline-gray-950/30">
              <Image src={SmileMemoji} alt="Smile Memoji" className="w-full h-full object-cover" />
            </div>
          </Card>
        </div>
      </div>
    </div>
);
};
