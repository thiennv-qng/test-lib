import { Idl, web3, BN } from '@project-serum/anchor'
import {
  IdlInstruction,
  IdlTypeDefTyStruct,
} from '@project-serum/anchor/dist/cjs/idl'
import { PublicKey } from '@solana/web3.js'
import {
  AccountsMeta,
  ArgsMeta,
  IDLParserState,
} from 'providers/parser.provider'

export const fileToBase64 = (
  file: File,
  callBack: (result: string | ArrayBuffer | null) => void,
) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = async () => {
    if (reader.result) callBack(reader.result)
  }
}

export class IdlParser {
  static getProgramAddress(IdlData: Idl) {
    if (!IdlData.metadata || !IdlData.metadata.address) return ''
    return IdlData.metadata.address
  }
  static getTypeOfParam(type: any): string {
    if (typeof type === 'string') return type

    if (type?.['defined']) return type['defined']
    if (type?.['option']) return IdlParser.getTypeOfParam(type['option'])
    if (type?.['vec']) return `${IdlParser.getTypeOfParam(type['vec'])} []`
    if (type?.['array']) {
      if (Array.isArray(type?.['array']))
        return `${type?.['array'][0]} [${type?.['array'][1]}]`
      return `${IdlParser.getTypeOfParam(type['array'])} []`
    }
    return type
  }
}

export const convertStringDataToPubKey = (
  data: Record<string, string | AccountsMeta>,
): Record<string, PublicKey> => {
  if (!data) throw new Error('Valid data')
  const nextDataPubKey: Record<string, PublicKey> = {}

  for (const key in data) {
    let dataKey = data[key]
    if (typeof dataKey !== 'string') dataKey = dataKey.publicKey
    nextDataPubKey[key] = new web3.PublicKey(dataKey)
  }
  return nextDataPubKey
}

export const convertArgsByType = (
  raw: string | string[],
  type: any,
  parser: IDLParserState,
): any => {
  const vecType = type['vec']
  const definedType = type['defined']
  const arrayType = type['array']
  const isBoolType = type === 'bool'
  const isPubkeyType = type === 'publicKey'
  const isArrayData = Array.isArray(raw)
  const isNumberType =
    type === 'u8' ||
    type === 'u16' ||
    type === 'u32' ||
    type === 'i8' ||
    type === 'i16' ||
    type === 'i32' ||
    type === 'f32' ||
    type === 'f64'

  const isBNType =
    type === 'u64' || type === 'u128' || type === 'i64' || type === 'i128'

  let typeIdlEnum = parser.idl?.types?.find((e) => e.name === type)
  if (!typeIdlEnum)
    typeIdlEnum = parser.idl?.accounts?.find((e) => e.name === type)

  const isTypeIdlEnum = typeIdlEnum?.type.kind === 'enum'
  const isTypeIdlStruct = typeIdlEnum?.type.kind === 'struct'

  if (isArrayData)
    return raw.map((item) => convertArgsByType(item, type, parser))

  switch (true) {
    case !!definedType:
      return convertArgsByType(raw, definedType, parser)
    case !!vecType:
      return raw
        .toString()
        .split(',')
        .map((val) => convertArgsByType(val, vecType, parser))
    case !!arrayType:
      return convertArgsByType(
        raw
          .toString()
          .split(',')
          ?.map((val) => val),
        arrayType[0],
        parser,
      )
    case isPubkeyType:
      try {
        return new PublicKey(raw)
      } catch (error) {
        return raw
      }
    case isBoolType:
      return raw === 'true' ? true : false
    case isBNType:
      const detectIntegerRegex = /^\d+$/
      return detectIntegerRegex.test(raw) ? new BN(raw.toString()) : new BN(0)
    case isNumberType:
      return !!Number(raw) ? Number(raw) : 0
    case isTypeIdlEnum:
      return { [raw.substring(0, 1).toLowerCase() + raw.substring(1)]: {} }
    case isTypeIdlStruct:
      if (typeof raw === 'object') {
        const nextRawData = JSON.parse(JSON.stringify(raw))
        const typeIdlStruct = typeIdlEnum?.type as IdlTypeDefTyStruct
        for (const { name, type } of typeIdlStruct.fields) {
          if (!!nextRawData[name])
            nextRawData[name] = convertArgsByType(
              nextRawData[name],
              type,
              parser,
            )
          continue
        }
        return nextRawData
      }
      return raw
    default:
      return raw
  }
}

export const normalizeAnchorArgs = (
  data: ArgsMeta,
  instructionIdl: IdlInstruction,
  parser: IDLParserState,
) => {
  const nextInstruct = instructionIdl.args.map(({ name, type }) => {
    const dataOfIndex = data[name]
    if (dataOfIndex === undefined) return []
    const nextData = convertArgsByType(dataOfIndex, type, parser)
    return nextData
  })
  return nextInstruct
}
