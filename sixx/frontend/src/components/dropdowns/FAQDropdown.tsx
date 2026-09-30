import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function QuestionsDropdown() {
    const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

    const faqs = [
        {
            id: 'timeline',
            question: 'How long does a typical project take?',
            answer: `Most projects take 2-3 weeks from start to launch, depending on complexity. We'll give you a clear timeline during our discovery phase and keep you updated throughout.`
        },
        {
            id: 'cost',
            question: 'What does a project cost?',
            answer: `Every project is different, so we provide custom quotes based on your specific needs. After our initial consultation, you'll get a detailed proposal with transparent pricing—no hidden fees.`
        },
        {
            id: 'process',
            question: `What's your development process like?`,
            answer: `We follow a four-phase approach: Discovery, Design, Build, and Launch. You'll be involved at every stage with regular check-ins and opportunities for feedback before we move forward.`
        },
        {
            id: 'maintenance',
            question: 'Do you provide ongoing support after launch?',
            answer: `Absolutely. We offer maintenance packages and are available for updates, troubleshooting, and improvements as your business grows. You won't be left on your own after launch.`
        },
        {
            id: 'technology',
            question: 'What technologies do you work with?',
            answer: `We specialize in modern frameworks like React, Next.js, and TypeScript, JavaScript, HTML, along with reliable backend solutions. We choose technologies based on what's best for your project, not what's trendy.`
        }
    ];

    return (
        <div className="w-full max-w-3xl mx-auto py-12 px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
                {faqs.map((faq) => (
                    <div 
                        key={faq.id} 
                        className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-[0_18px_60px_rgba(15,23,42,0.35)] transition-all duration-300 hover:border-neutral-700"
                    >
                        <button
                            onClick={() => setActiveQuestion(activeQuestion === faq.id ? null : faq.id)}
                            className="w-full px-6 py-4 text-left font-semibold text-lg text-white transition-colors duration-300 hover:bg-neutral-800 flex justify-between items-center gap-4"
                        >
                            <span>{faq.question}</span>
                            {activeQuestion === faq.id ? (
                                <Minus className="w-5 h-5 shrink-0 text-cyan-300" />
                            ) : (
                                <Plus className="w-5 h-5 shrink-0 text-fuchsia-300" />
                            )}
                        </button>
                        
                        {activeQuestion === faq.id && (
                            <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800">
                                <p className="text-neutral-300 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
