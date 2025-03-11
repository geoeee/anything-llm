import { useState } from "react";

const models = [
  {
    id: 1,
    name: "DeepSeek R1 1.5B",
    size: "1.1GB",
    active: true,
    description:
      "DeepSeek's first-generation of reasoning models with comparable performance.",
  },
  {
    id: 2,
    name: "DeepSeek R1 8B",
    size: "4.9GB",
    active: false,
    description:
      "DeepSeek's first-generation of reasoning models with comparable performance and improved scalability.",
  },
  {
    id: 3,
    name: "DeepSeek R1 14B",
    size: "9.0GB",
    active: false,
    description:
      "DeepSeek's first-generation of reasoning models with enhanced capabilities for complex problem-solving.",
  },
];

export default function DeepSeekModels() {
  const [activeModel, setActiveModel] = useState(models.find((m) => m.active));
  const [hoveredModel, setHoveredModel] = useState(null);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">DeepSeek</h2>
      <div className="flex flex-wrap gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            className={`border rounded-xl p-4 min-w-[320px] w-60 shadow-sm transition-all ${
              model.active ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <h3 className="text-lg font-medium cursor-pointer">
                  {model.name}
                </h3>
                <span className="text-gray-500 text-sm ml-1">{model.size}</span>
              </div>
              {model.active && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  Active
                </span>
              )}
            </div>
            <div className="relative mt-2 text-gray-500 text-sm">
              <p className="line-clamp-2 overflow-hidden inline">
                {model.description.length > 70
                  ? model.description.slice(0, 65) + "..."
                  : model.description}
              </p>
              {model.description.length > 70 && (
                <span
                  className="text-blue-500 text-sm cursor-pointer hover:underline inline"
                  onMouseEnter={() => setHoveredModel(model.id)}
                  onMouseLeave={() => setHoveredModel(null)}
                >
                  Read more
                </span>
              )}
              {hoveredModel === model.id && (
                <div className="absolute z-10 p-2 bg-white text-white text-xs rounded shadow-md w-56 mt-1">
                  {model.description}
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <label className="text-blue-500 border border-blue-500 px-3 py-1 rounded-full text-xs">
                Text only
              </label>
              <label className="text-xs cursor-pointer">Uninstall</label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
