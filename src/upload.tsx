import { Fragment } from 'react'
import { Idl } from '@project-serum/anchor'

import Typography from './typography'

import { useParser } from './providers/parser.provider'

export const UploadFile = () => {
  const { parser, removeIdl } = useParser()
  const { idl, programAddress } = parser || {}

  const remove = () => {
    removeIdl()
    return true
  }
  const isEmptyProgramAddr = !programAddress

  if (!idl) return <UploadIdl />

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-nowrap justify-between gap-[6px] border border-solid rounded-[8px] px-[16px] py-[10px]">
        <div className="w-[24px]">
          <svg
            className="w-[inherit] h-auto"
            width="512"
            height="512"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M208 64H274.75C283.234 64.0013 291.37 67.3716 297.37 73.37L438.63 214.63C444.628 220.63 447.999 228.766 448 237.25V432C448 444.73 442.943 456.939 433.941 465.941C424.939 474.943 412.73 480 400 480H192C179.27 480 167.061 474.943 158.059 465.941C149.057 456.939 144 444.73 144 432V304"
              stroke="black"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M288 72V192C288 200.487 291.371 208.626 297.373 214.627C303.374 220.629 311.513 224 320 224H440"
              stroke="black"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M160 80V232C160.042 235.163 159.449 238.303 158.258 241.233C157.067 244.164 155.3 246.826 153.063 249.063C150.826 251.3 148.164 253.067 145.233 254.258C142.303 255.449 139.163 256.042 136 256C124 256 112 246.9 112 232V88C112 57.41 128.57 32 160 32C191.43 32 208 56.8 208 87.38V226.13C208 269.13 180.18 304 136 304C91.82 304 64 269.14 64 226.13V144"
              stroke="black"
              strokeWidth="32"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <Typography className="flex-auto">{idl?.name}</Typography>
        <div className="w-[24px] cursor-pointer" onClick={remove}>
          <svg
            className="w-[inherit] h-auto"
            width="512"
            height="512"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M368 368L144 144"
              stroke="black"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M368 144L144 368"
              stroke="black"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {isEmptyProgramAddr && (
        <Typography style={{ color: '#F9575E', fontSize: 12 }}>
          The program address is undefined. Please update your IDL to use
          program.
        </Typography>
      )}
    </div>
  )
}

export const UploadIdl = () => {
  const { uploadIdl, parser } = useParser()
  const { idl } = parser || {}

  const upload = (file: FileList | null) => {
    if (!file) return
    const fileReader = new FileReader()
    fileReader.readAsText(file[0], 'UTF-8')
    fileReader.onload = (e) => {
      try {
        if (!e.target?.result) return
        const idl = JSON.parse(e.target.result.toString()) as Idl
        let validIdl = idl.name && idl.instructions.length && idl.version
        if (validIdl) return uploadIdl(idl)
      } catch (err: any) {
        // do notthing
      }
    }
  }

  if (!!idl) return <Fragment />

  return (
    <div className="relative border border-dashed rounded-[8px] p-[24px]">
      <label>
        <input
          type="file"
          accept=".json"
          onChange={(e) => upload(e.target.files)}
          className="absolute opacity-0 w-full h-full top-0 left-0 z-10 cursor-pointer"
        />
        <div className="flex flex-col items-center">
          <div className="w-[24px]">
            <svg
              className="w-[inherit] h-auto mb-[16px]"
              width="512"
              height="512"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M320 367.789H396C451 367.789 496 338.579 496 284.189C496 229.799 443 202.719 400 200.589C391.11 115.529 329 63.7891 256 63.7891C187 63.7891 142.56 109.579 128 154.989C68 160.689 16 198.869 16 261.389C16 323.909 70 367.789 136 367.789H192"
                stroke="black"
                strokeWidth="32"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M320 255.789L256 191.789L192 255.789"
                stroke="black"
                strokeWidth="32"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M256 448.209V207.789"
                stroke="black"
                strokeWidth="32"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Typography>Upload</Typography>
          <Typography>Support JSON</Typography>
        </div>
      </label>
    </div>
  )
}
