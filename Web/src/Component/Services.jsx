import { PenTool, Sparkles, BarChart, Send } from "lucide-react";

const services = [
  {
    title: "Content Creation",
    description: "Write and format posts effortlessly with our intuitive, distraction-free rich text editor.",
    icon: <PenTool size={32} className="text-red-500" />,
  },
  {
    title: "AI Assistance",
    description: "Overcome writer's block using our built-in AI tools for drafting and smart summaries.",
    icon: <Sparkles size={32} className="text-red-500" />,
  },
  {
    title: "Audience Insights",
    description: "Track your blog's performance and understand your readers with comprehensive analytics.",
    icon: <BarChart size={32} className="text-red-500" />,
  },
  {
    title: "Seamless Publishing",
    description: "Publish your thoughts instantly to the world, or save them securely as drafts.",
    icon: <Send size={32} className="text-red-500" />,
  },
];

const Services = () => {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-600 dark:text-red-400">
          Our Services
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          We provide powerful tools and support to make your posting experience fast, secure, and effective.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-left hover:shadow-xl transition"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
