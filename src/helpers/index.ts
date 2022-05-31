import { Idl, AnchorProvider, web3 } from '@project-serum/anchor'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { Connection, PublicKey } from '@solana/web3.js'
import { AccountsMeta } from 'providers/parser.provider'

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

export const getAnchorProvider = (connection: Connection) => {
  const keyPair = web3.Keypair.generate()
  const wallet = new NodeWallet(keyPair)
  return new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    skipPreflight: true,
  })
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
