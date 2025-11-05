export function getRandomEmail() {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  return `test_${timestamp}_${randomString}@test.com`;
}