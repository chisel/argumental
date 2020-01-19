# Run CLI

Commands:
  - **run &lt;batch_name&gt; [...vars]**  
  Executes a command batch and inserts all provided variables into the commands.
  - **run new batch &lt;batch_name&gt; --command &lt;command&gt;**  
  Creates a new command batch with the provided name and command options.
  - **run new batch --ask**  
  Asks for batch name and commands to create a new command batch.
  - **run load &lt;config&gt; --overwrite**  
  Loads a config file and registers all command batches (when overwrite flag is provided, command batches with the same name will be overwritten).
  - **run export &lt;filename&gt;**  
  Exports the config file at the provided path.
  - **run delete batch &lt;batch_name&gt;**  
  Deletes a command batch.
  - **run list [batch_name]**  
  Lists all existing command batches.

# Config

A config file should look like this:

```json
{
  "batch_name": [
    "command1",
    "command2",
    "..."
  ]
}
```

# Install

```bash
npm install
npm start
npm link
```

# Examples

  - Create a command batch named "npm-setup":  
  `run new batch npm-setup --command "npm install" --command "npm start" --command "npm link"`
  - Execute the command batch "npm-setup":  
  `run npm-setup`
  - Create a command batch named "dev-install":  
  `run new batch dev-install --command 'npm install $* --save-dev'`
  - Execute the command batch "dev-install" with arguments:  
  `run dev-install chai mocha ts-node`
