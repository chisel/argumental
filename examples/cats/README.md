# Cats CLI

Commands:
  - **cats list --page &lt;page_number&gt; --limit &lt;limit_count&gt; --imperial**  
    **cats l -p &lt;page_number&gt; -l &lt;limit_count&gt; -i**  
  Lists all know cat breeds with information about the breed.
  - **cats search &lt;query&gt; --imperial**  
    **cats s &lt;query&gt; -i**  
  Searches for a cat breed and displays its information.
  - **cats image &lt;query&gt;**  
    **cats i &lt;query&gt;**  
  Displays an image of a cat breed.

# Install

```bash
npm install
npm link
```

# Examples

  - List the first 10 cat breeds:  
  `cats list --limit 10`
  - List the next 10 cat breeds with imperial units:  
  `cats list --limit 10 --page 2 --imperial`
  - Display information for persian cats:  
  `cats search persian`
  - Display an image of a british shorthair:  
  `cats image british shorthair`
