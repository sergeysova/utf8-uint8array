function toBytes(string) {
  let byteIndex = 0;
  const bytes = new Uint8Array(string.length * 4);
  for (let charIndex = 0; charIndex != string.length; charIndex++) {
    let char = string.charCodeAt(charIndex);
    if (char < 128) {
      bytes[byteIndex++] = char;
      continue;
    }
    if (char < 2048) {
      bytes[byteIndex++] = (char >> 6) | 192;
    } else {
      if (char > 0xd7ff && char < 0xdc00) {
        if (++charIndex >= string.length)
          throw new Error("UTF-8 encode: incomplete surrogate pair");
        const c2 = string.charCodeAt(charIndex);
        if (c2 < 0xdc00 || c2 > 0xdfff)
          throw new Error(
            `UTF-8 encode: second surrogate character 0x${c2.toString(
              16,
            )} at index ${charIndex} out of range`,
          );
        char = 0x10000 + ((char & 0x03ff) << 10) + (c2 & 0x03ff);
        bytes[byteIndex++] = (char >> 18) | 240;
        bytes[byteIndex++] = ((char >> 12) & 63) | 128;
      } else bytes[byteIndex++] = (char >> 12) | 224;
      bytes[byteIndex++] = ((char >> 6) & 63) | 128;
    }
    bytes[byteIndex++] = (char & 63) | 128;
  }
  return bytes.subarray(0, byteIndex);
}

function fromBytes(bytes) {
  let index = 0;
  let string = "";
  while (index < bytes.length) {
    let char = bytes[index++];
    if (char > 127) {
      if (char > 191 && char < 224) {
        if (index >= bytes.length)
          throw new Error("UTF-8 decode: incomplete 2-byte sequence");
        char = ((char & 31) << 6) | (bytes[index++] & 63);
      } else if (char > 223 && char < 240) {
        if (index + 1 >= bytes.length)
          throw new Error("UTF-8 decode: incomplete 3-byte sequence");
        char =
          ((char & 15) << 12) |
          ((bytes[index++] & 63) << 6) |
          (bytes[index++] & 63);
      } else if (char > 239 && char < 248) {
        if (index + 2 >= bytes.length)
          throw new Error("UTF-8 decode: incomplete 4-byte sequence");
        char =
          ((char & 7) << 18) |
          ((bytes[index++] & 63) << 12) |
          ((bytes[index++] & 63) << 6) |
          (bytes[index++] & 63);
      } else
        throw new Error(
          `UTF-8 decode: unknown multibyte start 0x${char.toString(
            16,
          )} at index ${index - 1}`,
        );
    }
    if (char <= 0xffff) string += String.fromCharCode(char);
    else if (char <= 0x10ffff) {
      char -= 0x10000;
      string += String.fromCharCode((char >> 10) | 0xd800);
      string += String.fromCharCode((char & 0x3ff) | 0xdc00);
    } else
      throw new Error(
        `UTF-8 decode: code point 0x${char.toString(16)} exceeds UTF-16 reach`,
      );
  }
  return string;
}

module.exports = {
  toBytes,
  fromBytes,
};
