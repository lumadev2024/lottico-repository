import { loadEnv, defineConfig, MedusaError } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const isProduction = process.env.NODE_ENV === 'production'

const bankTransferOptions = {
  account_holder: process.env.BANK_TRANSFER_ACCOUNT_HOLDER,
  iban: process.env.BANK_TRANSFER_IBAN,
  bic: process.env.BANK_TRANSFER_BIC,
  bank_name: process.env.BANK_TRANSFER_BANK_NAME,
}

const bankTransferConfigured = Boolean(
  bankTransferOptions.account_holder && bankTransferOptions.iban
)

if (!bankTransferConfigured && !isProduction) {
  console.warn(
    '[bank-transfer] BANK_TRANSFER_ACCOUNT_HOLDER / BANK_TRANSFER_IBAN non configurati: ' +
      'il metodo "Bonifico bancario" resta attivo in sviluppo per poter testare il flusso, ' +
      'ma va completato prima di andare in produzione.'
  )
}

const supabaseStorageOptions = {
  endpoint: process.env.SUPABASE_S3_ENDPOINT,
  region: process.env.SUPABASE_S3_REGION,
  access_key_id: process.env.SUPABASE_S3_ACCESS_KEY_ID,
  secret_access_key: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
  bucket: process.env.SUPABASE_STORAGE_BUCKET,
  file_url: process.env.SUPABASE_STORAGE_PUBLIC_URL,
  // Supabase's S3-compatible API requires path-style addressing, and its
  // object ownership model doesn't support per-object ACLs the way AWS S3
  // does — public read access comes from the bucket's own "Public" setting,
  // so no ACL header should be sent at all.
  additional_client_config: { forcePathStyle: true },
  acl: false as const,
}

const supabaseStorageConfigured = Boolean(
  supabaseStorageOptions.endpoint &&
    supabaseStorageOptions.region &&
    supabaseStorageOptions.access_key_id &&
    supabaseStorageOptions.secret_access_key &&
    supabaseStorageOptions.bucket &&
    supabaseStorageOptions.file_url
)

if (!supabaseStorageConfigured && !isProduction) {
  console.warn(
    '[file-storage] SUPABASE_S3_* / SUPABASE_STORAGE_* non configurati: ' +
      'gli upload restano sul filesystem locale del backend (file-local), ' +
      'da sostituire prima di andare in produzione — su Railway il filesystem è effimero.'
  )
}

if (!supabaseStorageConfigured && isProduction) {
  throw new MedusaError(
    MedusaError.Types.INVALID_DATA,
    '[file-storage] SUPABASE_S3_* / SUPABASE_STORAGE_* mancanti in produzione: ' +
      'il filesystem locale non persiste su Railway. Configura Supabase Storage prima del deploy.'
  )
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [
    {
      resolve: "./src/modules/eyewear",
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // Registering only the system default here is redundant — Medusa
          // always registers it — so this array only needs our own provider.
          ...(bankTransferConfigured || !isProduction
            ? [
                {
                  resolve: "./src/modules/bank-transfer",
                  id: "default",
                  options: bankTransferOptions,
                },
              ]
            : []),
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          supabaseStorageConfigured
            ? {
                resolve: "@medusajs/file-s3",
                id: "s3",
                options: supabaseStorageOptions,
              }
            : {
                resolve: "@medusajs/file-local",
                id: "local",
              },
        ],
      },
    },
  ],
})
