/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SIGNBUDDY_LETTER_URI: string
  readonly VITE_SIGNBUDDY_CHECKCOURSE_URI: string
  readonly VITE_SIGNBUDDY_ALPHABETCOURSE_URI: string
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENTID: string
  readonly VITE_AUTH0_REDIRECTURI: string
  readonly VITE_AUTH0_AUDIENCE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}