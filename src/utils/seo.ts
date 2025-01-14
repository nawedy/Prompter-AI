export const generateStructuredData = (page: string) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Prompter.AI",
    "applicationCategory": "Artificial Intelligence",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  switch (page) {
    case 'home':
      return {
        ...baseData,
        "description": "Advanced AI prompt engineering and management platform"
      };
    case 'dashboard':
      return {
        ...baseData,
        "@type": "WebPage",
        "name": "Dashboard - Prompter.AI",
        "description": "Manage your AI prompts and templates"
      };
    default:
      return baseData;
  }
};

export const injectStructuredData = (data: object) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};