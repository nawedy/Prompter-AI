import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Play, Zap, Shield, Code, Brain, Wand2, Users, LineChart, ChevronRight, Mail } from 'lucide-react';
import { generateStructuredData, injectStructuredData } from '../utils/seo';
import { optimizeImage } from '../utils/performance';

const features = [
  {
    title: 'Smart Generation',
    description: 'Advanced AI algorithms create optimized prompts tailored to your needs',
    icon: Brain,
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time on prompt engineering',
    icon: Users,
  },
  {
    title: 'Bias Detection',
    description: 'Automatically detect and eliminate bias in your prompts',
    icon: Shield,
  },
  {
    title: 'Code Integration',
    description: 'Seamlessly integrate prompts into your development workflow',
    icon: Code,
  },
  {
    title: 'Performance Analytics',
    description: 'Track and optimize your prompt performance over time',
    icon: LineChart,
  },
  {
    title: 'Template Library',
    description: 'Access a vast library of pre-built prompt templates',
    icon: Wand2,
  },
];

const resources = [
  {
    title: 'Getting Started Guide',
    category: 'Guide',
    description: 'Learn the basics of effective prompt engineering',
    image: optimizeImage('https://images.unsplash.com/photo-1516321318423-f06f85e504b3', 400),
  },
  {
    title: 'Best Practices',
    category: 'Tutorial',
    description: 'Master advanced prompt engineering techniques',
    image: optimizeImage('https://images.unsplash.com/photo-1551434678-e076c223a692', 400),
  },
  {
    title: 'Case Studies',
    category: 'Research',
    description: 'Real-world examples of successful implementations',
    image: optimizeImage('https://images.unsplash.com/photo-1553484771-047a44eee27b', 400),
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    position: 'AI Research Lead',
    company: 'TechCorp',
    image: optimizeImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330', 200),
    quote: 'Prompter.AI has revolutionized our prompt engineering workflow. The bias detection alone has saved us countless hours.',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    position: 'CTO',
    company: 'AI Solutions',
    image: optimizeImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 200),
    quote: 'The collaboration features are incredible. Our team productivity has increased by 300% since adopting Prompter.AI.',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    position: 'ML Engineer',
    company: 'DataTech',
    image: optimizeImage('https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 200),
    quote: 'Finally, a tool that makes prompt engineering accessible and efficient. The template library is invaluable.',
    rating: 5,
  },
];

export function LandingPage() {
  useEffect(() => {
    const structuredData = generateStructuredData('home');
    injectStructuredData(structuredData);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Master AI Prompts</span>
                <span className="block text-primary-DEFAULT">With Confidence</span>
              </h1>
              <p className="mt-3 text-base text-white/80 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Revolutionize your AI interactions with intelligent prompt engineering, real-time collaboration, and advanced bias detection.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-dark bg-primary-DEFAULT hover:bg-primary-light"
                  >
                    Start Free Trial
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                  <button
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-dark/50 hover:bg-primary-dark/70"
                  >
                    Watch Demo
                    <Play className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <img
                  className="w-full rounded-lg"
                  src={optimizeImage('https://images.unsplash.com/photo-1620712943543-bcc4688e7485', 800)}
                  alt="AI Prompt Engineering"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-primary-dark">
              Powerful Features for Modern AI
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to master prompt engineering
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-light to-primary-DEFAULT rounded-lg opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative">
                  <feature.icon className="h-8 w-8 text-primary-DEFAULT" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Resources & Guides
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {resources.map((resource) => (
              <div
                key={resource.title}
                className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-light/10 text-primary-dark">
                    {resource.category}
                  </span>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {resource.description}
                  </p>
                  <Link
                    to="#"
                    className="mt-4 inline-flex items-center text-primary-dark hover:text-primary-DEFAULT"
                  >
                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-primary-dark text-center">
            Trusted by Industry Leaders
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {testimonial.position} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Sparkles
                      key={i}
                      className="h-5 w-5 text-primary-DEFAULT"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Stay Updated with AI Trends
            </h2>
            <p className="mt-4 text-xl text-white/80">
              Get the latest prompt engineering tips and AI insights
            </p>
          </div>
          <form className="mt-8 sm:flex justify-center max-w-2xl mx-auto">
            <div className="min-w-0 flex-1">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="block w-full rounded-md border-0 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
              />
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <button
                type="submit"
                className="block w-full rounded-md bg-primary-DEFAULT px-4 py-3 font-medium text-primary-dark hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
              >
                Subscribe
              </button>
            </div>
          </form>
          <p className="mt-3 text-sm text-white/60 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-light">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Connect
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-base text-white/60 hover:text-white">
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link to="#" className="text-white/60 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Mail className="h-6 w-6" />
              </Link>
            </div>
            <p className="mt-8 text-base text-white/60 md:mt-0 md:order-1">
              &copy; {new Date().getFullYear()} Prompter.AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}