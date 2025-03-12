import React, { useEffect, useState, useCallback } from "react";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import { OLLAMA_COMMON_URLS } from "@/utils/constants";
import { CaretDown, CaretUp, Info } from "@phosphor-icons/react";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";
import { Tooltip } from "react-tooltip";
import DeepSeekModels from "@/components/LLMSelection/OllamaLLMOptions/ModelCard";

const SUPPORT_MODELS = [
  {
    category: "DeepSeek",
    models: [
      {
        id: "deepseek-r1:1.5b",
        name: "DeepSeek-R1:1.5B",
        size: "1.1GB",
        description:
          "DeepSeek's first-generation of reasoning models with comparable performance.",
      },
      {
        id: "deepseek-r1:7b",
        name: "DeepSeek-R1:7B",
        size: "4.9GB",
        description:
          "DeepSeek's first-generation of reasoning models with comparable performance and improved scalability.",
      },
      {
        id: "deepseek-r1:14b",
        name: "DeepSeek-R1:14B",
        size: "9.0GB",
        description:
          "DeepSeek's first-generation of reasoning models with enhanced capabilities for complex problem-solving.",
      },
    ],
  },
  {
    category: "Qwen",
    models: [
      {
        id: "qwen2.5:0.5b",
        name: "Qwen-2.5:0.5b",
        size: "0.7GB",
        description:
          "DeepSeek's first-generation of reasoning models with comparable performance.",
      },
      {
        id: "qwen2.5:1.5b",
        name: "Qwen-2.5:1.5b",
        size: "1.1GB",
        description:
          "DeepSeek's first-generation of reasoning models with comparable performance and improved scalability.",
      },
    ],
  },
];

const DEFAULT_CONF = {
  LLMProvider: "ollama",
  OllamaLLMModelPref: "",
  OllamaLLMTokenLimit: "4096",
  OllamaLLMBasePath: "http://127.0.0.1:11434",
  OllamaLLMPerformanceMode: "base",
  OllamaLLMKeepAliveSeconds: "300",
  OllamaLLMAuthToken: "",
};

export default function OllamaLLMOptions({ settings }) {
  const [tempSettings, setTempSettings] = useState(settings || {});
  const {
    autoDetecting,
    basePath,
    basePathValue,
    authToken,
    authTokenValue,
    showAdvancedControls,
    setShowAdvancedControls,
    handleAutoDetectClick,
  } = useProviderEndpointAutoDiscovery({
    provider: "ollama",
    initialBasePath: tempSettings?.OllamaLLMBasePath,
    initialAuthToken: tempSettings?.OllamaLLMAuthToken,
    ENDPOINTS: OLLAMA_COMMON_URLS,
  });
  const [performanceMode, setPerformanceMode] = useState(
    tempSettings?.OllamaLLMPerformanceMode || "base"
  );
  const [maxTokens, setMaxTokens] = useState(
    tempSettings?.OllamaLLMTokenLimit || 4096
  );
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState({});

  useState(() => {
    setTempSettings(settings);
  }, settings);

  const findCustomModels = useCallback(async () => {
    if (!basePath?.value) {
      setCustomModels([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { models } = await System.customModels(
        "ollama",
        authToken?.value,
        basePath?.value
      );
      setCustomModels(models || []);
    } catch (error) {
      console.error("Failed to fetch custom models:", error);
      setCustomModels([]);
    }
    setLoading(false);
  }, [basePath?.value]);

  useEffect(() => {
    findCustomModels();
  }, [findCustomModels]);

  const onDelete = async (modelName) => {
    await System.deleteModel(
      "ollama",
      modelName,
      authToken.value,
      basePath.value
    );
    await findCustomModels();
  };

  const onActivate = async (modelName) => {
    await System.updateSystem({
      ...DEFAULT_CONF,
      OllamaLLMModelPref: modelName,
    });
    const _settings = await System.keys();
    setTempSettings(_settings);
  };

  const onDownload = async (modelName) => {
    setDownloadInfo({
      modelName,
      percent: 0,
    });
    await System.downloadModel(
      "ollama",
      modelName,
      authToken.value,
      basePath.value,
      (data) => {
        const source = data?.sources?.[0];
        console.log(source);
        if (source.status.includes("pulling")) {
          source.status = "下载中";
          source.showPercent = true;
        } else if (source.status.includes("verifying")) {
          source.status = "校验中";
        } else if (source.status.includes("writing")) {
          source.status = "写入中";
        } else if (source.status.includes("success")) {
          source.status = "下载完成";
        } else {
          source.status = "--";
        }

        setDownloadInfo(source || {});
      }
    );
    setDownloadInfo({});
    await findCustomModels();
  };

  return (
    <div className="w-full flex flex-col gap-y-7">
      {/* <div className="w-full flex items-start gap-[36px] mt-1.5">
        <OllamaLLMModelSelection
          settings={settings}
          basePath={basePath.value}
          authToken={authToken.value}
        />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            Max Tokens
          </label>
          <input
            type="number"
            name="OllamaLLMTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="4096"
            defaultChecked="4096"
            min={1}
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            onScroll={(e) => e.target.blur()}
            required={true}
            autoComplete="off"
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Maximum number of tokens for context and response.
          </p>
        </div>
      </div>
      <div className="flex justify-start mt-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowAdvancedControls(!showAdvancedControls);
          }}
          className="border-none text-theme-text-primary hover:text-theme-text-secondary flex items-center text-sm"
        >
          {showAdvancedControls ? "Hide" : "Show"} advanced settings
          {showAdvancedControls ? (
            <CaretUp size={14} className="ml-1" />
          ) : (
            <CaretDown size={14} className="ml-1" />
          )}
        </button>
      </div>

      <div hidden={!showAdvancedControls}>
        <div className="flex flex-col">
          <div className="w-full flex items-start gap-4">
            <div className="flex flex-col w-60">
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm font-semibold">
                  Ollama Base URL
                </label>
                {loading ? (
                  <PreLoader size="6" />
                ) : (
                  <>
                    {!basePathValue.value && (
                      <button
                        onClick={handleAutoDetectClick}
                        className="bg-primary-button text-xs font-medium px-2 py-1 rounded-lg hover:bg-secondary hover:text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
                      >
                        Auto-Detect
                      </button>
                    )}
                  </>
                )}
              </div>
              <input
                type="url"
                name="OllamaLLMBasePath"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="http://127.0.0.1:11434"
                value={basePathValue.value}
                required={true}
                autoComplete="off"
                spellCheck={false}
                onChange={basePath.onChange}
                onBlur={basePath.onBlur}
              />
              <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
                Enter the URL where Ollama is running.
              </p>
            </div>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold mb-2 flex items-center">
                Performance Mode
                <Info
                  size={16}
                  className="ml-2 text-white"
                  data-tooltip-id="performance-mode-tooltip"
                />
              </label>
              <select
                name="OllamaLLMPerformanceMode"
                required={true}
                className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
                value={performanceMode}
                onChange={(e) => setPerformanceMode(e.target.value)}
              >
                <option value="base">Base (Default)</option>
                <option value="maximum">Maximum</option>
              </select>
              <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
                Choose the performance mode for the Ollama model.
              </p>
              <Tooltip
                id="performance-mode-tooltip"
                place="bottom"
                className="tooltip !text-xs max-w-xs"
              >
                <p className="text-red-500">
                  <strong>Note:</strong> Be careful with the Maximum mode. It
                  may increase resource usage significantly.
                </p>
                <br />
                <p>
                  <strong>Base:</strong> Ollama automatically limits the context
                  to 2048 tokens, keeping resources usage low while maintaining
                  good performance. Suitable for most users and models.
                </p>
                <br />
                <p>
                  <strong>Maximum:</strong> Uses the full context window (up to
                  Max Tokens). Will result in increased resource usage but
                  allows for larger context conversations. <br />
                  <br />
                  This is not recommended for most users.
                </p>
              </Tooltip>
            </div>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-2">
                Ollama Keep Alive
              </label>
              <select
                name="OllamaLLMKeepAliveSeconds"
                required={true}
                className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
                defaultValue={settings?.OllamaLLMKeepAliveSeconds ?? "300"}
              >
                <option value="0">No cache</option>
                <option value="300">5 minutes</option>
                <option value="3600">1 hour</option>
                <option value="-1">Forever</option>
              </select>
              <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
                Choose how long Ollama should keep your model in memory before
                unloading.
                <a
                  className="underline text-blue-300"
                  href="https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-keep-a-model-loaded-in-memory-or-make-it-unload-immediately"
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}
                  Learn more &rarr;
                </a>
              </p>
            </div>
          </div>
          <div className="w-full flex items-start gap-4">
            <div className="flex flex-col w-100">
              <label className="text-white text-sm font-semibold">
                Auth Token
              </label>
              <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
                Enter a <code>Bearer</code> Auth Token for interacting with your
                Ollama server.
                <br />
                Used <b>only</b> if running Ollama behind an authentication
                server.
              </p>
              <input
                type="password"
                name="OllamaLLMAuthToken"
                className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg outline-none block w-full p-2.5"
                placeholder="Ollama Auth Token"
                value={authTokenValue.value}
                onChange={authToken.onChange}
                onBlur={authToken.onBlur}
                required={false}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div> */}

      {SUPPORT_MODELS.map((category) => {
        return (
          <DeepSeekModels
            key={category.category}
            category={category}
            activate={tempSettings.OllamaLLMModelPref}
            availableModels={customModels.map((model) => model.name)}
            downloadInfo={downloadInfo}
            onDelete={onDelete}
            onActivate={onActivate}
            onDownload={onDownload}
          />
        );
      })}
    </div>
  );
}

function OllamaLLMModelSelection({
  settings,
  basePath = null,
  authToken = null,
}) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { models } = await System.customModels(
          "ollama",
          authToken,
          basePath
        );
        setCustomModels(models || []);
      } catch (error) {
        console.error("Failed to fetch custom models:", error);
        setCustomModels([]);
      }
      setLoading(false);
    }
    findCustomModels();
  }, [basePath, authToken]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-2">
          Ollama Model
        </label>
        <select
          name="OllamaLLMModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {basePath
              ? "--loading available models--"
              : "Enter Ollama URL first"}
          </option>
        </select>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          Select the Ollama model you want to use. Models will load after
          entering a valid Ollama URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-2">
        Ollama Model
      </label>
      <select
        name="OllamaLLMModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label="Your loaded models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings.OllamaLLMModelPref === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
      <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
        Choose the Ollama model you want to use for your conversations.
      </p>
    </div>
  );
}
