# Dogs CLI

Commands:
  - **dogs list --page &lt;page_number&gt; --limit &lt;limit_count&gt; --imperial**  
    **dogs l -p &lt;page_number&gt; -l &lt;limit_count&gt; -i**  
  Lists all know dog breeds with information about the breed.
  - **dogs search &lt;query&gt; --imperial**  
    **dogs s &lt;query&gt; -i**  
  Searches for a dog breed and displays its information.
  - **dogs image &lt;query&gt;**  
    **dogs i &lt;query&gt;**  
  Displays an image of a dog breed.

# Install

```bash
npm install
npm start
npm link
```

# Examples

  - List the first 10 dog breeds:  
  `dogs list --limit 10`
  - List the next 10 dog breeds with imperial units:  
  `dogs list --limit 10 --page 2 --imperial`
  - Display information for pugs:  
  `dogs search pug`
  - Display an image of a golden retriever:  
  `dogs image golden retriever`
