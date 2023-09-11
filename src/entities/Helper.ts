export function BigIntSerializer(value: bigint): Uint8Array {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigInt64(0, value as bigint);
  return new Uint8Array(buffer);
}

export function BigIntDeserializer(value: Uint8Array): bigint {
  const view = new DataView(value.buffer);
  return view.getBigInt64(0);
}
