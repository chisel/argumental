declare interface AppData {

  apiKey: string;
  apiHost: string;

}

declare interface Breed {

  id: string;
  name: string;
  temperament: string;
  life_span: string;
  bred_for: string;
  breed_group: string;
  origin: string;
  weight: { imperial: string; metric: string; };
  height: { imperial: string; metric: string; };

}

declare interface ImageResult {

  breeds: Breed[];
  height: number;
  width: number;
  url: string;

}
