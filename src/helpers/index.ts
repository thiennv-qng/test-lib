import { Idl, web3, BN } from '@project-serum/anchor'
import { IdlInstruction, IdlType } from '@project-serum/anchor/dist/cjs/idl'
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

// https://book.anchor-lang.com/anchor_references/javascript_anchor_types_reference.html
export const convertArgsByType = (
  value: string,
  type: IdlType,
  parser: IDLParserState,
): any => {
  if (typeof type === 'string') {
    if (type === 'bool') return value === 'true'

    if (type === 'publicKey') return new PublicKey(value)

    if (['u64', 'u128', 'i64', 'i128'].includes(type.toString()))
      return new BN(value)

    if (['u8', 'u16', 'u32', 'i8', 'i16', 'i32'].includes(type))
      return Number(value)

    if (['f32', 'f64'].includes(type.toString())) return Number(value)

    throw new Error('Invalid type' + type)
  }

  // Advanced type
  if ('option' in type) {
    const elementType = type['option']
    if (!value) return null
    return convertArgsByType(value, elementType, parser)
  }
  if ('array' in type) {
    const elementType = type['array']
    const listValue = value.split(',')
    return listValue.map((val) =>
      convertArgsByType(val, elementType[0], parser),
    )
  }
  if ('vec' in type) {
    const elementType = type['vec']
    const listValue = value.split(',')
    return listValue.map((val) => convertArgsByType(val, elementType, parser))
  }
  if ('defined' in type) {
    const elementType = type['defined']
    const definedTypes = parser.idl?.types || []
    const definedType = definedTypes.find((e) => e.name === elementType)
    if (!definedType) throw new Error('Invalid type' + type)
    // Enum
    if (definedType.type.kind === 'enum')
      return { [value.substring(0, 1).toLowerCase() + value.substring(1)]: {} }
    // Struct
    if (definedType.type.kind === 'struct') {
      const structData: { [x: string]: any } = {}
      const valueObject = JSON.parse(JSON.stringify(value))
      for (const field of definedType.type.fields) {
        structData[field.name] = convertArgsByType(
          valueObject[field.name],
          type,
          parser,
        )
      }
      return structData
    }
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
