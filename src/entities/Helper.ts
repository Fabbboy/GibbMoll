export function BigIntSerializer(value: BigInt): Uint8Array{
  let buffer = new ArrayBuffer(8);
  let view = new DataView(buffer);
  view.setBigInt64(0, value as bigint);
  return new Uint8Array(buffer);
}

export function BigIntDeserializer(value: Uint8Array): BigInt{
  let view = new DataView(value.buffer);
  return view.getBigInt64(0);
}