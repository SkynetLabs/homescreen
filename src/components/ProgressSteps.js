import { CheckIcon } from "@heroicons/react/solid";
import classnames from "classnames";

export default function ProgressSteps({ steps }) {
  return (
    <div className="lg:border-t lg:border-b lg:border-gray-200">
      <nav className="mx-auto max-w-7xl" aria-label="Progress">
        <ol className="rounded-md overflow-hidden lg:flex lg:border-l lg:border-r lg:border-gray-200 lg:rounded-none bg-white">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="relative overflow-hidden lg:flex-1">
              <div
                className={classnames(
                  stepIdx === 0 ? "border-b-0 rounded-t-md" : "",
                  stepIdx === steps.length - 1 ? "border-t-0 rounded-b-md" : "",
                  "border border-gray-200 overflow-hidden lg:border-0"
                )}
              >
                {step.status === "complete" ? (
                  <button className="group text-left cursor-auto" disabled={true}>
                    <span
                      className="absolute top-0 left-0 w-1 h-full bg-transparent lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                      aria-hidden="true"
                    />
                    <span
                      className={classnames(
                        stepIdx !== 0 ? "lg:pl-9" : "",
                        "px-6 py-5 flex items-start text-sm font-medium text-palette-300"
                      )}
                    >
                      <span className="flex-shrink-0">
                        <span className="w-10 h-10 flex items-center justify-center bg-primary bg-opacity-30 rounded-full">
                          <CheckIcon className="w-6 h-6 text-white" aria-hidden="true" />
                        </span>
                      </span>
                      <span className="mt-0.5 ml-4 min-w-0 flex flex-col space-y-2">
                        <span className="text-xs font-semibold tracking-wide uppercase">{step.name}</span>
                        <span className="text-sm font-medium">{step.description}</span>
                      </span>
                    </span>
                  </button>
                ) : step.status === "current" ? (
                  <button
                    type="button"
                    aria-current="step"
                    className={classnames("group text-left", { "cursor-auto": !step.onClick })}
                    onClick={step.onClick}
                    disabled={!step.onClick}
                  >
                    <span
                      className="absolute top-0 left-0 w-1 h-full bg-primary lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                      aria-hidden="true"
                    />
                    <span
                      className={classnames(
                        stepIdx !== 0 ? "lg:pl-9" : "",
                        "px-6 py-5 flex items-start text-sm font-medium"
                      )}
                    >
                      <span className="flex-shrink-0">
                        <span className="w-10 h-10 flex items-center justify-center border-2 border-primary rounded-full">
                          <span className="text-primary">{step.id}</span>
                        </span>
                      </span>
                      <span className="mt-0.5 ml-4 min-w-0 flex flex-col space-y-2">
                        <span
                          className={classnames(
                            "text-xs font-semibold text-palette-600 tracking-wide uppercase transition-colors",
                            { "group-hover:text-primary": step.onClick }
                          )}
                        >
                          {step.name}
                        </span>
                        <span className="text-sm font-medium text-palette-400">{step.description}</span>
                      </span>
                    </span>
                  </button>
                ) : (
                  <button className="group text-left cursor-auto" disabled={true}>
                    <span
                      className="absolute top-0 left-0 w-1 h-full bg-transparent lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
                      aria-hidden="true"
                    />
                    <span
                      className={classnames(
                        stepIdx !== 0 ? "lg:pl-9" : "",
                        "px-6 py-5 flex items-start text-sm font-medium"
                      )}
                    >
                      <span className="flex-shrink-0">
                        <span className="w-10 h-10 flex items-center justify-center border-2 border-palette-200 rounded-full">
                          <span className="text-palette-300">{step.id}</span>
                        </span>
                      </span>
                      <span className="mt-0.5 ml-4 min-w-0 flex flex-col space-y-2">
                        <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">{step.name}</span>
                        <span className="text-sm font-medium text-gray-500">{step.description}</span>
                      </span>
                    </span>
                  </button>
                )}

                {stepIdx !== 0 ? (
                  <>
                    {/* Separator */}
                    <div className="hidden absolute top-0 left-0 w-3 inset-0 lg:block" aria-hidden="true">
                      <svg
                        className="h-full w-full text-gray-300"
                        viewBox="0 0 12 82"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
