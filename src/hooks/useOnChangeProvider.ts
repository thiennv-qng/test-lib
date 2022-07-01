import { web3 } from '@project-serum/anchor'
import { Address } from '@project-serum/anchor'
import { useParser } from 'providers/parser.provider'

export const useOnChangeProvider = () => {
  const { setAccountsMeta } = useParser()

  const onChangeAccount = (accName: string, value: Address) => {
    setAccountsMeta({ name: accName, data: { publicKey: value.toString() } })
  }

  const onCreateAccount = (accName: string) => {
    const keypair = web3.Keypair.generate()
    setAccountsMeta({
      name: accName,
      data: {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Buffer.from(keypair.secretKey).toString('hex'),
      },
    })
  }

  return { onChangeAccount, onCreateAccount }
}
