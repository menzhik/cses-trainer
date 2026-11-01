export default defineContentScript({
  matches: ['https://cses.fi/problemset/'],
  main() {
    console.log('cses-trainer: loaded');
  },
});
