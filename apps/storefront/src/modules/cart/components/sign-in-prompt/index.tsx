import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between rounded-card border border-border bg-surface p-4">
      <div>
        <Heading level="h2" className="text-base font-medium text-foreground">
          Hai già un account?
        </Heading>
        <Text className="mt-1 text-sm text-muted">
          Accedi per un&apos;esperienza più rapida. Puoi comunque procedere
          senza registrarti.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="coffee-outline"
            className="h-10"
            data-testid="sign-in-button"
          >
            Accedi
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
