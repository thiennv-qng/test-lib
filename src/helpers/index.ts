import { Idl, web3, BN } from '@project-serum/anchor'
import { IdlInstruction } from '@project-serum/anchor/dist/cjs/idl'
import { PublicKey } from '@solana/web3.js'
import { AccountsMeta, ArgsMeta } from 'providers/parser.provider'

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
    return '-'
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

export const normalizeAnchorArgs = (
  data: ArgsMeta,
  instructionIdl: IdlInstruction,
) => {
  const normalizedArgs = Object.values(data).map((value, idx) => {
    let paramType = IdlParser.getTypeOfParam(instructionIdl?.args[idx].type)
    switch (paramType) {
      case 'publicKey':
        return new PublicKey(value)
      case 'bool':
        return Boolean(value)
      case 'u64':
      case 'u128':
      case 'i64':
      case 'i128':
        return new BN(value)
      case 'u8':
      case 'u16':
      case 'u32':
      case 'i8':
      case 'i16':
      case 'i32':
      case 'f32':
      case 'f64':
        return Number(value)
      case 'bool []':
        const separatedBoolean = value.split(',').map((value) => Boolean(value))
        return separatedBoolean
      case 'u64 []':
      case 'u128 []':
      case 'i64 []':
      case 'i128 []':
        const separatedBN = value.split(',').map((value) => new BN(value))
        return separatedBN
      case 'u8 []':
      case 'u16 []':
      case 'u32 []':
      case 'i8 []':
      case 'i16 []':
      case 'i32 []':
      case 'f32 []':
      case 'f64 []':
        const separatedNumber = value.split(',').map((value) => Number(value))
        return separatedNumber
      case 'Option<T>':
        return value
      case 'Enum':
        return value
      case 'Struct':
        return value
      case '[T; N]':
      case 'Vec<T>':
        const separatedValues = value.split(',')
        return separatedValues
      case 'String':
        const pubKey = value.split(',').map((value) => new PublicKey(value))
        return pubKey
      case 'MintActionState []':
        const actions = value.split(',').map((value) => value)
        return actions
      default:
        return value
    }
  })
  return normalizedArgs
}
