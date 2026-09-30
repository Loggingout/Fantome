import { useState } from 'react'
import {
  Search,
  Palette,
  Code,
  Rocket,
  ChevronDown
} from 'lucide-react'

export default function DiscoveryDropdown() {
  const [activeStep, setActiveStep] = useState<string | null>(null)

  const steps = [
    {
      id: 'discovery',
      title: 'Discovery',
      description:
        'We start by understanding your business, goals, and challenges. Through collaborative discussions, we define the project scope and create a clear roadmap for success.',
      icon: Search,
    },
    {
      id: 'design',
      title: 'Design',
      description:
        "Our team crafts intuitive, visually striking designs that align with your brand. We focus on user experience and iterate based on your feedback until it's perfect.",
      icon: Palette,
    },
    {
      id: 'build',
      title: 'Build',
      description:
        'We bring the designs to life with clean, efficient code. Throughout development, we maintain open communication and provide regular updates on progress.',
      icon: Code,
    },
    {
      id: 'launch',
      title: 'Launch',
      description:
        'After thorough testing and your final approval, we deploy your project to production. We ensure a smooth launch and provide ongoing support as you grow.',
      icon: Rocket,
    },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-center mb-8 text-white">
        How It Works
      </h2>
      <p className="text-center text-neutral-400 mb-8 font-semibold">
        A step-by-step process to bring your vision to life
      </p>

      <div className="space-y-4">
        {steps.map((step) => {
          const Icon = step.icon

          return (
            <div
              key={step.id}
              className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-[0_18px_60px_rgba(15,23,42,0.35)]"
            >
              <button
                onClick={() =>
                  setActiveStep(activeStep === step.id ? null : step.id)
                }
                className="w-full px-6 py-4 text-left text-white transition-colors duration-300 hover:bg-neutral-800 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-cyan-300" />
                  <span className="font-semibold text-lg">{step.title}</span>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${
                    activeStep === step.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeStep === step.id && (
                <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800">
                  <p className="text-neutral-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
