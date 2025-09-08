# Tech Articles Blog

A modern, responsive Jekyll blog focused on web development and technology articles. Built with performance, accessibility, and user experience in mind.

## 🚀 Features

### Core Functionality
- **Static Site Generation**: Built with Jekyll for fast, secure, and scalable deployment
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Search Functionality**: Client-side search with instant results
- **Progressive Web App**: Installable with offline capabilities

### Content Management
- **Markdown Support**: Write posts in Markdown with front matter
- **Categories & Tags**: Organize content with categories and tags
- **Featured Posts**: Highlight important articles
- **Related Articles**: Automatic related post suggestions
- **Table of Contents**: Auto-generated TOC for long articles

### Performance & SEO
- **Core Web Vitals Optimized**: Excellent Lighthouse scores
- **SEO Ready**: Built-in SEO optimization with jekyll-seo-tag
- **Image Optimization**: Lazy loading and modern image formats
- **Code Syntax Highlighting**: Prism.js integration
- **RSS Feed**: Automatic feed generation

### User Experience
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Social Sharing**: Built-in social media sharing buttons
- **Newsletter Signup**: Email subscription functionality
- **Reading Progress**: Visual reading progress indicator
- **Copy Code Buttons**: One-click code copying
- **Smooth Animations**: Subtle animations and transitions

## 🛠️ Technology Stack

- **Jekyll**: Static site generator
- **Ruby**: Jekyll runtime environment
- **CSS3**: Modern CSS with custom properties
- **JavaScript ES6+**: Vanilla JavaScript for interactivity
- **GitHub Actions**: Automated deployment
- **GitHub Pages**: Free hosting

## 📦 Installation & Setup

### Prerequisites

- Ruby 3.0 or higher
- Bundler gem
- Git
- Node.js (optional, for additional tooling)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/my-blog.git
   cd my-blog
   ```

2. **Install dependencies:**
   ```bash
   bundle install
   ```

3. **Serve the site locally:**
   ```bash
   bundle exec jekyll serve
   ```

4. **Open your browser:**
   Navigate to `http://localhost:4000`

### Development with live reload:
```bash
bundle exec jekyll serve --livereload
```

## 📝 Content Management

### Writing Posts

Create new posts in the `_posts` directory with the filename format: `YYYY-MM-DD-title.md`

#### Example Post Front Matter:
```yaml
---
layout: post
title: "Your Post Title"
date: 2024-09-08 10:00:00 +0000
categories: [category1, category2]
tags: [tag1, tag2, tag3]
author: "Your Name"
featured: true
excerpt: "A brief description of your post..."
---

Your post content here...
```

### Adding Pages

Create new pages in the root directory or `_pages` folder:

```yaml
---
layout: page
title: "Page Title"
permalink: /page-url/
---

Your page content here...
```

### Customizing the Site

Edit `_config.yml` to customize:

```yaml
# Site settings
title: Your Blog Title
description: Your blog description
url: "https://yourusername.github.io"
baseurl: "/your-repo-name"
author: Your Name
email: your.email@example.com

# Social media links
social:
  links:
    - https://twitter.com/yourusername
    - https://github.com/yourusername
```

## 🎨 Customization

### Themes

The site uses CSS custom properties for theming. Customize colors in `assets/css/style.css`:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --accent-color: #10b981;
  /* ... more variables */
}
```

### Layout Modifications

- **Header**: Edit `_includes/header.html`
- **Footer**: Edit `_includes/footer.html`
- **Post Layout**: Edit `_layouts/post.html`
- **Page Layout**: Edit `_layouts/page.html`

### Adding Custom CSS

Add custom styles to `assets/css/style.css` or create new CSS files in the `assets/css/` directory.

### JavaScript Customization

Modify `assets/js/main.js` or add new JavaScript files to the `assets/js/` directory.

## 🚀 Deployment

### GitHub Pages (Recommended)

1. **Fork or clone this repository**
2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"
3. **Update `_config.yml`:**
   ```yaml
   url: "https://yourusername.github.io"
   baseurl: "/repository-name"
   ```
4. **Push to main branch** - automatic deployment will start

### Manual Deployment

Build the site locally and deploy to any static hosting service:

```bash
bundle exec jekyll build
```

The built site will be in the `_site` directory.

### Other Hosting Options

- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Import your repository for edge deployment
- **Firebase Hosting**: Deploy with Firebase CLI
- **AWS S3**: Static website hosting on S3

## 📊 Analytics & Monitoring

### Google Analytics

Add your Google Analytics tracking ID to `_config.yml`:

```yaml
google_analytics: G-XXXXXXXXXX
```

### Search Console

1. Add your site to Google Search Console
2. Upload the verification file to the root directory
3. Submit your sitemap: `https://yourdomain.com/sitemap.xml`

## 🔧 Advanced Configuration

### Custom Plugins

Add Jekyll plugins to your `Gemfile`:

```ruby
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "your-custom-plugin"
end
```

### Environment Variables

Use environment variables for sensitive configuration:

```yaml
# _config.yml
google_analytics: "{{ site.google_analytics_id | default: 'G-XXXXXXXXXX' }}"
```

Set in GitHub repository secrets or local environment.

### Custom Collections

Define custom collections in `_config.yml`:

```yaml
collections:
  projects:
    output: true
    permalink: /:collection/:name/
  tutorials:
    output: true
    permalink: /:collection/:title/
```

## 🐛 Troubleshooting

### Common Issues

**Build fails with dependency errors:**
```bash
bundle clean --force
bundle install
```

**Site doesn't update after changes:**
```bash
bundle exec jekyll clean
bundle exec jekyll serve
```

**GitHub Pages build fails:**
- Check that you're using supported plugins
- Verify `_config.yml` syntax
- Check GitHub Actions logs for detailed errors

**Images not loading:**
- Ensure correct path: `/assets/images/filename.jpg`
- Use relative URLs: `{{ "/assets/images/filename.jpg" | relative_url }}`

### Performance Optimization

1. **Optimize images:**
   - Use WebP format when possible
   - Compress images before uploading
   - Use appropriate sizes for different screen densities

2. **Minimize CSS/JS:**
   - Use Jekyll's built-in Sass compression
   - Minify JavaScript files
   - Remove unused CSS

3. **Cache optimization:**
   - Set appropriate cache headers
   - Use CDN for assets
   - Enable service worker caching

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Write or update tests if applicable
5. Commit your changes: `git commit -m "Add feature"`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Write semantic, accessible HTML
- Use CSS custom properties for theming
- Add comments to complex JavaScript functions
- Test on multiple browsers and devices
- Ensure responsive design works correctly

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/my-blog/issues) page
2. Search for existing solutions
3. Create a new issue with detailed information
4. Include your Jekyll version, Ruby version, and operating system

## 🎯 Roadmap

- [ ] Multi-language support (i18n)
- [ ] Comment system integration (Disqus/Utterances)
- [ ] Advanced search with filters
- [ ] Email newsletter integration
- [ ] Social media auto-posting
- [ ] Advanced analytics dashboard
- [ ] Mobile app companion
- [ ] Voice search functionality

## 👥 Credits

- **Jekyll Team**: For the amazing static site generator
- **GitHub**: For free hosting via GitHub Pages
- **Inter Font**: Modern typography
- **JetBrains Mono**: Code font
- **Prism.js**: Syntax highlighting
- **Contributors**: Thanks to all contributors who help improve this project

---

**Happy blogging!** 🎉

For more detailed documentation, check out the [Jekyll documentation](https://jekyllrb.com/docs/) and [GitHub Pages documentation](https://docs.github.com/en/pages).# _scope
