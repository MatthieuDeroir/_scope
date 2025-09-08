# _plugins/search_index.rb
# Generates a search index for client-side search functionality

Jekyll::Hooks.register :site, :post_write do |site|
  # Create search index
  search_index = []
  
  site.posts.docs.each do |post|
    search_index << {
      title: post.data['title'],
      url: post.url,
      date: post.date.strftime('%Y-%m-%d'),
      categories: post.data['categories'] || [],
      tags: post.data['tags'] || [],
      author: post.data['author'] || site.config['author'] || 'Anonymous',
      excerpt: post.data['excerpt'] ? strip_html(post.data['excerpt']) : '',
      content: strip_html(post.content)[0..500] # First 500 characters
    }
  end
  
  # Include pages in search index
  site.pages.each do |page|
    next if page.data['exclude_from_search'] == true
    next if page.path.start_with?('_')
    next if page.url == '/'
    
    search_index << {
      title: page.data['title'],
      url: page.url,
      date: nil,
      categories: [],
      tags: [],
      author: page.data['author'] || site.config['author'] || 'Anonymous',
      excerpt: page.data['excerpt'] ? strip_html(page.data['excerpt']) : '',
      content: strip_html(page.content)[0..500] # First 500 characters
    }
  end
  
  # Write search index to file
  search_index_path = File.join(site.dest, 'search-index.json')
  File.write(search_index_path, JSON.pretty_generate(search_index))
  
  puts "Generated search index with #{search_index.length} items"
end

def strip_html(content)
  content.gsub(/<\/?[^>]*>/, '').strip
end