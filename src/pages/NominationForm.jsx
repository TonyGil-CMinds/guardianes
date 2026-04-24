import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2, Search, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const COUNTRY_OPTIONS = [
  { value: "México", code: "mx" },
  { value: "Chile", code: "cl" },
  { value: "Colombia", code: "co" },
  { value: "Argentina", code: "ar" },
  { value: "Brasil", code: "br" },
  { value: "Perú", code: "pe" },
  { value: "Ecuador", code: "ec" },
  { value: "Bolivia", code: "bo" },
  { value: "Guatemala", code: "gt" },
  { value: "Uruguay", code: "uy" },
];

const FOCUS_OPTIONS = [
  { value: "Restauración ecológica" },
  { value: "Conservación comunitaria" },
  { value: "Educación ambiental" },
  { value: "Defensa territorial" },
  { value: "Innovación climática" },
];

const BIOREGION_OPTIONS = [
  { value: "Selva Maya" },
  { value: "Amazonía" },
  { value: "Patagonia" },
  { value: "Cerrado" },
  { value: "Bosque nublado" },
];

const SEARCH_ENDPOINT = "https://r.jina.ai/http://https://duckduckgo.com/html/?q=";

const SCREENS = [
  {
    id: "name",
    field: "name",
    title: "¿A quién deseas nominar?",
    placeholder: "Nombre completo",
    fieldType: "text",
  },
  {
    id: "email",
    field: "email",
    title: "¿Cuál es su correo\nelectrónico?",
    placeholder: "nombre@correo.com",
    fieldType: "email",
  },
  {
    id: "country",
    field: "country",
    title: "País de origen",
    placeholder: "Busca un país",
    fieldType: "country-search",
  },
  {
    id: "linkedin",
    field: "linkedin",
    eyebrow: "Este campo es opcional.",
    title: "¿Cuál es su perfil de LinkedIn?",
    placeholder: "https://linkedin.com/",
    fieldType: "url",
    optional: true,
  },
  {
    id: "description",
    field: "description",
    eyebrow: "Creamos un borrador editable con IA a partir de referencias públicas.",
    title: "Escribe una breve\ndescripción",
    placeholder: "Describe brevemente su trayectoria, impacto o enfoque.",
    fieldType: "textarea",
  },
  {
    id: "organization",
    field: "organization",
    title: "¿Qué organización lidera?",
    placeholder: "Escribe el nombre de la organización",
    fieldType: "text",
  },
  {
    id: "focus",
    field: "focus",
    eyebrow: "¡Ya casi terminamos!",
    title: "¿Cuál es el Enfoque de la\nOrganización?",
    placeholder: "Elige una opción",
    fieldType: "select",
    options: FOCUS_OPTIONS,
  },
  {
    id: "bioregion",
    field: "bioregion",
    eyebrow: "Este campo es de suma importancia",
    title: "¿Cuál es la Biorregión en la\nque incide su organización?",
    placeholder: "Elige una opción",
    fieldType: "select",
    options: BIOREGION_OPTIONS,
  },
  {
    id: "submit",
    title: "Enviaremos un correo al\nGuardián que has nominado",
    eyebrow: "¡Ya está todo listo!",
    fieldType: "submit",
  },
];

const QUESTION_STEPS = SCREENS.filter((screen) => screen.fieldType !== "submit");
const TOTAL_STEPS = QUESTION_STEPS.length;

function extractLinkedInHandle(linkedinUrl) {
  if (!linkedinUrl) return "";
  try {
    const url = new URL(linkedinUrl);
    return (
      url.pathname
        .split("/")
        .filter(Boolean)
        .pop()
        ?.replace(/[-_]/g, " ")
        .trim() || ""
    );
  } catch {
    return "";
  }
}

function cleanSearchSnippet(text) {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSearchSnippets(markdown) {
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const snippets = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith("## [")) continue;

    const title = cleanSearchSnippet(line.replace(/^## \[(.*?)\]\(.*$/, "$1"));
    const detailLines = [];

    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const nextLine = lines[cursor];
      if (nextLine.startsWith("## [")) break;
      if (nextLine.startsWith("[")) continue;
      if (nextLine.startsWith("![")) continue;
      if (nextLine === "Feedback") continue;
      detailLines.push(nextLine);
    }

    const detail = cleanSearchSnippet(detailLines.join(" "));
    const merged = cleanSearchSnippet(`${title}. ${detail}`);

    if (
      merged.length > 40 &&
      !/1000\+|Sign Up \| LinkedIn|Join LinkedIn|professional community/i.test(merged)
    ) {
      snippets.push(merged);
    }
  }

  return snippets.slice(0, 3);
}

async function fetchGeneratedDescription(name, linkedinUrl) {
  const linkedInHandle = extractLinkedInHandle(linkedinUrl);
  const query = [name, linkedInHandle, "LinkedIn"].filter(Boolean).join(" ");
  const response = await fetch(`${SEARCH_ENDPOINT}${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error("No se pudo consultar la web");
  }

  const markdown = await response.text();
  const snippets = extractSearchSnippets(markdown);

  if (snippets.length === 0) {
    return {
      draft: `${name} ha sido nominado/a por su trayectoria y potencial de impacto. Este es un borrador inicial para describir brevemente su experiencia, enfoque y contribución. Puedes editarlo libremente antes de enviarlo.`,
      sources: 0,
      query,
    };
  }

  const [firstSnippet, secondSnippet] = snippets;
  const draft = [
    `Según referencias públicas encontradas en la web, ${name} aparece asociado/a a ${firstSnippet}.`,
    secondSnippet ? `Además, también se menciona ${secondSnippet}.` : "",
    "Este texto es un borrador generado automáticamente y puede editarse antes de enviar la nominación.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    draft,
    sources: snippets.length,
    query,
  };
}

function SelectorSheet({ title, options, value, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-black">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d1d1d] text-[#c8ff1a] transition-transform hover:scale-105"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect(option.value);
                  onClose();
                }}
                className={`flex w-full items-center justify-center gap-3 rounded-[1.35rem] border px-6 py-5 text-center text-lg font-bold transition-all ${
                  active
                    ? "border-[#c8ff1a] bg-[#f7ffd8] text-black"
                    : "border-black/10 bg-[#f4f4f4] text-black hover:border-black/20"
                }`}
              >
                <span>{option.value}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CountrySearchField({ value, options, onChange, placeholder }) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filteredOptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return options
      .filter((option) => option.value.toLowerCase().includes(trimmed))
      .slice(0, 2);
  }, [options, query]);

  const hasExactMatch = options.some(
    (option) => option.value.toLowerCase() === query.trim().toLowerCase()
  );

  return (
    <div className="w-full max-w-[30rem]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-black/35" />
        <input
          type="text"
          value={query}
          onChange={(event) => {
            const nextValue = event.target.value;
            setQuery(nextValue);
            onChange(nextValue);
          }}
          placeholder={placeholder}
          className="min-h-[5.2rem] w-full rounded-[1.5rem] border border-black/10 bg-[#f4f4f4] px-8 pl-14 text-center text-xl font-bold text-black shadow-[0_10px_30px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#8e8e8e] focus:border-black/20"
        />
      </div>

      {query.trim() && !hasExactMatch && filteredOptions.length > 0 && (
        <div className="mt-3 space-y-2">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setQuery(option.value);
                onChange(option.value);
              }}
              className="flex w-full items-center gap-3 rounded-[1.2rem] border border-black/10 bg-white px-4 py-3 text-left text-base font-semibold text-black shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#f7ffd8]"
            >
              <img
                src={`https://flagcdn.com/w40/${option.code}.png`}
                alt={`Bandera de ${option.value}`}
                className="h-5 w-8 rounded-[0.2rem] object-cover shadow-sm"
              />
              <span>{option.value}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Progress({ step }) {
  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
          <span
            key={index}
            className={`h-3 w-11 rounded-full ${
              index < step ? "bg-[#c8ff1a]" : "bg-[#d8d8d8]"
            }`}
          />
        ))}
      </div>
      <p className="text-lg font-semibold text-[#7c7c7c]">
        Paso {step} de {TOTAL_STEPS}
      </p>
    </div>
  );
}

export default function NominationForm() {
  const navigate = useNavigate();
  const autoDescriptionTriggered = useRef(false);

  const [screenIndex, setScreenIndex] = useState(0);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [descriptionSearchInfo, setDescriptionSearchInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    linkedin: "",
    description: "",
    organization: "",
    focus: "",
    bioregion: "",
  });

  const screen = SCREENS[screenIndex];
  const progressStep =
    screen.fieldType === "submit"
      ? TOTAL_STEPS
      : QUESTION_STEPS.findIndex((item) => item.id === screen.id) + 1;

  const currentValue = useMemo(() => {
    if (!screen.field) return "";
    return formData[screen.field] ?? "";
  }, [formData, screen.field]);

  const isCurrentStepValid = useMemo(() => {
    if (screen.fieldType === "submit") return true;
    if (screen.optional) return true;

    if (screen.fieldType === "email") {
      return /\S+@\S+\.\S+/.test(formData.email);
    }

    if (screen.fieldType === "country-search") {
      return COUNTRY_OPTIONS.some(
        (option) =>
          option.value.toLowerCase() === String(formData.country).trim().toLowerCase()
      );
    }

    if (screen.fieldType === "url") {
      return true;
    }

    return String(currentValue).trim().length > 0;
  }, [currentValue, formData.country, formData.email, screen.fieldType, screen.optional]);

  const canAdvance = screen.fieldType === "submit" ? true : isCurrentStepValid;

  const updateValue = (value) => {
    if (!screen.field) return;
    setFormData((prev) => ({ ...prev, [screen.field]: value }));
  };

  const generateDescription = async () => {
    if (!formData.name.trim()) {
      toast.error("Necesitamos el nombre para generar la descripción");
      return;
    }

    try {
      setIsGeneratingDescription(true);
      const result = await fetchGeneratedDescription(
        formData.name.trim(),
        formData.linkedin.trim()
      );
      setFormData((prev) => ({ ...prev, description: result.draft }));
      setDescriptionSearchInfo(result);
      toast.success("Borrador generado");
    } catch (error) {
      console.error(error);
      setDescriptionSearchInfo(null);
      toast.error("No pudimos generar el borrador con la web");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  useEffect(() => {
    if (screen.id !== "description") return;
    if (autoDescriptionTriggered.current) return;
    autoDescriptionTriggered.current = true;

    if (!formData.description.trim()) {
      generateDescription();
    }
  }, [screen.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = () => {
    if (!canAdvance) return;

    if (screen.fieldType === "submit") {
      toast.success("Nominación enviada");
      navigate("/visor");
      return;
    }

    setScreenIndex((prev) => Math.min(prev + 1, SCREENS.length - 1));
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      screen.fieldType !== "select" &&
      screen.fieldType !== "textarea"
    ) {
      goNext();
    }
  };

  const renderField = () => {
    if (screen.fieldType === "submit") {
      return (
        <button
          type="button"
          onClick={goNext}
          className="min-w-[16rem] rounded-[1.6rem] border border-black/10 bg-[#f4f4f4] px-10 py-6 text-xl font-bold text-black shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-transform hover:scale-[1.01]"
        >
          Enviar nominación
        </button>
      );
    }

    if (screen.fieldType === "country-search") {
      return (
        <CountrySearchField
          value={currentValue}
          options={COUNTRY_OPTIONS}
          onChange={updateValue}
          placeholder={screen.placeholder}
        />
      );
    }

    if (screen.fieldType === "textarea") {
      return (
        <div className="w-full max-w-[36rem]">
          <div className="rounded-[2rem] border border-black/10 bg-[#f4f4f4] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <textarea
              value={currentValue}
              onChange={(event) => updateValue(event.target.value)}
              placeholder={screen.placeholder}
              className="min-h-[12rem] w-full resize-none rounded-[1.4rem] bg-transparent px-5 py-5 text-left text-lg font-semibold text-black outline-none placeholder:text-[#8e8e8e]"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={generateDescription}
              disabled={isGeneratingDescription}
              className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-black bg-white px-5 py-3 text-sm font-bold text-black transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGeneratingDescription ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGeneratingDescription ? "Buscando y redactando..." : "Generar borrador con IA"}
            </button>

            <p className="text-sm font-medium text-[#7c7c7c]">
              Usamos el nombre y el LinkedIn para buscar referencias públicas.
            </p>
          </div>

          {descriptionSearchInfo && (
            <p className="mt-3 text-left text-sm font-medium text-[#7c7c7c]">
              Borrador generado con {descriptionSearchInfo.sources || 1} referencia(s) web para{" "}
              <span className="font-semibold text-black">{descriptionSearchInfo.query}</span>.
            </p>
          )}
        </div>
      );
    }

    if (screen.fieldType === "select") {
      const selectedOption = screen.options.find((option) => option.value === currentValue);
      return (
        <button
          type="button"
          onClick={() => setSelectorOpen(true)}
          className="flex min-h-[5.2rem] w-full max-w-[30rem] items-center justify-between rounded-[1.5rem] border border-black/10 bg-[#f4f4f4] px-6 text-center text-xl font-bold text-black shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
        >
          <div className="flex w-full items-center justify-center gap-3">
            <span>{selectedOption?.value || screen.placeholder}</span>
          </div>
          <ChevronDown className="ml-4 h-6 w-6 shrink-0 text-black/50" />
        </button>
      );
    }

    return (
      <input
        type={screen.fieldType === "email" ? "email" : screen.fieldType === "url" ? "url" : "text"}
        value={currentValue}
        onChange={(event) => updateValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={screen.placeholder}
        className="min-h-[5.2rem] w-full max-w-[30rem] rounded-[1.5rem] border border-black/10 bg-[#f4f4f4] px-8 text-center text-xl font-bold text-black shadow-[0_10px_30px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#8e8e8e] focus:border-black/20"
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#fbfbf8] text-black">
      <div className="mx-auto flex min-h-screen max-w-[90rem] flex-col px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex justify-center">
          <img
            src="https://media.base44.com/images/public/69bc1d66f587e6c886c40dd3/d919161da_100logo.png"
            alt="Logo"
            className="h-5 w-auto object-contain sm:h-10"
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-4xl text-center">
            {screen.eyebrow && (
              <p className="mb-6 text-lg font-semibold text-[#9a9a9a] sm:text-xl">
                {screen.eyebrow}
              </p>
            )}

            <h1 className="mx-auto max-w-3xl whitespace-pre-line text-[2.4rem] font-black leading-[1.08] sm:text-[3rem] md:text-[3.6rem]">
              {screen.title}
            </h1>

            <div className="mt-10 flex justify-center">{renderField()}</div>

            {screen.fieldType !== "submit" && <Progress step={progressStep} />}

            {screen.fieldType === "submit" && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/visor")}
                  className="rounded-[1.6rem] bg-[#c8ff1a] px-10 py-6 text-xl font-bold text-black transition-transform hover:scale-[1.01]"
                >
                  Regresar a la lista
                </button>
              </div>
            )}
          </div>
        </div>

        {screen.fieldType !== "submit" && (
          <div className="mt-8 flex items-end justify-between gap-6">
            <button
              type="button"
              onClick={() => navigate("/visor")}
              className="rounded-[1.6rem] bg-[#c8ff1a] px-6 py-5 text-base font-bold text-black sm:px-8 sm:text-xl"
            >
              Regresar a la lista
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className="rounded-[1.6rem] border-2 border-black bg-white px-7 py-5 text-base font-bold text-black transition-all disabled:cursor-not-allowed disabled:opacity-40 sm:px-10 sm:text-xl"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {selectorOpen && screen.fieldType === "select" && (
        <SelectorSheet
          title={screen.placeholder}
          options={screen.options}
          value={currentValue}
          onSelect={updateValue}
          onClose={() => setSelectorOpen(false)}
        />
      )}
    </div>
  );
}
