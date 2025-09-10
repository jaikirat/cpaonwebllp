export default function Home() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container-padding section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6">
              Professional Accounting Services You Can Trust
            </h1>
            <p className="text-lg md:text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              CPA On Web LLP provides comprehensive accounting, tax preparation, and financial consulting services to individuals and businesses across the nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-base btn-primary px-8 py-3 text-base font-semibold">
                Schedule Consultation
              </button>
              <button className="btn-base btn-secondary px-8 py-3 text-base font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-secondary-50">
        <div className="container-padding py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Our Services
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Comprehensive financial solutions tailored to your unique needs
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="card-base p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Tax Preparation</h3>
                <p className="text-secondary-600 mb-6">Expert tax preparation and planning services for individuals, families, and businesses of all sizes.</p>
                <button className="link-primary font-medium bg-transparent border-none cursor-pointer p-0">Learn more →</button>
              </div>

              <div className="card-base p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Bookkeeping</h3>
                <p className="text-secondary-600 mb-6">Accurate bookkeeping and financial record management to keep your business organized and compliant.</p>
                <button className="link-primary font-medium bg-transparent border-none cursor-pointer p-0">Learn more →</button>
              </div>

              <div className="card-base p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Financial Consulting</h3>
                <p className="text-secondary-600 mb-6">Strategic financial planning and business consulting to help you make informed decisions and grow.</p>
                <button className="link-primary font-medium bg-transparent border-none cursor-pointer p-0">Learn more →</button>
              </div>

              <div className="card-base p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Audit Support</h3>
                <p className="text-secondary-600 mb-6">Professional audit preparation and support services to ensure compliance and accuracy in your financial reporting.</p>
                <button className="link-primary font-medium bg-transparent border-none cursor-pointer p-0">Learn more →</button>
              </div>

              <div className="card-base p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Business Formation</h3>
                <p className="text-secondary-600 mb-6">Guidance on business structure selection, incorporation, and ongoing compliance requirements for new ventures.</p>
                <button className="link-primary font-medium bg-transparent border-none cursor-pointer p-0">Learn more →</button>
              </div>

              <div className="card-base p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Tax Planning</h3>
                <p className="text-secondary-600 mb-6">Year-round tax planning strategies to minimize your tax liability and maximize your savings opportunities.</p>
                <button className="link-primary font-medium bg-transparent border-none cursor-pointer p-0">Learn more →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white">
        <div className="container-padding py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-8">
              Why Choose CPA On Web LLP?
            </h2>
            <div className="grid gap-8 md:grid-cols-2 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Expert Knowledge</h3>
                  <p className="text-secondary-600">Certified professionals with years of experience in accounting, taxation, and financial consulting.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Personalized Service</h3>
                  <p className="text-secondary-600">Tailored solutions that address your specific financial needs and business objectives.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Technology-Driven</h3>
                  <p className="text-secondary-600">Modern tools and digital solutions for efficient, accurate, and secure financial management.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Proven Results</h3>
                  <p className="text-secondary-600">Track record of helping clients achieve their financial goals and maintain compliance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600">
        <div className="container-padding py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Contact us today for a consultation and discover how we can help streamline your finances and maximize your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-base bg-white hover:bg-secondary-100 text-primary-600 px-8 py-3 text-base font-semibold">
                Schedule Consultation
              </button>
              <button className="btn-base bg-transparent hover:bg-primary-700 text-white px-8 py-3 text-base font-semibold border border-primary-400">
                Call (555) 123-4567
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
