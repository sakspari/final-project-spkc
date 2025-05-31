// This is a simple hash function to avoid storing the plain password in the code
// In a real application, you would use a more secure approach with server-side validation
export function verifyExportPassword(input: string): boolean {
  // The password is obfuscated to make it harder to find via inspect element
  // This is not truly secure, but adds a layer of difficulty

  // Obfuscated password parts
  const parts = [
    [114, 105, 99, 111], // 'rico'
    [45, 103, 97, 110, 116, 101, 110, 103], // '-ganteng'
    [45, 102, 112, 118], // '-fpv'
  ]

  // Reconstruct the expected password
  const expectedPassword = parts.map((charCodes) => String.fromCharCode(...charCodes)).join("")

  // Time-constant comparison to mitigate timing attacks
  // (though this is less relevant for client-side code)
  if (input.length !== expectedPassword.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < input.length; i++) {
    result |= input.charCodeAt(i) ^ expectedPassword.charCodeAt(i)
  }

  return result === 0
}
