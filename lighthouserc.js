module.exports = {
  ci: {
    collect: {
      staticDistDir: './_site',
      numberOfRuns: 3,
      url: [
        'http://localhost/index.html',
        'http://localhost/about/index.html',
        'http://localhost/2024/09/08/getting-started-with-jekyll/index.html'
      ]
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:pwa': ['warn', { minScore: 0.8 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};