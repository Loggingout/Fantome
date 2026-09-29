import { Send } from "lucide-react";

export default function ContactForm() {
  return (
    <section id="contact-form" className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
        <div>
          <span className="text-xs tracking-widest uppercase text-neutral-500">
            Send a Message
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
            Start the Conversation
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
            Tell us what you&apos;re reaching out about and provide enough
            information for us to understand your inquiry.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            Platform-specific support may be handled directly through the
            individual platform. For company-level inquiries, use the form
            provided here.
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8">
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-first-name"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  First Name
                </label>

                <input
                  id="contact-first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="
                    w-full
                    rounded-xl
                    border
                    border-neutral-800
                    bg-neutral-950
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-neutral-600
                    focus:border-neutral-600
                  "
                  placeholder="First name"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-last-name"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Last Name
                </label>

                <input
                  id="contact-last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="
                    w-full
                    rounded-xl
                    border
                    border-neutral-800
                    bg-neutral-950
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-neutral-600
                    focus:border-neutral-600
                  "
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Email
              </label>

              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-neutral-800
                  bg-neutral-950
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-neutral-600
                  focus:border-neutral-600
                "
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-inquiry"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Inquiry Type
              </label>

              <select
                id="contact-inquiry"
                name="inquiryType"
                required
                defaultValue=""
                className="
                  w-full
                  rounded-xl
                  border
                  border-neutral-800
                  bg-neutral-950
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  focus:border-neutral-600
                "
              >
                <option value="" disabled>
                  Select an inquiry type
                </option>

                <option value="general">General Inquiry</option>
                <option value="business">Business & Partnerships</option>
                <option value="platform">Platform Support</option>
                <option value="careers">Careers & Opportunities</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Subject
              </label>

              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-neutral-800
                  bg-neutral-950
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-neutral-600
                  focus:border-neutral-600
                "
                placeholder="What is your message about?"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                required
                rows={7}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-neutral-800
                  bg-neutral-950
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-neutral-600
                  focus:border-neutral-600
                "
                placeholder="Tell us how we can help."
              />
            </div>

            <button
              type="submit"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-neutral-700
                bg-neutral-800
                px-5
                py-3
                text-sm
                font-medium
                text-white
                transition-all
                duration-300
                hover:border-neutral-600
                hover:bg-neutral-700
              "
            >
              Send Message
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}