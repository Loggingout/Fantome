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
      <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
        How It Works
      </h2>
      <p className="text-center text-gray-400 mb-8 font-bold">
        "A step-by-step process to bring your vision to life"
      </p>

      <div className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon

          return (
            <div
              key={step.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setActiveStep(activeStep === step.id ? null : step.id)
                }
                className="w-full px-6 py-4 text-left font-semibold text-lg hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-purple-600" />
                  {step.title}
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    activeStep === step.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeStep === step.id && (
                <div className="px-6 py-4 bg-gradient-to-l from-purple-50 to-transparent">
                  <p className="text-gray-700 leading-relaxed">
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
