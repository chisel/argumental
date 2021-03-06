declare interface AppData {

  config: RunConfig;
  hasChanges: boolean;

}

declare interface RunConfig {

  [batchName: string]: string[];

}

declare interface LoadArgs {

  config: RunConfig;

}
