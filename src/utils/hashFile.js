export async function hashFile(fileDescriptor) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', fileDescriptor);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return `0x${hashArray
    .map((b) => ('00' + b.toString(16)).slice(-2))
    .join('')}`;
}
