export default interface ApiLoader {
  load(url: string): Promise<object>;
}
