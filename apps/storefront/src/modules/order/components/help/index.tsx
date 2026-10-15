import { Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="text-sm font-medium text-foreground">
        Serve aiuto?
      </Heading>
      <div className="my-2 text-sm text-muted">
        <ul className="flex flex-col gap-y-2">
          <li>
            <LocalizedClientLink href="/#contatti" className="hover:text-coffee">
              Contattaci
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
