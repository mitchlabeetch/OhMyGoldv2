import type { ReactNode } from "react";
import { Check } from "lucide-react";

type Step = {
  label: string;
};

type WizardProps = {
  steps: Step[];
  currentStep: number;
  children: ReactNode;
};

export function Wizard({ steps, currentStep, children }: WizardProps) {
  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isLast = index === steps.length - 1;

            return (
              <li
                key={step.label}
                className={`flex items-center ${!isLast ? "flex-1" : ""}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? "bg-gold-400 border-gold-400"
                        : isCurrent
                        ? "border-gold-400 bg-transparent"
                        : "border-neutral-600 bg-transparent"
                    }`}
                    aria-label={`Step ${index + 1}: ${step.label}${isCompleted ? " (completed)" : isCurrent ? " (current)" : ""}`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-black" aria-hidden="true" />
                    ) : (
                      <span
                        className={`text-sm font-semibold ${isCurrent ? "text-gold-400" : "text-neutral-500"}`}
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      isCurrent ? "text-gold-400" : isCompleted ? "text-neutral-300" : "text-neutral-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 h-px mx-2 mb-5 ${isCompleted ? "bg-gold-400" : "bg-neutral-700"}`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step content */}
      <div>{children}</div>
    </div>
  );
}
